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


## Usage & Config

### Use in React

```tsx
import React from 'react'
import { Inspector } from 'react-dev-inspector'

const InspectorWrapper = process.env.NODE_ENV === 'development'
  ? Inspector
  : React.Fragment

export const Layout = () => { 
  // ...
  
  return (
    <InspectorWrapper
      // keys={['control', 'shift', 'command', 'c']} // default keys
    >
     <XXXContent>
     </XXXContent>
    </InspectorWrapper>
  )
}

```

### Plugin for umi3

```ts
// .umirc.dev.ts

// https://umijs.org/config/
import { defineConfig } from 'umi'

export default defineConfig({
  plugins: [
    'react-dev-inspector/plugins/umi/react-inspector',
  ],
  inspectorConfig: {
    exclude: [
      'xxx-file-will-be-exclude',
    ], 
  },
})
```

### Plugin for manual used in webpack

```ts
import { inspectorChainWebpack } from 'react-dev-inspector/plugins/webpack/config-inspector'


inspectorChainWebpack(webpackConfigChain, { exclude: ['xxx-file'] })
```


## Example code

see: https://github.com/zthxxx/react-dev-inspector/tree/master/site


## License

[MIT LICENSE](./LICENSE)
