import path from 'path'
import type { Fiber } from 'react-reconciler'
import launchEditorEndpoint from 'react-dev-utils/launchEditorEndpoint'
import queryString from 'query-string'


export interface CodeInfo {
  lineNumber: string,
  columnNumber: string,
  relativePath: string,
}

export const getElementCodeInfo = (element: HTMLElement): CodeInfo | undefined => {
  if (!element?.dataset) return undefined

  const { dataset } = element

  // data attributes auto create by loader in webpack plugin `inspector-loader`
  const lineNumber = dataset.inspectorLine
  const columnNumber = dataset.inspectorColumn
  const relativePath = dataset.inspectorRelativePath

  if (lineNumber && columnNumber && relativePath) {
    return {
      lineNumber,
      columnNumber,
      relativePath,
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
