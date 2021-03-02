import React from 'react'
import * as S from './styles'


export const Keypress: React.FC = ({ children }) => {
  return (
    <kbd
      className={S.keyTone}
    >
      {children}
    </kbd>
  )
}

export const KeyPad: React.FC = (props) => {
  const {
    children,
  } = props

  return (
    <S.Pad>
      <span>press</span>

      <S.Keys>{children}</S.Keys>

      <span>to try! 🍭</span>
    </S.Pad>
  )
}
