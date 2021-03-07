/**
 * preset plugins for umi3
 */

import type { IApi } from '@umijs/types'
import {
  createLaunchEditorMiddleware,
} from '../webpack/launchEditorMiddleware'
import type { InspectorPluginOptions } from '../babel'

export default function inspectorPlugin(api: IApi) {
  const inspectorConfig = api.userConfig.inspectorConfig as InspectorPluginOptions | undefined

  api.describe({
    key: 'inspectorConfig',
    config: {
      schema(joi) {
        return joi.object()
      },
    },
    enableBy: api.EnableBy.register,
  })

  api.modifyBabelOpts((babelOptions) => {
    babelOptions.plugins.unshift([
      'react-dev-inspector/plugins/babel',
      {
        cwd: inspectorConfig?.cwd,
        excludes: [
          /\.umi(-production)?\//,
          ...inspectorConfig?.excludes ?? [],
        ],
      },
    ])
    return babelOptions
  })

  /**
   * Inspector component open file into IDE via `/__open-stack-frame-in-editor/relative` api,
   * which is created by `errorOverlayMiddleware` and
   * defined in 'react-dev-utils/launchEditorEndpoint'
   *
   * due to umi3 not use webpack devServer,
   * so need add launch editor middleware manually
   */
  api.addBeforeMiddewares(createLaunchEditorMiddleware)
}
