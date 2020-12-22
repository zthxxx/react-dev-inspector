import React from 'react'
import * as S from './styles'


export const Keypress: React.FC = ({ children, ...props }) => {
  return (
    <S.KeyTone
      {...props}
    >
      {children}
    </S.KeyTone>
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
