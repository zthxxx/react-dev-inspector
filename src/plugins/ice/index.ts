import * as path from 'path'
import { launchEditorMiddleware } from '../webpack/launchEditorMiddleware'

const plugin = ({ onGetWebpackConfig }) => {
  if (process.env.NODE_ENV === 'production') {
    return
  }

  onGetWebpackConfig((config) => {
    // inject source file path/line/column to JSX data attributes props
    config.module
      .rule('inspector')
      .test(/\.(jsx?|tsx)$/)
      .exclude.add(/node_modules/)
      .add(/\.ice\//)
      .add(/\.rax\//)
      .end()
      .use('inspector')
      .loader(path.join(__dirname, '../webpack/inspector-loader'))
      .options({})
      .end()

    // add webpack dev server middleware for launch IDE app with api request
    const originalDevServeBefore = config.devServer.get('before')
    config.merge({
      devServer: {
        before(app, server) {
          app.get('*', launchEditorMiddleware)
          if (typeof originalDevServeBefore === 'function') {
            originalDevServeBefore(app, server)
          }
        },
      },
    })
  })
}

export default plugin
