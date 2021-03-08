import type { Plugin } from 'vite'
import { launchEditorMiddleware } from '../webpack/launchEditorMiddleware'
import { queryParser } from './query-parser'

export const inspectorServer = (): Plugin => ({
  name: 'inspector-server-plugin',
  configureServer(server) {
    server.middlewares.use(queryParser)

    server.middlewares.use(launchEditorMiddleware)
  },
})
