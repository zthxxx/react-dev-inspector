import type { Compiler } from 'webpack'
import { launchEditorMiddleware } from './launchEditorMiddleware'


/**
 * [webpack service side]
 *
 * add launch editor middleware in webpack devServer.before method
 *
 * https://webpack.js.org/configuration/dev-server/#devserverbefore
 * https://webpack.js.org/contribute/writing-a-plugin
 */
export class ReactInspectorPlugin {
  public apply(compiler: Compiler) {
    if (!compiler.options.devServer) {
      compiler.options.devServer = {
        before: (app) => {
          app.use(launchEditorMiddleware)
        },
      }
      return
    }

    const originBefore = compiler.options.devServer.before
    compiler.options.devServer.before = (app, server, compiler) => {
      app.use(launchEditorMiddleware)
      originBefore?.(app, server, compiler)
    }
  }
}
