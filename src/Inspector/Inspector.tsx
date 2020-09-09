import React, { useState, useEffect, useRef } from 'react'
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


export const defaultHotKeys = ['control', 'shift', 'command', 'c']

export type ElementHandler = (params: {
  element: HTMLElement,
  fiber?: Fiber,
  codeInfo: CodeInfo,
  name?: string,
}) => void

export interface InspectorProps {
  keys?: string[],
  onHoverElement?: ElementHandler,
  onClickElement?: ElementHandler,
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
    const relativePath = codeInfo?.relativePath ?? null

    const { fiber, name, title } = getElementInspect(element, relativePath)

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
    overlayRef.current = null
    setIsInspect(false)

    const codeInfo = getElementCodeInfo(element)
    const relativePath = codeInfo?.relativePath ?? null

    const { fiber, name } = getElementInspect(element, relativePath)

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
    overlayRef.current.remove()
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
      }
    }

    hotkeys(hotkey, handleHotKeys)

    return () => {
      hotkeys.unbind(hotkey, handleHotKeys)
    }
  }, [hotkey, handleInspectKey])

  return (
    <>{children}</>
  )
}
