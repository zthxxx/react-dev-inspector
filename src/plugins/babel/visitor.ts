import { relative } from 'path'
import type { PluginPass } from '@babel/core'
import type {
  JSXAttribute,
  JSXIdentifier,
  JSXMemberExpression,
  JSXNamespacedName,
  JSXOpeningElement,
  Node,
} from '@babel/types'
import {
  jsxAttribute,
  jsxIdentifier,
  stringLiteral,
} from '@babel/types/lib/builders/generated'
import type { Visitor } from '@babel/traverse'


const isNil = (value: any): value is null | undefined => value === null || value === undefined

/**
 * simple path match method, only use string and regex
 */
export const pathMatch = (filePath: string, matches?: (string | RegExp)[]): boolean => {
  if (!matches?.length) return false

  return matches.some((match) => {
    if (typeof match === 'string') {
      return filePath.includes(match)
    } else if (match instanceof RegExp) {
      return match.test(filePath)
    }
    // default is do not filter when match is illegal, so return true
    return true
  })
}


type NodeHandler<T = Node, O = void> = (node: T, option: O) => {
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


export const doJSXOpeningElement: NodeHandler<
  JSXOpeningElement,
  { relativePath: string }
> = (node, option) => {
  const { stop } = doJSXPathName(node.name)
  if (stop) return { stop }

  const { relativePath } = option
  const line = node.loc?.start.line
  const column = node.loc?.start.column

  const lineAttr: JSXAttribute | null = isNil(line)
    ? null
    : jsxAttribute(
      jsxIdentifier('data-inspector-line'),
      stringLiteral(line.toString()),
    )

  const columnAttr: JSXAttribute | null = isNil(column)
    ? null
    : jsxAttribute(
      jsxIdentifier('data-inspector-column'),
      stringLiteral(column.toString()),
    )

  const relativePathAttr: JSXAttribute = jsxAttribute(
    jsxIdentifier('data-inspector-relative-path'),
    stringLiteral(relativePath),
  )

  const attributes = [lineAttr, columnAttr, relativePathAttr] as JSXAttribute[]

  // Make sure that there are exist together
  if (attributes.every(Boolean)) {
    node.attributes.unshift(...attributes)
  }

  return { result: node }
}

const memo = (handler): typeof handler => {
  const cache = new Map<any, ReturnType<typeof handler>>()
  return (arg) => {
    if (cache.has(arg)) {
      return cache.get(arg)
    }
    const result = handler(arg)
    cache.set(arg, result)
    return result
  }
}

export const createVisitor = ({ cwd, excludes }: {
  cwd?: string,
  excludes?: (string | RegExp)[],
}): Visitor => {
  const isExclude = excludes?.length
    ? memo((filePath: string): boolean => pathMatch(filePath, excludes))
    : () => false

  const pathRelative = memo((filePath: string): string => relative(
    cwd ?? process.cwd(),
    filePath,
  ))

  const visitor: Visitor = {
    JSXOpeningElement: {
      enter(path, state: PluginPass) {
        const filePath = state?.file?.opts?.filename
        if (!filePath) return
        if (isExclude(filePath)) return

        const relativePath = pathRelative(filePath)

        doJSXOpeningElement(
          path.node,
          {
            relativePath,
          },
        )
      },
    },
  }

  return visitor
}

