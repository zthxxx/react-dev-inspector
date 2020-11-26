import type { ParserPlugin, ParserOptions } from '@babel/parser'
import { DefinePlugin } from 'webpack'
import type WebpackChain from 'webpack-chain'
import { ReactInspectorPlugin } from './inspector-plugin'


export interface InspectorConfig {
  exclude?: (string | RegExp)[],
  babelPlugins?: ParserPlugin[],
  babelOptions?: ParserOptions,
}

export const inspectorChainWebpack = (
  config: WebpackChain,
  inspectorConfig?: InspectorConfig,
) => {
  /**
   * compile time for inject source code file info
   */
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

  /**
   * web page runtime
   */
  config
    .plugin('define-pwd')
    .use(
      DefinePlugin,
      [
        {
          'process.env.PWD': JSON.stringify(process.cwd()),
        },
      ],
    )
    .end()

  /**
   * webpack dev service side for launch IDE app
   */
  config
    .plugin('react-inspector')
    .use(
      ReactInspectorPlugin,
      [],
    )

  return config
}
