import path from 'node:path'
import { transformSync, type TransformOptions } from '@babel/core'
import globby from 'globby'
import pluginTester from 'babel-plugin-tester'
import InspectorBabelPlugin, { type InspectorPluginOptions } from '..'

// working directory is package root dir
const fixturesDir = 'src/tests/fixtures'
/**
 * can be update or regenerate by `pnpm gen:test-outputs`
 */
const outputsDir = 'src/tests/outputs'

const cwd = process.cwd()

const babelOptions: TransformOptions = {
  babelrc: false,
  configFile: false,
  compact: false,
  parserOpts: {
    sourceType: 'module',
    plugins: [
      'typescript',
      'jsx',
    ],
  },
}
// https://github.com/babel-utils/babel-plugin-tester#options
pluginTester({
  title: 'inspector babel plugin test',
  plugin: InspectorBabelPlugin,
  pluginName: '@react-dev-inspector/babel-plugin',
  pluginOptions: <InspectorPluginOptions>{
    cwd,
  },

  babelOptions,

  tests: globby
    .sync(`${fixturesDir}/layouts/**/*.(ts|tsx)`)
    .map((filePath) => path.relative(fixturesDir, filePath))
    .map((asset) => ({
      title: asset,
      fixture: path.join(cwd, fixturesDir, asset),
      outputFixture: path.join(cwd, outputsDir, asset),
    })),
  formatResult: (code: string) => transformSync(code, babelOptions)?.code ?? '',
})

