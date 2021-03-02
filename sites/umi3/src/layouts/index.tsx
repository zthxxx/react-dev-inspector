import React from 'react'
import { Global } from '@emotion/core'
import { Inspector } from 'react-dev-inspector'
import { Title } from '../components/Title'
import { Slogan } from '../components/Slogan'
import { KeyPad, Keypress } from '../components/Keypress'
import Addition from '../components/Addition'
import * as S from './styles'


const projectRepo = 'https://github.com/zthxxx/react-dev-inspector'
const isDev = process.env.NODE_ENV === 'development'

export const HomePage = () => {
  return (
    <Inspector
      disableLaunchEditor={!isDev}
      onClickElement={(inspect) => {
        console.debug(inspect)
        if (isDev || !inspect.codeInfo) return

        const {
          relativePath,
          lineNumber,
        } = inspect.codeInfo

        window.open(
          `${projectRepo}/blob/master/sites/umi3/${relativePath}#L${lineNumber}`,
        )
      }}
    >
      <Global styles={S.globalCss} />


      <S.Base>
        <S.GithubCorner
          href={projectRepo}
        />

        <Title>
          <span>React Dev Inspector</span>
        </Title>

        <Slogan>
          <p>Quick jump to local IDE source code directly from browser React component by just a simple click!</p>
          <p><small>( for this prod online demo page, jump to GitHub file )</small></p>
        </Slogan>

        <KeyPad>
          <Keypress><div> Ctrl ⌃ </div></Keypress>
          +
          <Keypress><div> Shift ⇧ </div></Keypress>
          +
          <Keypress><div> Command ⌘ </div></Keypress>
          +
          <Keypress><div> C </div></Keypress>
        </KeyPad>

        <Addition />
      </S.Base>
    </Inspector>
  )
}

export default HomePage
