import React from 'react'
import * as S from './styles'


export const Slogan: React.FC = (props) => {
  const {
    children,
  } = props

  return (
    <S.Description>
      {children}
    </S.Description>
  )
}
