/**
 * mirror from https://github.com/facebook/react/blob/v16.13.1/packages/react-devtools-shared/src/backend/views/Highlighter/Overlay.js
 *
 * remove all process for iframe, because iframe only need to think in chrome extension app,
 * which will deal multiple levels of nesting iframe.
 */


export interface Rect {
  bottom: number,
  height: number,
  left: number,
  right: number,
  top: number,
  width: number,
}


// Calculate a boundingClientRect for a node relative to boundaryWindow,
// taking into account any offsets caused by intermediate iframes.
export function getNestedBoundingClientRect(node: HTMLElement, boundaryWindow: Window | HTMLElement): Rect
export function getNestedBoundingClientRect(node: HTMLElement): Rect {
  return node.getBoundingClientRect()
}

export function getElementDimensions(domElement: Element) {
  const calculatedStyle = window.getComputedStyle(domElement)
  return {
    borderLeft: parseInt(calculatedStyle.borderLeftWidth, 10),
    borderRight: parseInt(calculatedStyle.borderRightWidth, 10),
    borderTop: parseInt(calculatedStyle.borderTopWidth, 10),
    borderBottom: parseInt(calculatedStyle.borderBottomWidth, 10),
    marginLeft: parseInt(calculatedStyle.marginLeft, 10),
    marginRight: parseInt(calculatedStyle.marginRight, 10),
    marginTop: parseInt(calculatedStyle.marginTop, 10),
    marginBottom: parseInt(calculatedStyle.marginBottom, 10),
    paddingLeft: parseInt(calculatedStyle.paddingLeft, 10),
    paddingRight: parseInt(calculatedStyle.paddingRight, 10),
    paddingTop: parseInt(calculatedStyle.paddingTop, 10),
    paddingBottom: parseInt(calculatedStyle.paddingBottom, 10),
  }
}
