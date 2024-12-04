import ts from 'typescript'
import { defineConfig } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import alias from '@rollup/plugin-alias'
import { minify } from 'rollup-plugin-esbuild'
import postcss from 'rollup-plugin-postcss'
import { babel, type RollupBabelInputPluginOptions } from '@rollup/plugin-babel'
import { dts } from 'rollup-plugin-dts'

import pkg from './package.json'

// https://rollupjs.org/configuration-options/
// https://github.com/solidjs-community/rollup-preset-solid/blob/master/src/index.ts
export default defineConfig(() => {
  const input = 'src/index.ts'
  const sourcemap = false
  const isMinify = !process.env.DISABLE_BUILD_MINIFY

  const extensions = ['.js', '.ts', '.jsx', '.tsx']

  /**
   * https://github.com/solidjs-community/rollup-preset-solid/blob/2.0.0/src/index.ts#L265
   * https://github.com/solidjs/solid/blob/main/packages/babel-preset-solid/README.md
   */
  const solidOptions = {}

  /**
   * @type {RollupBabelInputPluginOptions}
   */
  const babelOptions: RollupBabelInputPluginOptions = {}

  const babelTargets = 'browserslist' in pkg
    ? pkg.browserslist
    : 'last 2 years'

  const external = [
    // regexp for match subpath import
    /^solid-js/,
    /^@kobalte\/core/,

    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys('peerDependencies' in pkg
      ? pkg.peerDependencies as object
      : {},
    ),
  ]

  return [
    {
      input,
      external,
      treeshake: true,
      output: [
        {
          dir: 'dist/esm',
          format: 'esm',
          sourcemap,
        },
        {
          dir: 'dist/cjs',
          format: 'cjs',
          sourcemap,
        },
      ],
      plugins: [
        isMinify && minify({
          banner: `'use client';`,
        }),

        alias({
          entries: [
            {
              find: /^(?<file>.*?)\.(?<ext>css|less)\?inline$/,
              replacement: '$<file>.$<ext>',
            },
          ],
        }),

        babel({
          extensions,
          babelHelpers: 'bundled',
          presets: [
            ['babel-preset-solid', solidOptions || {}],
            '@babel/preset-typescript',
            ['@babel/preset-env', {
              bugfixes: true,
              targets: babelTargets,
            }],
          ],
          ...babelOptions,
        }),

        nodeResolve({ extensions }),

        postcss({
          inject: false,
        }),

        {
          name: 'types',
          buildEnd() {
            const program = ts.createProgram(
              [input],
              {
                ...readCompilerOptions(),
                noEmit: false,
                outDir: `dist/source`,
                sourceMap: sourcemap,
                declaration: true,
                declarationDir: `build/types`,
                declarationMap: sourcemap,
                emitDeclarationOnly: true,
              },
            )

            program.emit()
          },
        },
      ],
    },

    {
      input: `build/types/index.d.ts`,
      external,
      output: {
        file: `dist/types/index.d.ts`,
        format: 'esm',
      },
      plugins: [
        dts({
          respectExternal: true,
          compilerOptions: {
            noEmit: false,
            declaration: true,
            declarationDir: `dist/bundle-types`,
            emitDeclarationOnly: true,
            declarationMap: sourcemap,
            paths: {
              '#utils': ['build/types/utils/index.d.ts'],
              '#floating': ['build/types/floating/index.d.ts'],
              '#components': ['build/types/components/index.d.ts'],
            },
          },
        }),
      ],
    },
  ]
})


const readCompilerOptions = (tsconfigPath = 'tsconfig.json'): ts.CompilerOptions => {
  const configFile = ts.readConfigFile(
    tsconfigPath,
    ts.sys.readFile,
  )

  // parse with extend config
  const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    '.',
  )

  const compilerOptions = parsedConfig.options

  return compilerOptions
}

