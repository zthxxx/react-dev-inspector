/**
 * https://github.com/antfu/eslint-config
 * https://eslint-config.antfu.me/rules
 */
import antfu from '@antfu/eslint-config'

/**
 * https://github.com/antfu/eslint-config#customization
 */
export default antfu(
  {
    // Type of the project. 'lib' for libraries, the default is 'app'
    type: 'lib',

    // Enable stylistic formatting rules
    // stylistic: true,

    // Or customize the stylistic rules
    stylistic: {
      indent: 2, // 4, or 'tab'
      quotes: 'single', // or 'double'
    },

    jsx: true,

    javascript: {},

    typescript: true,
    unicorn: false,
    test: false,
    vue: false,
    jsonc: false,
    yaml: false,
    toml: false,
    astro: false,
    markdown: false,
    regexp: false,
    react: false,
    solid: false,
    svelte: false,
    unocss: false,
    formatters: false,

    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/src/tests/outputs/**',
      '**/src/.stories/components/**',
    ],
  },
  {
    rules: {
      /**
       * back `@stylistic/member-delimiter-style` to default error
       * - https://eslint.style/rules/default/member-delimiter-style
       * - https://github.com/eslint-stylistic/eslint-stylistic/blob/v3.0.1/packages/eslint-plugin/configs/customize.ts#L72
       */
      'style/member-delimiter-style': ['error', {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
        multilineDetection: 'brackets',
        overrides: {},
      }],

      /**
       * back `@stylistic/no-multiple-empty-lines` to default error
       * - https://eslint.style/rules/default/no-multiple-empty-lines
       * - https://github.com/eslint-stylistic/eslint-stylistic/blob/v3.0.1/packages/eslint-plugin/configs/customize.ts#L104
       */
      'style/no-multiple-empty-lines': ['error', { max: 2, maxBOF: 1, maxEOF: 2 }],

      /**
       * - https://eslint.style/rules/default/jsx-quotes
       * - https://github.com/eslint-stylistic/eslint-stylistic/blob/v3.0.1/packages/eslint-plugin/configs/customize.ts#L153
       */
      '@stylistic/jsx-quotes': ['error', 'prefer-single'],

      /**
       * allow cases:
       *
       * ```jsx
       * List elements as render hierarchy. <br />
       *
       * #{index() + 1}
       *
       * <span>({position().top.toFixed(0)}, {position().left.toFixed(0)})</span>
       *
       * <span>&lrm;{props.item.subtitle || '—'}&lrm;</span>
       * ```
       *
       * - https://eslint.style/rules/default/jsx-one-expression-per-line
       * - https://github.com/eslint-stylistic/eslint-stylistic/blob/v3.0.1/packages/eslint-plugin/configs/customize.ts#L152
       */
      'style/jsx-one-expression-per-line': ['off'],


      /**
       * allow cases:
       * ```ts
       * { element1, element2, element3 }
       *
       * {
       *   element1,
       *   element2,
       *   element3,
       *   element4,
       * }
       * ```
       * https://eslint.style/rules/default/object-curly-newline
       */
      'style/object-curly-newline': [
        'error',
        {
          ObjectExpression: {
            minProperties: 4,
            multiline: true,
            consistent: true,
          },
          ObjectPattern: {
            minProperties: 4,
            multiline: true,
            consistent: true,
          },
          ImportDeclaration: {
            minProperties: 4,
            multiline: true,
            consistent: true,
          },
          ExportDeclaration: {
            minProperties: 4,
            multiline: true,
            consistent: true,
          },
        },
      ],

      /**
       * https://eslint.style/rules/default/indent
       */
      'style/indent': ['error', 2, {
        ArrayExpression: 1,
        CallExpression: { arguments: 1 },
        flatTernaryExpressions: false,
        FunctionDeclaration: { body: 1, parameters: 1 },
        FunctionExpression: { body: 1, parameters: 1 },
        ignoreComments: false,
        ImportDeclaration: 1,
        MemberExpression: 1,
        ObjectExpression: 1,
        outerIIFEBody: 1,
        SwitchCase: 1,
        tabLength: 2,
        VariableDeclarator: 1,

        offsetTernaryExpressions: false,
        ignoredNodes: [
          'TSUnionType',
          'TSIntersectionType',
          'TSTypeParameterInstantiation',
          'PropertyDefinition[decorators]',
          'FunctionExpression > .params[decorators.length > 0]',
        ],
      }],

      /**
       * https://eslint.style/rules/default/quotes
       */
      'style/quotes': [
        'error',
        'single',
        {
          avoidEscape: true,
          allowTemplateLiterals: true,
        },
      ],

      /**
       * https://eslint.style/rules/default/quote-props
       */
      'style/quote-props': ['error', 'as-needed'],

      /**
       * https://eslint.style/rules/default/arrow-parens
       */
      'style/arrow-parens': ['off'],

      /**
       * allow cases:
       *
       * ```ts
       * (next, middleware) => (
       *   () => { middleware(req, res, next) }
       * )
       * ```
       *
       * and avoid too many edge cases with incorrect auto fix
       * - https://eslint.style/rules/default/no-extra-parens
       */
      'style/no-extra-parens': ['off'],

      /**
       * allow cases:
       *
       * ```ts
       * class={`absolute top-0 right-0 z-10 cursor-nesw-resize`}
       * ```
       *
       * and avoid too many edge cases with incorrect auto fix
       * - https://eslint.style/rules/jsx/jsx-curly-brace-presence
       */
      'style/jsx-curly-brace-presence': ['off'],

      /**
       * and avoid too many edge cases with incorrect auto fix
       * - https://eslint.style/rules/jsx/jsx-curly-newline
       */
      'style/jsx-curly-newline': ['error', {
        multiline: 'consistent',
        singleline: 'consistent',
      }],

      /**
       * use both
       * ```ts
       * import type { Meta, StoryFn } from '@storybook/react'
       * import Foo, { type Bar, OOT } from 'Foo'
       * ```
       *
       * - https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/consistent-type-specifier-style.md
       * - https://github.com/antfu/eslint-config/blob/v4.1.1/src/configs/imports.ts#L22
       */
      'import/consistent-type-specifier-style': ['off'],

      /**
       * - https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-duplicates.md
       * - https://github.com/antfu/eslint-config/blob/v4.1.1/src/configs/imports.ts#L24
       */
      'import-x/no-duplicates': ['error', {
        considerQueryString: true,
        'prefer-inline': true,
      }],

      'perfectionist/sort-exports': ['off', { order: 'asc', type: 'natural' }],
      /**
       * https://perfectionist.dev/rules/sort-imports
       */
      'perfectionist/sort-imports': ['off', {
        order: 'asc',
        type: 'natural',
        newlinesBetween: 'ignore',
        internalPattern: [
          '^~/.*$',
          '^src(/.*)?$',
          '^#.*$',
          '^@stories/.*$',
        ],
        // customGroups: {},
        groups: [
          'unknown',
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'style',
          'side-effect',
          'side-effect-style',
          'object',
        ],
      }],
      'perfectionist/sort-named-exports': ['off', { order: 'asc', type: 'natural' }],
      'perfectionist/sort-named-imports': ['off', { order: 'asc', type: 'natural' }],

      /**
       * https://github.com/antfu/eslint-plugin-antfu/blob/v3.0.0/src/rules/top-level-function.md
       * https://github.com/antfu/eslint-config/blob/v4.1.1/src/configs/stylistic.ts#L63
       */
      'antfu/top-level-function': ['off'],
    },
  },
)
  /**
   * disable correctness check, only use stylistic rules
   *
   * - https://github.com/antfu/eslint-config/blob/v4.1.1/src/configs/typescript.ts#L120
   */
  .remove('antfu/typescript/rules')
  /**
   * disable correctness check, only use stylistic rules
   *
   * https://github.com/antfu/eslint-config/blob/v4.1.1/src/configs/javascript.ts#L42
   */
  .remove('antfu/javascript/rules')
  /**
   * disable correctness check, only use stylistic rules
   *
   * https://github.com/antfu/eslint-config/blob/v4.1.1/src/configs/node.ts#L8
   */
  .remove('antfu/node/rules')
