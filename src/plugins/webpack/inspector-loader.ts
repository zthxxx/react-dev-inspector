/**
 * @deprecated deprecated in v1.4.0
 *   migrate to `react-dev-inspector/plugins/babel`
 *   retain for backward compatibility <= v1.3.*
 */
import path from 'path'
import { getOptions } from 'loader-utils'
import { parse } from '@babel/parser'
import generate from '@babel/generator'
import traverse  from '@babel/traverse'
import type {
  Node,
  JSXOpeningElement,
} from '@babel/types'
import type webpack from 'webpack'
import {
  pathMatch,
  doJSXOpeningElement,
} from '../babel/visitor'
import type { InspectorConfig } from './config-inspector'


/**
 * [webpack compile time]
 *
 * inject line, column, relative-path to JSX html data attribute in source code
 *
 * @type webpack.loader.Loader
 * ref: https://astexplorer.net  +  @babel/parser
 */
export default function inspectorLoader(this: webpack.loader.LoaderContext, source: string) {
  const {
    rootContext: rootPath,
    resourcePath: filePath,
  } = this

  /**
   * example:
   * rootPath: /home/xxx/project
   * filePath: /home/xxx/project/src/ooo/xxx.js
   * relativePath: src/ooo/xxx.js
   */
  const relativePath = path.relative(rootPath, filePath)

  const options: InspectorConfig = getOptions(this)

  const isSkip = pathMatch(filePath, options.excludes)
  if (isSkip) {
    return source
  }

  const ast: Node = parse(source, {
    sourceType: 'module',
    allowUndeclaredExports: true,
    allowImportExportEverywhere: true,
    plugins: [
      'typescript',
      'jsx',
      'decorators-legacy',
      'classProperties',
      ...options?.babelPlugins ?? [],
    ],
    ...options?.babelOptions,
  })


  /**
   * astexplorer + @babel/parser
   * https://astexplorer.net
   */
  traverse(ast, {
    JSXOpeningElement: {
      enter(path) {
        doJSXOpeningElement(
          path.node as JSXOpeningElement,
          { relativePath },
        )
      },
    },
  })

  const {
    code,
  } = generate(ast, {
    decoratorsBeforeExport: true,
  })

  return code
}
