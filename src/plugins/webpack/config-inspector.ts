import type { ParserPlugin, ParserOptions } from '@babel/parser'
import { DefinePlugin } from 'webpack'
import type WebpackChain from 'webpack-chain'
import { ReactInspectorPlugin } from './inspector-plugin'


export interface InspectorConfig {
  /** patterns to exclude matched files */
  exclude?: (string | RegExp)[],
  babelPlugins?: ParserPlugin[],
  babelOptions?: ParserOptions,
}

export const inspectorChainWebpack = (
  config: WebpackChain,
  inspectorConfig?: InspectorConfig,
) => {
  /**
   * [compile time] for inject source code file info
   */
  config
    .module
    .rule('inspector')
    .enforce('pre')
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
   * [compile time] used in web page runtime
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
   * [server side] add webpack dev server middleware for launch IDE app with api request
   */
  config
    .plugin('react-inspector')
    .use(
      ReactInspectorPlugin,
      [],
    )

  return config
}
