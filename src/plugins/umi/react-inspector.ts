/**
 * preset plugins for umi3
 */

import type { IApi } from '@umijs/types'
import {
  inspectorChainWebpack,
  InspectorConfig,
  createLaunchEditorMiddleware,
} from '../webpack'


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
   *
   * due to umi3 not use webpack devServer,
   * so need add launch editor middleware manually
   */
  api.addBeforeMiddewares(createLaunchEditorMiddleware)

  api.chainWebpack((chain) => inspectorChainWebpack(chain, inspectorConfig))
}
