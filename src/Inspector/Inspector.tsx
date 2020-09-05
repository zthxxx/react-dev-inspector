import React, { useState, useEffect, useRef } from 'react'
import hotkeys from 'hotkeys-js'
import { setupHighlighter } from './utils/hightlight'
import {
  getElementCodeInfo,
  gotoEditor,
  getElementInspectTitle,
} from './utils/inspect'
import Overlay from './Overlay'


export const defaultHotKeys = ['control', 'shift', 'command', 'c']

export interface InspectorProps {
  keys?: string[],
}

export const Inspector: React.FC<InspectorProps> = (props) => {
  const { children, keys } = props

  const hotkey = (keys ?? defaultHotKeys).join('+')

  const [isInspect, setIsInspect] = useState(false)
  const overlayRef = useRef<Overlay>()

  const handleHoverElement = (element: HTMLElement) => {
    const overlay = overlayRef.current

    const codeInfo = getElementCodeInfo(element)
    const relativePath = codeInfo?.relativePath ?? null

    const title = getElementInspectTitle(element, relativePath)

    overlay?.inspect?.([element], title, relativePath)
  }

  const handleClickElement = (element: HTMLElement) => {
    const overlay = overlayRef.current
    overlay?.remove?.()
    overlayRef.current = null
    setIsInspect(false)

    const codeInfo = getElementCodeInfo(element)
    gotoEditor(codeInfo)
  }

  const handleInspectKey = () => {
    if (!isInspect) {
      const overlay = new Overlay()

      const stopCallback = setupHighlighter({
        onPointerOver: handleHoverElement,
        onClick: handleClickElement,
      })

      overlay.setRemoveCallback(stopCallback)

      overlayRef.current = overlay
      setIsInspect(true)

    } else {
      overlayRef.current.remove()
      setIsInspect(false)
    }
  }

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
