import React, { Component } from 'react'
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

export class KeyPad extends Component {
  public render() {
    const {
      children,
    } = this.props

    return (
      <S.Pad>
        <span>press</span>

        <S.Keys>{children}</S.Keys>

        <span>to try! 🍭</span>
      </S.Pad>
    )
  }
}
