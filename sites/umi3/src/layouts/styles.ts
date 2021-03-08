import Corner from 'react-github-corner'
import { css } from '@emotion/react'
import styled from '@emotion/styled'


export const globalCss = css`
  html, body, #root {
    margin: 0;
    width: 100%;
    height: 100%;
  }
`

export const Base = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`

export const GithubCorner = styled(Corner)`

`
