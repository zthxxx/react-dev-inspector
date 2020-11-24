/**
 * mirror from https://github.com/facebook/react/blob/v16.13.1/packages/react-devtools-shared/src/backend/views/Highlighter/index.js
 */


// This plug-in provides in-page highlighting of the selected element.
// It is used by the browser extension nad the standalone DevTools shell
// (when connected to a browser).
// It is not currently the mechanism used to highlight React Native views.
// That is done by the React Native Inspector component.

let iframesListeningTo: Set<HTMLIFrameElement> = new Set()

export type StopFunction = () => void

export function setupHighlighter(
  handlers: {
    onPointerOver?: (element: HTMLElement) => void,
    onClick?: (element: HTMLElement) => void,
  },
): StopFunction {

  function startInspectingNative() {
    registerListenersOnWindow(window)
  }

  function registerListenersOnWindow(window?: Window | null) {
    // This plug-in may run in non-DOM environments (e.g. React Native).
    if (window && typeof window.addEventListener === 'function') {
      window.addEventListener('click', onClick, true)
      window.addEventListener('mousedown', onMouseEvent, true)
      window.addEventListener('mouseover', onMouseEvent, true)
      window.addEventListener('mouseup', onMouseEvent, true)
      window.addEventListener('pointerdown', onPointerDown, true)
      window.addEventListener('pointerover', onPointerOver, true)
      window.addEventListener('pointerup', onPointerUp, true)
    }
  }

  function stopInspectingNative() {
    removeListenersOnWindow(window)
    iframesListeningTo.forEach(function(frame) {
      try {
        removeListenersOnWindow(frame.contentWindow)
      } catch (error) {
        // This can error when the iframe is on a cross-origin.
      }
    })
    iframesListeningTo = new Set()
  }

  function removeListenersOnWindow(window?: Window | null) {
    // This plug-in may run in non-DOM environments (e.g. React Native).
    if (window && typeof window.removeEventListener === 'function') {
      window.removeEventListener('click', onClick, true)
      window.removeEventListener('mousedown', onMouseEvent, true)
      window.removeEventListener('mouseover', onMouseEvent, true)
      window.removeEventListener('mouseup', onMouseEvent, true)
      window.removeEventListener('pointerdown', onPointerDown, true)
      window.removeEventListener('pointerover', onPointerOver, true)
      window.removeEventListener('pointerup', onPointerUp, true)
    }
  }

  function onClick(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()

    stopInspectingNative()

    handlers.onClick?.(event.target as HTMLElement)
  }

  function onMouseEvent(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
  }

  function onPointerDown(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
  }

  function onPointerOver(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()

    const target = event.target as HTMLElement

    if (target.tagName === 'IFRAME') {
      const iframe: HTMLIFrameElement = target as HTMLIFrameElement
      try {
        if (!iframesListeningTo.has(iframe)) {
          const window = iframe.contentWindow
          registerListenersOnWindow(window)
          iframesListeningTo.add(iframe)
        }
      } catch (error) {
        // This can error when the iframe is on a cross-origin.
      }
    }

    handlers.onPointerOver?.(event.target as HTMLElement)
  }

  function onPointerUp(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
  }

  startInspectingNative()

  return stopInspectingNative
}
