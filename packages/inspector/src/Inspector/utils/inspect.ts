import type { Fiber, Source } from 'react-reconciler'
import type {
  TagItem,
} from '@react-dev-inspector/web-components'
import type {
  InspectAgent,
  CodeInfo,
  CodeDataAttribute,
  InspectChainItem,
} from '../types'
import {
  isNativeTagFiber,
  isReactSymbolFiber,
  isForwardRef,
  getDirectParentFiber,
  getFiberName,
  getElementFiberUpward,
  getDisplayNameForFiber,
  getTagTextFromFiber,
} from './fiber'


/**
 * react fiber property `_debugSource` created by `@babel/plugin-transform-react-jsx-source`
 *     https://github.com/babel/babel/blob/v7.16.4/packages/babel-plugin-transform-react-jsx-source/src/index.js
 *
 * and injected `__source` property used by `React.createElement`, then pass to `ReactElement`
 *     https://github.com/facebook/react/blob/v18.0.0/packages/react/src/ReactElement.js#L189
 *     https://github.com/facebook/react/blob/v18.0.0/packages/react/src/ReactElement.js#L389
 *     https://github.com/facebook/react/blob/v18.0.0/packages/react/src/ReactElement.js#L447
 *
 * finally, used by `createFiberFromElement` to become a fiber property `_debugSource`.
 *     https://github.com/facebook/react/blob/v18.0.0/packages/react-reconciler/src/ReactFiber.new.js#L648-L649
 */
export const getCodeInfoFromDebugSource = (fiber?: Fiber): CodeInfo | undefined => {
  if (!fiber)
    return undefined

  /**
   * only find forward with 2 level _debugOwner, otherwise to normal `fiber.return`
   */
  const debugSource = (
    fiber._debugSource
    ?? fiber._debugOwner?._debugSource
    ?? fiber._debugOwner?._debugOwner?._debugSource
  ) as Source & { columnNumber?: number }

  if (!debugSource)
    return undefined

  const {
    fileName,
    lineNumber,
    columnNumber,
  } = debugSource

  if (fileName && lineNumber) {
    return {
      lineNumber: String(lineNumber),
      columnNumber: String(columnNumber ?? 1),

      /**
       * `fileName` in `_debugSource` is absolutely
       * ---
       *
       * compatible with the incorrect `fileName: "</xxx/file>"` by [rspack](https://github.com/web-infra-dev/rspack)
       */
      absolutePath: fileName.match(/^<.*>$/)
        ? fileName.replace(/^<|>$/g, '')
        : fileName,
    }
  }

  return undefined
}

/**
 * code location data-attribute props inject by `@react-dev-inspector/babel-plugin`
 */
export const getCodeInfoFromProps = (fiber?: Fiber): CodeInfo | undefined => {
  if (!fiber?.pendingProps)
    return undefined

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

export const getCodeInfoFromFiber = (fiber?: Fiber): CodeInfo | undefined => {
  const codeInfos = [
    getCodeInfoFromDebugSource(fiber),
    getCodeInfoFromProps(fiber),
  ].filter(Boolean) as CodeInfo[]

  if (!codeInfos.length)
    return undefined
  return Object.assign({}, ...codeInfos)
}

/**
 * give a `base` dom fiber,
 * and will try to get the human-friendly react component `reference` fiber from it;
 *
 * rules and examples see below:
 * *******************************************************
 *
 * if parent is html native tag, `reference` is considered to be as same as `base`
 *
 *  div                                       div
 *    └─ h1                                     └─ h1  (<--base) <--reference
 *      └─ span  (<--base) <--reference           └─ span
 *
 * *******************************************************
 *
 * if parent is NOT html native tag,
 *   and parent ONLY have one child (the `base` itself),
 *   then `reference` is considered to be the parent.
 *
 *  Title  <--reference                       Title
 *    └─ h1  (<--base)                          └─ h1  (<--base) <--reference
 *      └─ span                                 └─ span
 *                                              └─ div
 *
 * *******************************************************
 *
 * while follow the last one,
 *   "parent" is considered to skip continuous Provider/Customer/ForwardRef components
 *
 *  Title  <- reference                       Title  <- reference
 *    └─ TitleName [ForwardRef]                 └─ TitleName [ForwardRef]
 *      └─ Context.Customer                       └─ Context.Customer
 *         └─ Context.Customer                      └─ Context.Customer
 *          └─ h1  (<- base)                          └─ h1  (<- base)
 *            └─ span                             └─ span
 *                                                └─ div
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
  if (!baseFiber)
    return undefined

  const directParent = getDirectParentFiber(baseFiber)
  if (!directParent)
    return undefined

  const isParentNative = isNativeTagFiber(directParent)
  const isOnlyOneChild = !directParent.child!.sibling

  let referenceFiber = (!isParentNative && isOnlyOneChild)
    ? directParent
    : baseFiber

  // fallback for cannot find code-info fiber when traverse to root
  const originReferenceFiber = referenceFiber

  while (referenceFiber) {
    if (getCodeInfoFromFiber(referenceFiber))
      return referenceFiber

    referenceFiber = referenceFiber.return!
  }

  return originReferenceFiber
}

/**
 * find a human-friendly named fiber with source-code upward from element
 * return source-code info
 */
export const getElementCodeInfo = (element: Element): CodeInfo | undefined => {
  const fiber: Fiber | undefined = getElementFiberUpward(element)

  const referenceFiber = getReferenceFiber(fiber)
  return getCodeInfoFromFiber(referenceFiber)
}

/**
 * find a fiber with both name and source-code info upward,
 */
export const getNamedFiber = (baseFiber?: Fiber): Fiber | undefined => {
  let fiber = baseFiber

  // fallback for cannot find code-info fiber when traverse to root
  let originNamedFiber: Fiber | undefined

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

    if (getFiberName(fiber)) {
      if (!originNamedFiber)
        originNamedFiber = fiber

      if (getCodeInfoFromFiber(fiber))
        return fiber
    }

    fiber = parent!
  }

  return originNamedFiber
}

/**
 * find a human-friendly named fiber with source-code upward from element,
 * return inspection info
 */
export const getElementInspect = (element: Element): {
  fiber?: Fiber;
  name: string;
  title: string;
} => {
  const fiber = getElementFiberUpward(element)
  const referenceFiber = getReferenceFiber(fiber)

  const namedFiber = getNamedFiber(referenceFiber)

  const nodeName = element.nodeName.toLowerCase()
  let fiberName = getFiberName(namedFiber)
  if (fiberName === nodeName) {
    fiberName = getFiberName(namedFiber?.return)
  }

  const title = (fiberName && !(fiberName === nodeName))
    ? `${nodeName} in <${fiberName}>`
    : nodeName

  return {
    fiber: referenceFiber,
    name: fiberName || nodeName,
    title,
  }
}

export const getPathWithLineNumber = (codeInfo?: CodeInfo): string | undefined => {
  let path = codeInfo?.relativePath ?? codeInfo?.absolutePath
  if (codeInfo?.lineNumber) {
    path += `:${codeInfo.lineNumber}`
  }
  return path
}

/**
 * commonly use for {@link InspectAgent.getRenderChain}
 */
export function * genInspectChainFromFibers<Element>({
  agent,
  fibers,
  isAgentElement,
  getElementTags,
}: {
  agent: InspectAgent<Element>;
  fibers: Generator<Fiber, void, void>;
  isAgentElement: (element: unknown) => element is Element;
  getElementTags?: (element: unknown) => TagItem[];
}): Generator<InspectChainItem<Element>, unknown, void> {
  let lastElement: Element | null = null
  let fiber: Fiber | undefined

  for (fiber of fibers) {
    const displayName = getDisplayNameForFiber(fiber)
    const tagName = getTagTextFromFiber(fiber)
    const codeInfo = getCodeInfoFromFiber(fiber)
    const node = isAgentElement(fiber.stateNode)
      ? fiber.stateNode
      : undefined

    const element = node ?? lastElement
    lastElement = node ?? lastElement

    const tags: TagItem[] = getElementTags?.(node) ?? []
    if (tagName) {
      tags.push(tagName)
    }

    if (!displayName && !tags.length) {
      continue
    }

    yield {
      agent,
      element,
      title: displayName || '',
      subtitle: getPathWithLineNumber(codeInfo),
      tags,
      codeInfo,
    }
  }

  if (fiber) {
    const root: any = fiber.stateNode
    if (root && root.constructor?.name === 'FiberRootNode') {
      return root.containerInfo
    }
    return root
  }
}
