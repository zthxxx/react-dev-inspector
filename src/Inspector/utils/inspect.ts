import type { Fiber } from 'react-reconciler'
import launchEditorEndpoint from 'react-dev-utils/launchEditorEndpoint'
import queryString from 'query-string'
import {
  isNativeTagFiber,
  isReactSymbolFiber,
  isForwardRef,
  getDirectParentFiber,
  getFiberName,
  getElementFiberUpward,
} from './fiber'


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

export const getCodeInfoFromFiber = (fiber?: Fiber): CodeInfo | undefined => {
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

/**
 * try to get react component reference fiber from the dom fiber
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
export const getReferenceFiber = (baseFiber?: Fiber): Fiber | undefined => {
  if (!baseFiber) return undefined

  const directParent = getDirectParentFiber(baseFiber)
  if (!directParent) return undefined

  const isParentNative = isNativeTagFiber(directParent)
  const isOnlyOneChild = !directParent.child!.sibling

  let referenceFiber = (!isParentNative && isOnlyOneChild)
    ? directParent
    : baseFiber

  while (referenceFiber) {
    if (getCodeInfoFromFiber(referenceFiber)) return referenceFiber

    referenceFiber = referenceFiber.return!
  }

  return undefined
}

export const getElementCodeInfo = (element: HTMLElement): CodeInfo | undefined => {
  const fiber: Fiber | undefined = getElementFiberUpward(element)

  const referenceFiber = getReferenceFiber(fiber)
  return getCodeInfoFromFiber(referenceFiber)
}

export const gotoEditor = (source?: CodeInfo) => {
  if (!source) return

  const { relativePath, lineNumber, columnNumber } = source

  const launchParams = {
    fileName: relativePath,
    lineNumber,
    colNumber: columnNumber,
  }

  /**
   * api in 'react-dev-inspector/plugins/webpack/launchEditorMiddleware'
   */
  fetch(`${launchEditorEndpoint}/relative?${queryString.stringify(launchParams)}`)
}

export const getNamedFiber = (baseFiber?: Fiber): Fiber | undefined => {
  let fiber = baseFiber

  while (fiber) {
    let parent = fiber.return ?? undefined
    let forwardParent: Fiber | undefined

    while (isReactSymbolFiber(parent)) {
      if (isForwardRef(parent)) {
        forwardParent = parent
      }
      parent = parent?.return ?? undefined
    }

    if (forwardParent) {
      fiber = forwardParent
    }

    if (
      getFiberName(fiber)
      && getCodeInfoFromFiber(fiber)
    ) {
      return fiber
    }

    fiber = parent!
  }

  return undefined
}

export const getElementInspect = (element: HTMLElement): {
  fiber?: Fiber,
  name?: string,
  title: string,
} => {
  const fiber = getElementFiberUpward(element)
  const referenceFiber = getReferenceFiber(fiber)

  const namedFiber = getNamedFiber(referenceFiber)

  const fiberName = getFiberName(namedFiber)
  const nodeName = element.nodeName.toLowerCase()

  const title = fiberName
    ? `${nodeName} in <${fiberName}>`
    : nodeName

  return {
    fiber: referenceFiber,
    name: fiberName,
    title,
  }
}
