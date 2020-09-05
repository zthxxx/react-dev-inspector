import path from 'path'
import { Fiber } from 'react-reconciler'
import launchEditorEndpoint from 'react-dev-utils/launchEditorEndpoint'
import queryString from 'query-string'


export interface CodeInfo {
  lineNumber: string,
  columnNumber: string,
  relativePath: string,
}

export const getElementCodeInfo = (element: HTMLElement): CodeInfo => {
  if (!element?.dataset) return null

  const { dataset } = element

  // data attributes auto create by loader in webpack plugin `inspector-loader`
  const lineNumber = dataset.inspectorLine
  const columnNumber = dataset.inspectorColumn
  const relativePath = dataset.inspectorRelativePath

  if (relativePath) {
    return {
      lineNumber,
      columnNumber,
      relativePath,
    }
  }

  if (element.parentElement) {
    return getElementCodeInfo(element.parentElement)
  }

  return null
}

export const gotoEditor = (source?: CodeInfo) => {
  // PWD auto defined in umi plugin `react-inspector`
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
export const getElementFiber = (element: HTMLElement): Fiber => {
  const fiberKey = Object.keys(element).find(
    key => key.startsWith('__reactInternalInstance$'),
  )

  if (fiberKey) {
    return element[fiberKey] as Fiber
  }

  return null
}


export const debugToolNameRegex = /^(.*?\.Provider|.*?\.Consumer|Anonymous|Trigger|Tooltip|_.*|[a-z].*)$/

export const getFiberName = (fiber: Fiber): string => {
  let prevFiber = fiber
  while (prevFiber) {
    const name = prevFiber.type?.displayName
    if (name && !debugToolNameRegex.test(name)) {
      return name
    }

    prevFiber = prevFiber.return
  }
}

export const getReactElementName = (element: HTMLElement): string => {
  const fiber = getElementFiber(element)
  if (!fiber) return null
  return getFiberName(fiber)
}

export const getElementInspectTitle = (element: HTMLElement, sourcePath?: string): string => {
  const ownerName = getReactElementName(element)
  const nodeName = element.nodeName.toLowerCase()

  const componentName = ownerName
    ? ownerName
    : nodeName

  return sourcePath
    ? `<${componentName}>`
    : `${nodeName} in <${ownerName}>`
}
