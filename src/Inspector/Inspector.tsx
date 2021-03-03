import React, { useState, useEffect, useRef, ReactElement } from 'react'
import type { Fiber } from 'react-reconciler'
import hotkeys from 'hotkeys-js'
import { setupHighlighter } from './utils/hightlight'
import {
  getElementCodeInfo,
  gotoEditor,
  getElementInspect,
  CodeInfo,
} from './utils/inspect'
import Overlay from './Overlay'


export interface InspectParams {
  /** hover / click event target dom element */
  element: HTMLElement,
  /** nearest named react component fiber for dom element */
  fiber?: Fiber,
  /** source file line / column / path info for react component */
  codeInfo?: CodeInfo,
  /** react component name for dom element */
  name?: string,
}

export type ElementHandler = (params: InspectParams) => void

export const defaultHotKeys = ['control', 'shift', 'command', 'c']

export interface InspectorProps {
  /**
   * inspector toggle hotkeys
   *
   * supported keys see: https://github.com/jaywcjlove/hotkeys#supported-keys
   */
  keys?: string[],
  onHoverElement?: ElementHandler,
  onClickElement?: ElementHandler,
  /**
   * whether disable click react component to open IDE for view component code
   */
  disableLaunchEditor?: boolean,
}

export const Inspector: React.FC<InspectorProps> = (props) => {
  const {
    keys,
    onHoverElement,
    onClickElement,
    disableLaunchEditor,
    children,
  } = props

  const hotkey = (keys ?? defaultHotKeys).join('+')

  const [isInspect, setIsInspect] = useState(false)
  const overlayRef = useRef<Overlay>()

  const handleHoverElement = (element: HTMLElement) => {
    const overlay = overlayRef.current

    const codeInfo = getElementCodeInfo(element)
    const relativePath = codeInfo?.relativePath

    const { fiber, name, title } = getElementInspect(element)

    overlay?.inspect?.([element], title, relativePath)

    onHoverElement?.({
      element,
      fiber,
      codeInfo,
      name,
    })
  }

  const handleClickElement = (element: HTMLElement) => {
    const overlay = overlayRef.current
    overlay?.remove?.()
    overlayRef.current = undefined
    setIsInspect(false)

    const codeInfo = getElementCodeInfo(element)

    const { fiber, name } = getElementInspect(element)

    if (!disableLaunchEditor) gotoEditor(codeInfo)
    onClickElement?.({
      element,
      fiber,
      codeInfo,
      name,
    })
  }

  const startInspect = () => {
    const overlay = new Overlay()

    const stopCallback = setupHighlighter({
      onPointerOver: handleHoverElement,
      onClick: handleClickElement,
    })

    overlay.setRemoveCallback(stopCallback)

    overlayRef.current = overlay
    setIsInspect(true)
  }

  const stopInspect = () => {
    overlayRef.current?.remove()
    setIsInspect(false)
  }

  const handleInspectKey = () => (
    isInspect
      ? stopInspect()
      : startInspect()
  )

  useEffect(() => {
    const handleHotKeys = (event, handler) => {
      if (handler.key === hotkey) {
        handleInspectKey()
      } else if (isInspect && handler.key === 'esc') {
        stopInspect()
      }
    }

    hotkeys(`${hotkey}, esc`, handleHotKeys)
    window.__REACT_DEV_INSPECTOR_TOGGLE__ = handleInspectKey

    return () => {
      hotkeys.unbind(`${hotkey}, esc`, handleHotKeys)
      delete window.__REACT_DEV_INSPECTOR_TOGGLE__
    }
  }, [hotkey, isInspect, handleInspectKey])

  return children as ReactElement
}
