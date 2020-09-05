import { getOptions } from 'loader-utils'
import { parse } from '@babel/parser'
import generate from '@babel/generator'
import traverse, { NodePath } from '@babel/traverse'
import {
  jsxAttribute,
  jsxIdentifier,
  stringLiteral,
  Node,
  JSXOpeningElement,
  JSXIdentifier,
  JSXMemberExpression,
  JSXNamespacedName,
} from '@babel/types'
import type webpack from 'webpack'


type NodeHandler<T = Node, O = {}> = (node: T, option?: O) => {
  /**
   * stop processing flag
   */
  stop?: boolean,

  /**
   * throw error
   */
  error?: any,

  /**
   * node after processing
   */
  result?: Node,
}

const doJSXIdentifierName: NodeHandler<JSXIdentifier> = (name) => {
  if (name.name.endsWith('Fragment')) {
    return { stop: true }
  }
  return { stop: false }
}

const doJSXMemberExpressionName: NodeHandler<JSXMemberExpression> = (name) => {
  return doJSXIdentifierName(name.property)
}

const doJSXNamespacedNameName: NodeHandler<JSXNamespacedName> = (name) => {
  return doJSXIdentifierName(name.name)
}

type ElementTypes = JSXOpeningElement['name']['type']

const doJSXPathName: NodeHandler<JSXOpeningElement['name']> = (name) => {
  const dealMap: { [key in ElementTypes]: NodeHandler } = {
    JSXIdentifier: doJSXIdentifierName,
    JSXMemberExpression: doJSXMemberExpressionName,
    JSXNamespacedName: doJSXNamespacedNameName,
  }

  return dealMap[name.type](name)
}


const doJSXOpeningElement: NodeHandler<
  JSXOpeningElement,
  { relativePath: string }
> = (node, option) => {
  const { stop } = doJSXPathName(node.name)
  if (stop) return { stop }

  const { relativePath } = option

  const lineAttr = jsxAttribute(
    jsxIdentifier('data-inspector-line'),
    stringLiteral(node.loc.start.line.toString()),
  )

  const columnAttr = jsxAttribute(
    jsxIdentifier('data-inspector-column'),
    stringLiteral(node.loc.start.column.toString()),
  )

  const relativePathAttr = jsxAttribute(
    jsxIdentifier('data-inspector-relative-path'),
    stringLiteral(relativePath),
  )

  node.attributes.push(lineAttr, columnAttr, relativePathAttr)

  return { result: node }
}

/**
 * @type webpack.loader.Loader
 * ref: https://astexplorer.net  +  @babel/parser
 *
 * add line, column, relative-path to JSX html data attribute
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
  const relativePath = filePath.slice(rootPath.length + 1)

  const options = getOptions(this)

  if (options?.exclude?.length > 0) {
    const isSkip = options.exclude.some(path => filePath.includes(path))
    if (isSkip) {
      return source
    }
  }

  const ast: Node = parse(source, {
    sourceType: 'module',
    allowUndeclaredExports: true,
    allowImportExportEverywhere: true,
    plugins: ['typescript', 'jsx', 'decorators-legacy', 'classProperties'],
  })


  /**
   * astexplorer + @babel/parser
   * https://astexplorer.net
   */
  traverse(ast, {
    enter(path: NodePath<Node>) {
      if (path.type === 'JSXOpeningElement') {
        doJSXOpeningElement(
          path.node as JSXOpeningElement,
          { relativePath },
        )
      }
    },
  })

  const {
    code,
  } = generate(ast, {
    decoratorsBeforeExport: true,
  })

  return code
}
