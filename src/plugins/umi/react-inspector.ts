import type { IApi } from '@umijs/types'
import createLaunchEditorMiddleware from 'react-dev-utils/errorOverlayMiddleware'
import {
  inspectorChainWebpack,
  InspectorConfig,
} from '../webpack/config-inspector'


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
