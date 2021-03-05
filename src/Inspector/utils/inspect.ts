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
 * like <div data-inspector-line="2" data-inspector-column="3" data-inspector-relative-path="xxx/ooo" />
 * this props will be record in fiber
 */
export interface CodeDataAttribute {
  'data-inspector-line': string,
  'data-inspector-column': string,
  'data-inspector-relative-path': string,
}

/**
 * find first parent of native html tag or react component,
 * skip react Provider / Context / ForwardRef / Fragment etc.
 */
export const getDirectParentFiber = (child: Fiber): Fiber | null => {
  let current = child.return
  while (current) {
    /**
     * react fiber symbol types see:
     * https://github.com/facebook/react/blob/v17.0.0/packages/shared/ReactSymbols.js#L39-L58
     */
    if (typeof current.type?.$$typeof !== 'symbol') {
      return current
    }
    current = current.return
  }
  return null
}

/**
 * only native html tag fiber's type will be string,
 * all the others (component / functional component / context) type will be function or object
 */
export const isNativeTagFiber = (fiber: Fiber): boolean => typeof fiber.type === 'string'

/**
 * try to get react component reference fiber from the dom fiber
 *
 * rules:
 *
 * example code:
 *
 * ```jsx
 *   S.TitleName = styled.h1``
 *   Title = ({ children }) => (<S.TitleName>{children}</S.TitleName>)
 *   Title = ({ children }) => (
 *     <>
 *       <S.TitleName>{children}</S.TitleName>
 *       <span>xxx</span>
 *       <div><div>
 *     </>
 *   )
 *
 *   <Title>
 *     <span>React Dev Inspector</span>
 *   </Title>
 * ```
 *
 * fiber examples see below:
 * *******************************************************
 *
 *  div                                       div
 *    └─ h1                                     └─ h1  (<--base) <--reference
 *      └─ span  (<--base) <--reference           └─ span
 *
 * *******************************************************
 *
 *  Title  <--reference                       Title
 *    └─ h1  (<--base)                          └─ h1  (<--base) <--reference
 *      └─ span                                 └─ span
 *                                              └─ div
 *
 * *******************************************************
 *
 *  Title  <- reference                       Title  <- reference
 *    └─ TitleName [ForwardRef]                 └─ TitleName [ForwardRef]
 *      └─ Context.Customer                       └─ Context.Customer
 *         └─ Context.Customer                      └─ Context.Customer
 *          └─ h1  (<- base)                          └─ h1  (<- base)
 *            └─ span                             └─ span
 *                                                └─ div
 *
 * *******************************************************
 *
 *  Title
 *    └─ TitleName [ForwardRef]
 *      └─ Context.Customer
 *         └─ Context.Customer
 *          └─ h1  (<- base) <- reference
 *    └─ span
 *    └─ div
 */
export const getReferenceFiber = (baseFiber?: Fiber): Fiber | null => {
  if (!baseFiber) return undefined

  const directParent = getDirectParentFiber(baseFiber)
  if (!directParent) return undefined

  const isParentNative = isNativeTagFiber(directParent)
  const isOnlyOneChild = !directParent.child.sibling

  const referenceFiber = (!isParentNative && isOnlyOneChild)
    ? directParent
    : baseFiber

  return referenceFiber
}

export const getCodeInfoFromProps = (fiber?: Fiber): CodeInfo | undefined => {
  if (!fiber?.pendingProps) return undefined

  // inspector data attributes inject by `plugins/webpack/inspector-loader`
  const {
    'data-inspector-line': lineNumber,
    'data-inspector-column': columnNumber,
    'data-inspector-relative-path': relativePath,
  } = fiber.pendingProps as CodeDataAttribute

  if (lineNumber && columnNumber && relativePath) {
    return {
      lineNumber,
      columnNumber,
      relativePath,
    }
  }

  return undefined
}

export const getElementCodeInfo = (element: HTMLElement): CodeInfo | undefined => {
  const fiber: Fiber | null = getElementFiber(element)

  const referenceFiber = getReferenceFiber(fiber)
  return getCodeInfoFromProps(referenceFiber)
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

export const getNamedFiber = (baseFiber?: Fiber): Fiber | null => {
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
  const fiberType = getNamedFiber(fiber)?.type
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
  const fiber = getElementFiber(element)
  const referenceFiber = getReferenceFiber(fiber)
  const namedFiber = getNamedFiber(fiber)

  const fiberName = getFiberName(namedFiber)
  const nodeName = element.nodeName.toLowerCase()

  const elementName = fiberName
    ? fiberName
    : nodeName

  const title = (sourcePath && referenceFiber !== fiber)
    ? `<${elementName}>`
    : `${nodeName} in <${fiberName}>`

  return {
    fiber: referenceFiber,
    name: fiberName,
    title,
  }
}
