// @ts-nocheck
import type { Compiler } from 'webpack'
import { launchEditorMiddleware } from './middlewares'


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
      compiler.options.devServer = {}
    }
    const { devServer } = compiler.options

    /**
     * for webpack@^5 + webpack-dev-server@^4.7
     */
    const originSetup = devServer.setupMiddlewares
    devServer.setupMiddlewares = (middlewares, devServer) => {
      const result = originSetup ? originSetup(middlewares, devServer) : middlewares
      result.unshift(launchEditorMiddleware)
      return result
    }
  }
}
