import { DefinePlugin } from 'webpack'
import type WebpackChain from 'webpack-chain'

export interface InspectorConfig {
  exclude?: string[],
}

export const inspectorChainWebpack = (
  config: WebpackChain,
  inspectorConfig?: InspectorConfig,
) => {
  config
    .module
    .rule('inspector')
    .test(/\.[jt]sx$/)
    .exclude
    .add(/node_modules/)
    .add(/\.umi(-production)?\//)
    .add(/\/devTools\//)
    .add(/\.storybook\//)
    .end()
    .use('inspector')
    .loader(require.resolve('./inspector-loader'))
    .options(inspectorConfig ?? {})
    .end()

  config
    .plugin('define-pwd')
    .use(
      DefinePlugin,
      [
        {
          'process.env.PWD': JSON.stringify(process.env.PWD),
        },
      ],
    )
    .end()

  return config
}
