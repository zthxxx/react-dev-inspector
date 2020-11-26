import type { Compiler } from 'webpack'
import createLaunchEditorMiddleware from 'react-dev-utils/errorOverlayMiddleware'


/**
 * [webpack service side]
 *
 * add launch editor middleware in webpack devServer.before method
 *
 * https://webpack.js.org/configuration/dev-server/#devserverbefore
 * https://webpack.js.org/contribute/writing-a-plugin
 */
export class ReactInspectorPlugin {
  apply(compiler: Compiler) {
    if (!compiler.options.devServer) {
      compiler.options.devServer = {
        before: (app) => {
          app.use(createLaunchEditorMiddleware())
        },
      }
      return
    }

    const originBefore = compiler.options.devServer.before
    compiler.options.devServer.before = (app, server, compiler) => {
      app.use(createLaunchEditorMiddleware())
      originBefore?.(app, server, compiler)
    }
  }
}
