import type { Plugin } from 'vite'
import { transformSync } from '@babel/core'

export const onlineDemoBuildPlugin = (): Plugin => ({
  name: 'online-demo-build-plugin',
  enforce: 'pre',
  apply: 'build',

  transform(code, id) {
    if (!/\.(t|j)sx$/.test(id) || id.includes('node_modules')) {
      return code
    }

    const result = transformSync(code, {
      filename: id,
      babelrc: false,
      configFile: false,
      compact: false,
      parserOpts: {
        sourceType: 'module',
        plugins: [
          'typescript',
          'jsx',
        ],
      },
      plugins: [
        'react-dev-inspector/plugins/babel',
      ],
    })

    return result?.code
  },
})
