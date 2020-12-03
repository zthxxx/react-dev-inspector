<h1 align="center">React Dev Inspector</h1>

<p align="center">
dev-tool for inspect react components and jump to local IDE for component code.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/react-dev-inspector" target="_blank" rel="noopener noreferrer"><img src="https://badgen.net/npm/v/react-dev-inspector" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/package/react-dev-inspector" target="_blank" rel="noopener noreferrer"><img src="https://badgen.net/npm/dt/react-dev-inspector" alt="NPM Downloads" /></a>
  <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer"><img src="https://badgen.net/npm/node/react-dev-inspector" alt="Node.js" /></a>
  <a href="https://github.com/zthxxx/react-dev-inspector/blob/master/LICENSE" target="_blank" rel="noopener noreferrer"><img src="https://badgen.net/github/license/zthxxx/react-dev-inspector" alt="License" /></a>
</p>



## Preview

Online demo: https://react-dev-inspector.zthxxx.me

Screen record (gif 8M): 

[![inspector-gif](https://github.com/zthxxx/react-dev-inspector/raw/master/docs/images/inspect.gif)](https://react-dev-inspector.zthxxx.me/images/inspect.gif)



## Install

```bash
npm i -D react-dev-inspector
```



## Usage

There are 3 steps required to use `react-dev-inspector`, here will list some **typical manual config** of webpack, and this lib also provide some **integrated plugins** to make you easy to use

- **Step 1 - Compile Time**
  - [webpack loader] inject source file path/line/column to JSX data attributes props (use babel)
  - [webpack plugin] inject PWD (current working directory) env define for runtime
- **Step 2 - Web React Runtime**
  
  - [component] `Inspector` Component in react, for listen hotkeys, and request api to dev-server for open IDE
- **Step 3 - Dev-server Side**
  
  - [middleware]  `createLaunchEditorMiddleware` in webpack dev-server (or other dev-server), to open file in IDE according to the request.
  
    **Only need** in development mode,and you want to open IDE when click a component element.
  
    **Not need** in prod mode, or you just want inspect dom without open IDE (set `disableLaunchEditor={false}` to Inspector component)



### Typical webpack config

Include **step-1** and **step-3**, compile Time and dev-server Side

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
        test: /\.[jt]sx$/,
        exclude: [
          /node_modules/,
          /file-you-want-exclude/,
        ],
        use: [
          {
            loader: 'react-dev-inspector/plugins/webpack/inspector-loader',
            options: [{
              // loader options type and docs see below
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



### Usage with Webpack Chain

Include **step 1** and **step 3**, it's almost equivalent to `Typical webpack config` above,

but it will NOT override `devServer.before`, just add middleware before origin `devServer.before`

```ts
import { inspectorChainWebpack } from 'react-dev-inspector/plugins/webpack'


webpackChainConfig = inspectorChainWebpack(webpackChainConfig, {
  // loader options type and docs see below
  exclude: [],
  babelPlugins: [],
  babelOptions: {},
})
```



### Usage with [Umi3](https://umijs.org/)

Include **step 1** and **step 3**, also equivalent to `Usage with Webpack Chain`

Example `.umirc.dev.ts`:

```ts
// https://umijs.org/config/
import { defineConfig } from 'umi'

export default defineConfig({
  plugins: [
    'react-dev-inspector/plugins/umi/react-inspector',
  ],
  inspectorConfig: {
    // loader options type and docs see below
    exclude: [],
    babelPlugins: [],
    babelOptions: {},
  },
})
```

### Usage with [Umi2](https://v2.umijs.org)

Include **step 1** and **step 3**

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



### Use in React

Include **step-2**, react runtime

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
      // props docs see below
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

after `<Inspector>` component  was mounted，you can use `window.__REACT_DEV_INSPECTOR_TOGGLE__()` to toggle inspector.



## Config of Loader / Component / IDE

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



### IDE / Editor config

this lib use `react-dev-utils` to launch your local IDE app, but which one app will be open?

In fact, it uses an **environment variable** named **`REACT_EDITOR`**, but if you not set this variable, it will guess a IDE in what you opened now or what you installed.

For example, if you want it always open VSCode when inspect clicked, set `export REACT_EDITOR=code` in your shell.

#### VSCode

- install VSCode command line tools, [see the official docs](https://code.visualstudio.com/docs/setup/mac#_launching-from-the-command-line)
  ![install-vscode-cli](./docs/images/install-vscode-cli.png)

- set env to shell, like `.bashrc` or `.zshrc`
  ```bash
  export REACT_EDITOR=code
  ```

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

#### Vim

yes, you can also use vim if you prefer it, just set env to shell

```bash
export REACT_EDITOR=vim
```



## Example Project Code

code see: https://github.com/zthxxx/react-dev-inspector/tree/master/site

project preview: https://react-dev-inspector.zthxxx.me

## Analysis of Theory

- [chinese] [🎉我点了页面上的元素，VSCode 乖乖打开了对应的组件？原理揭秘](https://juejin.cn/post/6901466406823575560)

## License

[MIT LICENSE](./LICENSE)
