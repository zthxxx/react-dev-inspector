import path from 'path'
import type { Fiber } from 'react-reconciler'
import launchEditorEndpoint from 'react-dev-utils/launchEditorEndpoint'
import queryString from 'query-string'

export interface CodeInfo {
  lineNumber: string,
  columnNumber: string,
  relativePath: string,
}

/**
 * props that injected into react nodes
 *
 * like < div data-inspector-line="2" data-inspector-column="3" data-inspector-relative-path="xxx" />
 * this props will be record in fiber
 */
interface InjectCodeInfo {
  'data-inspector-line': string,
  'data-inspector-column': string,
  'data-inspector-relative-path': string,
}

const getCodeInfoFromInjectCodeInfo = (injectCodeInfo: InjectCodeInfo) => {
  const lineNumber = injectCodeInfo['data-inspector-line']
  const columnNumber = injectCodeInfo['data-inspector-column']
  const relativePath = injectCodeInfo['data-inspector-relative-path']

  if (lineNumber && columnNumber && relativePath) {
    return {
      lineNumber,
      columnNumber,
      relativePath,
    }
  }

  return undefined
}

/**
 * judge if the inspected element is a component
 */
const isComponentFiber = (fiber: Fiber) => {
  if (fiber.index || fiber.sibling) {
    /**
     * a special case like:
     *
     * const App = () => {
     *  return (
     *    <>
     *      <p> my fiber.sibling is div and my fiber.index = 0 </p>
     *      <div> my fiber.sibling is null but my fiber.index = 1 </div>
     *      both of p's and div's father fiber are App's fiber, but they are not components
     *    </>
     *  )
     * }
     */
    return false
  }
  /**
   * a actual dom node's return property of fiber points to its father fiber(component's fiber)
   *
   * such as: const App = () => <div line="2" />; --> inspected element fiber
   * <App line="1"/> --> father fiber
   * component fiber doesn't has the stateNode(actual dom node)
   */
  const fatherFiber = fiber?.return
  return !fatherFiber.stateNode
}

/**
 * get code info from normal nodes like div, span
 */
export const getCodeInfoFromNodeFiber = (fiber: Fiber): InjectCodeInfo => fiber.pendingProps

/**
 * fiber?.return points to component fiber,
 * both pendingProps and memoizedProps record the runtime props
 */
export const getCodeInfoFromComponentFiber = (fiber: Fiber): InjectCodeInfo => fiber?.return.pendingProps

export const getElementCodeInfo = (element: HTMLElement): CodeInfo | undefined => {
  // data attributes auto create by loader in webpack plugin `inspector-loader`
  if (!element?.dataset) return undefined

  const inspectedFiber: Fiber | null = getElementFiber(element)

  if (!inspectedFiber) return undefined

  const isComponent = isComponentFiber(inspectedFiber)
  /**
   * the components and the normal nodes they can't share common logic to get the code info
   *
   * components get code info from father fiber
   * normal nodes get code info from current fiber
   */
  const codePositionInfo: InjectCodeInfo = isComponent
    ? getCodeInfoFromComponentFiber(inspectedFiber)
    : getCodeInfoFromNodeFiber(inspectedFiber)

  const codeInfo = getCodeInfoFromInjectCodeInfo(codePositionInfo)

  if (codeInfo) {
    return codeInfo
  }

  /**
   * a special deal in case that a component's father fiber is Context.comsumer or forwardRef fiber
   * current handling is to get current' fiber's codeInfo
   *
   * TODO: judge fiber by tag and recursive upward to get component's fiber
   */
  if (isComponent) {
    const currentFiberInjectCodeInfo = getCodeInfoFromNodeFiber(inspectedFiber)
    const currentFiberCodeInfo = getCodeInfoFromInjectCodeInfo(currentFiberInjectCodeInfo)
    if (currentFiberCodeInfo) {
      return currentFiberCodeInfo
    }
  }

  if (element.parentElement) {
    return getElementCodeInfo(element.parentElement)
  }

  return undefined
}


export const gotoEditor = (source?: CodeInfo) => {
  // PWD auto defined in webpack plugin `config-inspector`
  const pwd = process.env.PWD
  if (!source || !pwd) return

  const { relativePath, lineNumber, columnNumber } = source

  const fileName = path.join(pwd, relativePath)

  const launchParams = {
    fileName,
    lineNumber,
    colNumber: columnNumber,
  }

  /**
   * api createLaunchEditorMiddleware in 'react-dev-utils/errorOverlayMiddleware'
   * auto launch in umi plugin `react-inspector`
   */
  fetch(`${launchEditorEndpoint}?${queryString.stringify(launchParams)}`)
}

/**
 * https://stackoverflow.com/questions/29321742/react-getting-a-component-from-a-dom-element-for-debugging
 */
export const getElementFiber = (element: HTMLElement): Fiber | null => {
  const fiberKey = Object.keys(element).find(key => (
    /**
     * for react <= v16.13.1
     * https://github.com/facebook/react/blob/v16.13.1/packages/react-dom/src/client/ReactDOMComponentTree.js#L21
     */
    key.startsWith('__reactInternalInstance$')
    /**
     * for react >= v16.14.0
     * https://github.com/facebook/react/blob/v16.14.0/packages/react-dom/src/client/ReactDOMComponentTree.js#L39
     */
    || key.startsWith('__reactFiber$')
  ))

  if (fiberKey) {
    return element[fiberKey] as Fiber
  }

  return null
}


export const debugToolNameRegex = /^(.*?\.Provider|.*?\.Consumer|Anonymous|Trigger|Tooltip|_.*|[a-z].*)$/

export const getSuitableFiber = (baseFiber?: Fiber): Fiber | null => {
  let fiber = baseFiber

  while (fiber) {
    const name = fiber.type?.displayName ?? fiber.type?.name
    if (name && !debugToolNameRegex.test(name)) {
      return fiber
    }

    fiber = fiber.return
  }

  return null
}

export const getFiberName = (fiber?: Fiber): string | undefined => {
  const fiberType = getSuitableFiber(fiber)?.type
  let displayName: string | undefined

  // The displayName property is not guaranteed to be a string.
  // It's only safe to use for our purposes if it's a string.
  // github.com/facebook/react-devtools/issues/803
  //
  // https://github.com/facebook/react/blob/v17.0.0/packages/react-devtools-shared/src/utils.js#L90-L112
  if (typeof fiberType?.displayName === 'string') {
    displayName = fiberType.displayName
  } else if (typeof fiberType?.name === 'string') {
    displayName = fiberType.name
  }

  return displayName
}

export const getElementInspect = (element: HTMLElement, sourcePath?: string): {
  fiber?: Fiber,
  name?: string,
  title: string,
} => {
  const fiber = getSuitableFiber(getElementFiber(element))
  const fiberName = getFiberName(fiber)
  const nodeName = element.nodeName.toLowerCase()

  const elementName = fiberName
    ? fiberName
    : nodeName

  const title = sourcePath
    ? `<${elementName}>`
    : `${nodeName} in <${fiberName}>`

  return {
    fiber,
    name: fiberName,
    title,
  }
}
