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
   * https://github.com/antfu/eslint-plugin-antfu/blob/v3.0.0/src/rules/top-level-function.md
   * https://github.com/antfu/eslint-config/blob/v4.1.1/src/configs/stylistic.ts#L63
   */
  .removeRules('antfu/top-level-function')
