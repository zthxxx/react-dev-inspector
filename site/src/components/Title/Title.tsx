import React from 'react'
import * as S from './styles'


export const Title: React.FC = (props) => {
  const {
    children,
  } = props

  return (
    <S.TitleName>
      {children}
    </S.TitleName>
  )
}
