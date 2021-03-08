import type { PluginObj } from '@babel/core'
import { createVisitor } from './visitor'

export interface InspectorPluginOptions {
  /** override process.cwd() */
  cwd?: string,
  /** patterns to exclude matched files */
  excludes?: (string | RegExp)[],
}

export function InspectorBabelPlugin(babel, options?: InspectorPluginOptions): PluginObj {
  return {
    name: 'react-dev-inspector-babel-plugin',

    visitor: createVisitor({
      cwd: options?.cwd,
      excludes: [
        'node_modules/',
        ...options?.excludes ?? [],
      ],
    }),
  }
}

export default InspectorBabelPlugin
