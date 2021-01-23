<h1 align="center">React Dev Inspector</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/react-dev-inspector" target="_blank" rel="noopener noreferrer"><img src="https://badgen.net/npm/v/react-dev-inspector" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/package/react-dev-inspector" target="_blank" rel="noopener noreferrer"><img src="https://badgen.net/npm/dt/react-dev-inspector" alt="NPM Downloads" /></a>
  <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer"><img src="https://badgen.net/npm/node/react-dev-inspector" alt="Node.js" /></a>
  <a href="https://github.com/zthxxx/react-dev-inspector/blob/master/LICENSE" target="_blank" rel="noopener noreferrer"><img src="https://badgen.net/github/license/zthxxx/react-dev-inspector" alt="License" /></a>
</p>

## Introduction

This package allows you to jump to local IDE code directly from browser React component by just a simple click. Its behavior is similar to but beyond Chrome inspector.

### Preview

online demo: https://react-dev-inspector.zthxxx.me

> press toggle hotkey (`ctrl⌃ + shift⇧ + commmand⌘ + c`) then move mouse and click to try it out.

screen record gif (8M size):

[![inspector-gif](https://github.com/zthxxx/react-dev-inspector/raw/master/docs/images/inspect.gif)](https://react-dev-inspector.zthxxx.me/images/inspect.gif)



## Installation

```bash
npm i -D react-dev-inspector
```

## Usage

To use the `react-dev-inspector` in your project, you need to add a **React component** and some **webpack config**  .

> Note that usually you shouldn't use it in production mode, both of component and config.

<br />

### Use Inspector React Component

```tsx
import React from 'react'
import { Inspector, InspectParams } from 'react-dev-inspector'

const InspectorWrapper = process.env.NODE_ENV === 'development'
  ? Inspector
  : React.Fragment

export const Layout = () => {
  // ...

  return (
    <InspectorWrapper
      // props docs see:
      // https://github.com/zthxxx/react-dev-inspector#inspector-component-props
      keys={['control', 'shift', 'command', 'c']}
      disableLaunchEditor={false}
      onHoverElement={(params: InspectParams) => {}}
      onClickElement={(params: InspectParams) => {}}
    >
     <YourComponent>
       ...
     </YourComponent>
    </InspectorWrapper>
  )
}

```

<br />

### Set Webpack Config

#### raw webpack config

The typical raw webpack config like this below.

In this config, we add

- an "inspector-loader"
- a "DefinePlugin" to get current working directory
- a "devServer" api middleware for open IDE on when it be called

```ts
import { Configuration, DefinePlugin } from 'webpack'
import { createLaunchEditorMiddleware } from 'react-dev-inspector/plugins/webpack'


const config: Configuration = {
  // ...

  /**
   * [compile time] for inject source code file info
   */
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.[jt]sx$/,
        exclude: [
          /node_modules/,
          /file-you-want-exclude/,
        ],
        use: [
          {
            loader: 'react-dev-inspector/plugins/webpack/inspector-loader',
            options: [{
              // loader options docs see:
              // https://github.com/zthxxx/react-dev-inspector#inspector-loader-props
              exclude: [
                'xxx-file-will-be-exclude',
                /regexp-to-match-file /,
              ],
              babelPlugins: [],
              babelOptions: {},
            }],
          },
        ],
      },
    ],
  },

  /**
   * [compile time] for inject current working directory which used in web page runtime
   */
  plugins: [
    new DefinePlugin({
      'process.env.PWD': JSON.stringify(process.cwd()),
    }),
  ],

  /**
   * [server side] webpack dev server side middleware for launch IDE app
   */
  devServer: {
    before: (app) => {
      app.use(createLaunchEditorMiddleware())
    },
  },
}
```

<br />

We know this webpack config maybe too **complicated**, so we also provide some **integrated plugins / helper** to make you easy to use, if your project happen to be using those utils / framework.



So here list some ways below for alternative the `raw webpack config` :

<br />

#### usage with webpack-chain

This is almost equivalent to `raw webpack config` above,

but it will NOT override `devServer.before`, just add middleware before origin `devServer.before`

```ts
import { inspectorChainWebpack } from 'react-dev-inspector/plugins/webpack'


webpackChainConfig = inspectorChainWebpack(webpackChainConfig, {
  // loader options docs see:
  // https://github.com/zthxxx/react-dev-inspector#inspector-loader-props
  exclude: [],
  babelPlugins: [],
  babelOptions: {},
})
```

<br />

#### usage with [Umi3](https://umijs.org/)

This is also equivalent to `usage with webpack-chain`

Example `.umirc.dev.ts`:

```ts
// https://umijs.org/config/
import { defineConfig } from 'umi'

export default defineConfig({
  plugins: [
    'react-dev-inspector/plugins/umi/react-inspector',
  ],
  inspectorConfig: {
    // loader options docs see:
    // https://github.com/zthxxx/react-dev-inspector#inspector-loader-props
    exclude: [],
    babelPlugins: [],
    babelOptions: {},
  },
})
```

<br />

#### usage with [Umi2](https://v2.umijs.org)

Example `.umirc.dev.js`:

```js
import { inspectorChainWebpack } from 'react-dev-inspector/plugins/webpack'

export default {
  // ...
  chainWebpack(config) {
    inspectorChainWebpack(config, {
      // ... options
    })
    return config
  },

  /**
   * And you need to set `false` to `dll` in `umi-plugin-react`,
   * becase these is a umi2 bug that `dll` cannot work with `devServer.before`
   *
   * https://github.com/umijs/umi/issues/2599
   * https://github.com/umijs/umi/issues/2161
   */
}
```

<br />

## Configuration

### `<Inspector>` Component Props

typescript define you can see in `react-dev-inspector/es/Inspector.d.ts`

| Property            | Description                                                  | Type                                                         | Default                                |
| ------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | -------------------------------------- |
| keys                | inspector toggle hotkeys<br /><br />supported keys see: https://github.com/jaywcjlove/hotkeys#supported-keys | `string[]`                                                   | `['control', 'shift', 'command', 'c']` |
| disableLaunchEditor | whether disable click react component to open IDE for view component code<br /><br />(launchEditor by default only support be used with react-dev-inpector plugins in dev) | `boolean`                                                    | `false`                                |
| onHoverElement      | triggered while inspector start and mouse hover in a HTMLElement | [`(params: InspectParams) => void`](https://github.com/zthxxx/react-dev-inspector/blob/master/src/Inspector/Inspector.tsx#L14) | -                                      |
| onClickElement      | triggered while inspector start and mouse click on a HTMLElement | [`(params: InspectParams) => void`](https://github.com/zthxxx/react-dev-inspector/blob/master/src/Inspector/Inspector.tsx#L14) | -                                      |

```ts
// import type { InspectParams } from 'react-dev-inspector'

interface InspectParams {
  /** hover / click event target dom element */
  element: HTMLElement,
  /** nearest named react component fiber for dom element */
  fiber?: React.Fiber,
  /** source file line / column / path info for react component */
  codeInfo?: {
    lineNumber: string,
    columnNumber: string,
    relativePath: string,
  },
  /** react component name for dom element */
  name?: string,
}
```

<br />

### Inspector Loader Props

```ts
// import type { ParserPlugin, ParserOptions } from '@babel/parser'
// import type { InspectorConfig } from 'react-dev-inspector/plugins/webpack'

interface InspectorConfig {
  /** patterns to exclude matched files */
  exclude?: (string | RegExp)[],
  /**
   * add extra plugins for babel parser
   * default is ['typescript', 'jsx', 'decorators-legacy', 'classProperties']
   */
  babelPlugins?: ParserPlugin[],
  /** extra babel parser options */
  babelOptions?: ParserOptions,
}
```

<br />

### IDE / Editor config

This package use `react-dev-utils` to launch your local IDE app, but which one app will be open?

In fact, it uses an **environment variable** named **`REACT_EDITOR`** to specify an IDE application, but if you not set this variable, it will guess an IDE by what are you opened or installed.

For example, if you want it always open VSCode when inspect clicked, set `export REACT_EDITOR=code` in your shell.

<br />

#### VSCode

- install VSCode command line tools, [see the official docs](https://code.visualstudio.com/docs/setup/mac#_launching-from-the-command-line)
  ![install-vscode-cli](./docs/images/install-vscode-cli.png)

- set env to shell, like `.bashrc` or `.zshrc`
  ```bash
  export REACT_EDITOR=code
  ```

<br />

#### WebStorm

- just set env with an absolute path to shell, like `.bashrc` or `.zshrc` (only MacOS)
  ```bash
  export REACT_EDITOR='/Applications/WebStorm.app/Contents/MacOS/webstorm'
  ```

**OR**

- install WebStorm command line tools
  ![install-webstorm-cli](./docs/images/install-webstorm-cli.png)

- then set env to shell, like `.bashrc` or `.zshrc`
  ```bash
  export REACT_EDITOR=webstorm
  ```

<br />

#### Vim

yes, you can also use vim if you prefer it, just set env to shell

```bash
export REACT_EDITOR=vim
```

<br />

## Example Project Code

- **create-react-app**
  - code: https://github.com/zthxxx/react-dev-inspector/tree/master/sites/cra
  - preview: https://react-dev-inspector.zthxxx.me/cra
- **umi3**
  - code: https://github.com/zthxxx/react-dev-inspector/tree/master/sites/umi3
  - preview: https://react-dev-inspector.zthxxx.me/umi3


<br />

## How It Work

- **Stage 1 - Compile Time**

  - [webpack loader] inject source file path/line/column to JSX data attributes props (use babel)
  - [webpack plugin] inject PWD (current working directory) env define for runtime

- **Stage 2 - Web React Runtime**

  - [React component] `Inspector` Component in react, for listen hotkeys, and request api to dev-server for open IDE.

    Specific, when you click a component DOM, the `Inspector` will try to obtain its source file info (path/line/column) and PWD path (both injected in Stage 1), then request launch-editor api (in stage 3) with absolute file path.

- **Stage 3 - Dev-server Side**

  - [middleware] setup  `createLaunchEditorMiddleware` in webpack dev-server (or other dev-server), to open file in IDE according to the request params.

    **Only need** in development mode,and you want to open IDE when click a component element.

    **Not need** in prod mode, or you just want inspect dom without open IDE (set `disableLaunchEditor={true}` to Inspector component props)



### Analysis of Theory

- [chinese] [🎉我点了页面上的元素，VSCode 乖乖打开了对应的组件？原理揭秘](https://juejin.cn/post/6901466406823575560)

<br />

## License

[MIT LICENSE](./LICENSE)
