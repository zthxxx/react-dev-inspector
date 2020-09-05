# React Dev Inspector


## Usage & Config

umi3

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

or manual used in webpack

```ts
import { inspectorChainWebpack } from 'react-dev-inspector/plugins/umi/react-inspector'


inspectorChainWebpack(webpackConfigChain, { exclude: ['xxx-file'] })
```

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
