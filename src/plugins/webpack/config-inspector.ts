/**
 * @deprecated deprecated in v1.4.0
 *   migrate to `react-dev-inspector/plugins/babel`
 *   retain for backward compatibility <= v1.3.*
 */
import type { ParserPlugin, ParserOptions } from '@babel/parser'
import type WebpackChain from 'webpack-chain'
import { ReactInspectorPlugin } from './inspector-plugin'


export interface InspectorConfig {
  /** patterns to exclude matched files */
  excludes?: (string | RegExp)[],
  /**
   * @deprecated move to `excludes`
   */
  exclude: InspectorConfig['excludes'],
  babelPlugins?: ParserPlugin[],
  babelOptions?: ParserOptions,
}

export const inspectorChainWebpack = (
  config: WebpackChain,
  inspectorConfig?: InspectorConfig,
) => {
  if (inspectorConfig?.exclude && !inspectorConfig?.excludes) {
    inspectorConfig.excludes = inspectorConfig.exclude
    delete inspectorConfig.exclude
  }

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
