import React from 'react';
import { Global } from '@emotion/react';
import { Inspector, type InspectParams } from 'react-dev-inspector';
import { Title } from './components/Title';
import { Slogan } from './components/Slogan';
import { KeyPad, Keypress } from './components/Keypress';
import * as S from './styles';
const projectRepo = 'https://github.com/zthxxx/react-dev-inspector';
const isDev = process.env.NODE_ENV === 'development';
export const HomePage = () => {
  return <Inspector data-inspector-line="15" data-inspector-column="4" data-inspector-relative-path="src/tests/fixtures/layouts/index.tsx" disableLaunchEditor={!isDev} onClickElement={(inspect: InspectParams) => {
    console.debug(inspect);
    if (isDev || !inspect.codeInfo?.relativePath) return;
    const {
      relativePath,
      lineNumber
    } = inspect.codeInfo;
    window.open(`${projectRepo}/blob/master/examples/umi3/${relativePath}#L${lineNumber}`);
  }}>
      <Global data-inspector-line="32" data-inspector-column="6" data-inspector-relative-path="src/tests/fixtures/layouts/index.tsx" styles={S.globalCss} />


      <S.Base data-inspector-line="35" data-inspector-column="6" data-inspector-relative-path="src/tests/fixtures/layouts/index.tsx">
        <S.GithubCorner data-inspector-line="36" data-inspector-column="8" data-inspector-relative-path="src/tests/fixtures/layouts/index.tsx" href={projectRepo} />

        <Title data-inspector-line="40" data-inspector-column="8" data-inspector-relative-path="src/tests/fixtures/layouts/index.tsx">
          <span data-inspector-line="41" data-inspector-column="10" data-inspector-relative-path="src/tests/fixtures/layouts/index.tsx">React Dev Inspector</span>
        </Title>

        <Slogan data-inspector-line="44" data-inspector-column="8" data-inspector-relative-path="src/tests/fixtures/layouts/index.tsx">
          <p data-inspector-line="45" data-inspector-column="10" data-inspector-relative-path="src/tests/fixtures/layouts/index.tsx">Quick jump to local IDE source code directly from browser React component by just a simple click!</p>
          <p data-inspector-line="46" data-inspector-column="10" data-inspector-relative-path="src/tests/fixtures/layouts/index.tsx"><small data-inspector-line="46" data-inspector-column="13" data-inspector-relative-path="src/tests/fixtures/layouts/index.tsx">( for this prod online demo page, jump to GitHub file )</small></p>
        </Slogan>

        <KeyPad data-inspector-line="49" data-inspector-column="8" data-inspector-relative-path="src/tests/fixtures/layouts/index.tsx">
          <Keypress data-inspector-line="50" data-inspector-column="10" data-inspector-relative-path="src/tests/fixtures/layouts/index.tsx">Ctrl ⌃</Keypress>
          +
          <Keypress data-inspector-line="52" data-inspector-column="10" data-inspector-relative-path="src/tests/fixtures/layouts/index.tsx">Shift ⇧</Keypress>
          +
          <Keypress data-inspector-line="54" data-inspector-column="10" data-inspector-relative-path="src/tests/fixtures/layouts/index.tsx">Command ⌘</Keypress>
          +
          <Keypress data-inspector-line="56" data-inspector-column="10" data-inspector-relative-path="src/tests/fixtures/layouts/index.tsx">C</Keypress>
        </KeyPad>
      </S.Base>
    </Inspector>;
};
export default HomePage;