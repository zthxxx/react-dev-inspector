# React Dev Inspector


## Usage & Config

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
import { inspectorChainWebpack } from 'react-dev-inspector/plugins/webpack/inspector-chain'


inspectorChainWebpack(webpackConfigChain, { exclude: ['xxx-file'] })
```

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

## License

[MIT LICENSE](./LICENSE)
