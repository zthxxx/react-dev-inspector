import type { IApi } from '@umijs/types'
import type WebpackChain from 'webpack-chain'
import { DefinePlugin } from 'webpack'
import createLaunchEditorMiddleware from 'react-dev-utils/errorOverlayMiddleware'


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
    .loader(require.resolve('../webpack/inspector-loader'))
    .options(inspectorConfig ?? {})
    .end()

  config
    .plugin('define-pwd')
    .use(
      DefinePlugin,
      [{
        'process.env.PWD': JSON.stringify(process.env.PWD),
      }],
    )
    .end()

  return config
}

export default function inspectorPlugin(api: IApi) {
  const inspectorConfig = api.userConfig.inspectorConfig as InspectorConfig

  api.describe({
    key: 'inspectorConfig',
    config: {
      schema(joi) {
        return joi.object()
      },
    },
    enableBy: api.EnableBy.register,
  })

  /**
   * Inspector component open file into IDE via `__open-stack-frame-in-editor` api,
   * which is created by `errorOverlayMiddleware` and
   * defined in 'react-dev-utils/launchEditorEndpoint'
   */
  api.addBeforeMiddewares(createLaunchEditorMiddleware)

  api.chainWebpack((chain) => inspectorChainWebpack(chain, inspectorConfig))
}
