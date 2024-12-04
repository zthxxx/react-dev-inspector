import type { Fiber } from 'react-reconciler'
import type { InspectAgent } from '../types'


/**
 * only native html tag fiber's type will be string,
 * all the others (component / functional component / context) type will be function or object
 */
export const isNativeTagFiber = (fiber?: Fiber): boolean => typeof fiber?.type === 'string'

/**
 * react fiber symbol types see:
 * https://github.com/facebook/react/blob/v17.0.0/packages/shared/ReactSymbols.js#L39-L58
 */
export const isReactSymbolFiber = (fiber?: Fiber): boolean => typeof fiber?.type?.$$typeof === 'symbol'

export const isForwardRef = (fiber?: Fiber): boolean =>
  fiber?.type?.$$typeof === Symbol.for('react.forward_ref')


type ElementWithFiber = Element & {
  [fiberKey: string]: Fiber | undefined;
}

const cachedFiberKeys: Set<string> = new Set()

/**
 * get fiber via React renderer which registered by `reconciler.injectIntoDevTools()`
 * like: https://github.com/facebook/react/blob/v17.0.0/packages/react-dom/src/client/ReactDOM.js#L220
 */
const getFiberWithDevtoolHook = (element: any): Fiber | undefined => {
  if (!window.__REACT_DEVTOOLS_GLOBAL_HOOK__?.renderers)
    return

  const { renderers } = window.__REACT_DEVTOOLS_GLOBAL_HOOK__

  for (const renderer of renderers.values()) {
    try {
      const fiber = renderer.findFiberByHostInstance?.(element)

      if (fiber) {
        return fiber
      }
    }
    catch {}
  }
}


/**
 * https://stackoverflow.com/questions/29321742/react-getting-a-component-from-a-dom-element-for-debugging
 */
export const getElementFiber = (_element?: Element): Fiber | undefined => {
  const element = _element as ElementWithFiber
  if (!element) {
    return undefined
  }

  const fiberByDevtoolHook = getFiberWithDevtoolHook(element)
  if (fiberByDevtoolHook) {
    return fiberByDevtoolHook
  }

  for (const cachedFiberKey of cachedFiberKeys) {
    if (element[cachedFiberKey]) {
      return element[cachedFiberKey] as Fiber
    }
  }

  const fiberKey = Object.keys(element).find(key => (
    /**
     * for react >= v16.14.0
     * https://github.com/facebook/react/blob/v16.14.0/packages/react-dom/src/client/ReactDOMComponentTree.js#L39
     */
    key.startsWith('__reactFiber$')
    /**
     * for react <= v16.14.0
     * https://github.com/facebook/react/blob/v16.14.0/packages/react-dom/src/client/ReactDOMComponentTree.js#L21
     */
    || key.startsWith('__reactInternalInstance$')
  ))

  if (fiberKey) {
    cachedFiberKeys.add(fiberKey)
    return element[fiberKey] as Fiber
  }

  return undefined
}

export const getElementFiberUpward = (element: Element | null | undefined): Fiber | undefined => {
  if (!element)
    return undefined
  const fiber = getElementFiber(element)
  if (fiber)
    return fiber
  return getElementFiberUpward(element.parentElement)
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
    if (!isReactSymbolFiber(current)) {
      return current
    }
    current = current.return
  }
  return null
}

/**
 * return(parent) first of a fiber, typical use for {@link InspectAgent.getRenderChain}
 */
export function * genFiberRenderChain(fiber?: Fiber | null): Generator<Fiber, void, void> {
  while (fiber) {
    yield fiber
    if (fiber.return === fiber) {
      return
    }
    fiber = fiber.return
  }
}

/**
 * debugOwner first of a fiber, typical use for {@link InspectAgent.getSourceChain}
 */
export function * genFiberSourceChain(fiber?: Fiber | null): Generator<Fiber, void, void> {
  while (fiber) {
    yield fiber
    if (fiber.return === fiber || fiber._debugOwner === fiber) {
      return
    }
    fiber = fiber._debugOwner ?? fiber.return
  }
}

/**
 * The displayName property is not guaranteed to be a string.
 * It's only safe to use for our purposes if it's a string.
 * github.com/facebook/react-devtools/issues/803
 *
 * https://github.com/facebook/react/blob/v17.0.0/packages/react-devtools-shared/src/utils.js#L90-L112
 */
export const getFiberName = (fiber?: Fiber | null): string | undefined => {
  const fiberType = fiber?.type
  if (!fiberType)
    return undefined
  if (typeof fiberType === 'string')
    return fiberType

  const { displayName, name } = fiberType

  if (typeof displayName === 'string') {
    return displayName
  }
  else if (typeof name === 'string') {
    return name
  }

  return undefined
}


export const getTagTextFromFiber = (fiber: Fiber): string | undefined => {
  const { tag } = fiber

  switch (tag) {
    case ReactTypeOfWork.CacheComponent:
      return 'Cache'
    case ReactTypeOfWork.ForwardRef:
      return 'ForwardRef'
    case ReactTypeOfWork.MemoComponent:
    case ReactTypeOfWork.SimpleMemoComponent:
      return 'Memo'
    case ReactTypeOfWork.ContextProvider:
      return 'Provider'
    case ReactTypeOfWork.ContextConsumer:
      return 'Consumer'
    case ReactTypeOfWork.SuspenseComponent:
      return 'Suspense'
    case ReactTypeOfWork.OffscreenComponent:
      return 'Offscreen'
    case ReactTypeOfWork.ScopeComponent:
      return 'Scope'
    case ReactTypeOfWork.SuspenseListComponent:
      return 'SuspenseList'
    case ReactTypeOfWork.Profiler:
      return 'Profiler'
    case ReactTypeOfWork.TracingMarkerComponent:
      return 'TracingMarker'
    case ReactTypeOfWork.Fragment:
      return 'Fragment'
    case ReactTypeOfWork.LazyComponent:
      return 'Lazy'
  }
}

/**
 * https://github.com/facebook/react/blob/v18.3.0/packages/react-devtools-shared/src/backend/renderer.js#L434
 */
export const getDisplayNameForFiber = (fiber: Fiber): string | null => {
  const { elementType, type, tag } = fiber
  const resolvedType = resolveFiberType(type)

  switch (tag) {
    case ReactTypeOfWork.CacheComponent:
      return 'Cache'
    case ReactTypeOfWork.ClassComponent:
    case ReactTypeOfWork.IncompleteClassComponent:
      return getDisplayName(resolvedType)
    case ReactTypeOfWork.FunctionComponent:
    case ReactTypeOfWork.IndeterminateComponent:
      return getDisplayName(resolvedType)
    case ReactTypeOfWork.ForwardRef:
      // Mirror https://github.com/facebook/react/blob/7c21bf72ace77094fd1910cc350a548287ef8350/packages/shared/getComponentName.js#L27-L37
      return (
        type?.displayName
        || getDisplayName(resolvedType)
      )
    case ReactTypeOfWork.HostRoot: {
      const fiberRoot = fiber.stateNode
      if (fiberRoot != null && fiberRoot._debugRootType !== null) {
        return fiberRoot._debugRootType
      }
      return null
    }
    case ReactTypeOfWork.HostComponent:
      return type
    case ReactTypeOfWork.HostPortal:
    case ReactTypeOfWork.HostText:
    case ReactTypeOfWork.Fragment:
      return null
    case ReactTypeOfWork.LazyComponent:
      // This display name will not be user visible.
      // Once a Lazy component loads its inner component, React replaces the tag and type.
      // This display name will only show up in console logs when DevTools DEBUG mode is on.
      return 'Lazy'
    case ReactTypeOfWork.MemoComponent:
    case ReactTypeOfWork.SimpleMemoComponent:
      return (
        elementType?.displayName
        || type?.displayName
        || getDisplayName(resolvedType)
      )
    case ReactTypeOfWork.SuspenseComponent:
      return 'Suspense'
    case ReactTypeOfWork.LegacyHiddenComponent:
      return 'LegacyHidden'
    case ReactTypeOfWork.OffscreenComponent:
      return 'Offscreen'
    case ReactTypeOfWork.ScopeComponent:
      return 'Scope'
    case ReactTypeOfWork.SuspenseListComponent:
      return 'SuspenseList'
    case ReactTypeOfWork.Profiler:
      return fiber.memoizedProps.id
    case ReactTypeOfWork.TracingMarkerComponent:
      return 'TracingMarker'
    case ReactTypeOfWork.ContextConsumer:
      return `${type._context?.displayName || 'Context'}.Consumer`
    case ReactTypeOfWork.ContextProvider:
      return `${type._context?.displayName || 'Context'}.Provider`

    default:
      return null
  }
}

/**
 * resolve fiber.type to component
 *
 * https://github.com/facebook/react/blob/v18.3.0/packages/react-devtools-shared/src/backend/renderer.js#L418
 */
const resolveFiberType = (type: any): (() => void) | null => {
  if (!type)
    return null
  if (typeof type === 'function')
    return type
  if (typeof type === 'object' && '$$typeof' in type) {
    switch (type.$$typeof) {
      case Symbol.for('react.memo'): {
        // https://github.com/facebook/react/blob/v18.3.0/packages/react-devtools-shared/src/backend/renderer.js#L423
        return resolveFiberType(type.type)
      }
      case Symbol.for('react.forward_ref'): {
        return type.render as () => void
      }
      default: {
        return null
      }
    }
  }

  return null
}

/**
 * https://github.com/facebook/react/blob/v18.3.0/packages/react-devtools-shared/src/utils.js#L104
 */
const getDisplayName = (
  type: any,
  fallbackName: string = '(anonymous)',
): string => {
  let displayName = fallbackName
  if (!type) {
    return displayName
  }

  // The displayName property is not guaranteed to be a string.
  // It's only safe to use for our purposes if it's a string.
  // github.com/facebook/react-devtools/issues/803
  if (typeof type.displayName === 'string') {
    displayName = type.displayName
  }
  else if (typeof type.name === 'string' && type.name !== '') {
    displayName = type.name
  }

  return displayName || fallbackName
}

/**
 * https://github.com/facebook/react/blob/v18.3.0/packages/react-devtools-shared/src/backend/renderer.js
 * https://github.com/facebook/react/blob/v18.3.0/packages/react-reconciler/src/ReactWorkTags.js
 */
const ReactTypeOfWork = {
  FunctionComponent: 0,
  ClassComponent: 1,
  IndeterminateComponent: 2, // removed in 19.0.0
  HostRoot: 3,
  HostPortal: 4,
  HostComponent: 5,
  HostText: 6,
  Fragment: 7,
  ContextConsumer: 9,
  Mode: 8,
  ContextProvider: 10,
  ForwardRef: 11,
  Profiler: 12,
  SuspenseComponent: 13,
  MemoComponent: 14,
  SimpleMemoComponent: 15,
  LazyComponent: 16,
  IncompleteClassComponent: 17,
  DehydratedSuspenseComponent: 18, // Behind a flag
  SuspenseListComponent: 19, // Experimental
  ScopeComponent: 21, // Experimental
  OffscreenComponent: 22, // Experimental
  LegacyHiddenComponent: 23,
  CacheComponent: 24, // Experimental
  TracingMarkerComponent: 25, // Experimental - This is technically in 18 but we don't
  HostHoistable: 26, // In reality, 18.2+. But doesn't hurt to include it here
  HostSingleton: 27, // Same as above
  IncompleteFunctionComponent: 28,
}
