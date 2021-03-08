import path from 'path'
import globby from 'globby'
import fs from 'fs'
import type webpack from 'webpack'
import inspectorLoader from '../src/plugins/webpack/inspector-loader'

// working directory is project root dir
const assetsBaseDir = './sites/umi3/src'
const fixturesBaseDir = './tests/fixtures'

const assets = globby
  .sync(`${assetsBaseDir}/layouts/**/*.tsx`)
  .map((filePath) => path.relative(assetsBaseDir, filePath))

describe('inspector-loader test', () => {
  assets.forEach((asset) => {
    test(asset, () => {
      const filePath = path.join(assetsBaseDir, asset)
      const fixturePath = path.join(fixturesBaseDir, asset)
      const source = fs.readFileSync(filePath, { encoding: 'utf-8' }).toString()
      const fixture = fs.readFileSync(fixturePath, { encoding: 'utf-8' }).toString()

      const content = {
        rootContext: assetsBaseDir,
        resourcePath: filePath,
        query: {},
      } as any as webpack.loader.LoaderContext

      const output = inspectorLoader.call(content, source.toString())
      expect(output).toEqual(fixture)
    })
  })
})
