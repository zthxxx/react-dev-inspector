import path from 'path'
import { transformSync } from '@babel/core'
import type { TransformOptions } from '@babel/core'
import globby from 'globby'
import pluginTester from 'babel-plugin-tester'
import { InspectorBabelPlugin } from '../src/plugins/babel'
import type { InspectorPluginOptions } from '../src/plugins/babel'

// working directory is project root dir
const assetsBaseDir = './sites/umi3/src'
const fixturesBaseDir = './tests/fixtures'

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
  pluginName: 'InspectorBabelPlugin',
  pluginOptions: <InspectorPluginOptions>{
    cwd: `${cwd}/sites/umi3/src`,
  },

  babelOptions,

  tests: globby
    .sync(`${assetsBaseDir}/layouts/**/*.tsx`)
    .map((filePath) => path.relative(assetsBaseDir, filePath))
    .map((asset) => ({
      fixture: path.join(cwd, assetsBaseDir, asset),
      outputFixture: path.join(cwd, fixturesBaseDir, asset),
    })),
  formatResult: (code: string) => transformSync(code, babelOptions)?.code ?? '',
})

