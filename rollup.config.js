// https://rollupjs.org/guide/en/#configuration-files

import builtins from 'builtin-modules'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import strip from '@rollup/plugin-strip'
import progress from 'rollup-plugin-progress'
import copy from 'rollup-plugin-copy'
import fileSize from 'rollup-plugin-filesize'
import dts from 'rollup-plugin-dts'
import packageJson from './package.json'


export default [
  {
    input: 'build/index.js',
    output: [
      {
        file: 'es/index.js',
        format: 'es',
        globals: {
          react: 'React',
        },
      },
      {
        file: 'lib/index.js',
        format: 'cjs',
        globals: {
          react: 'React',
        },
      }
    ],
    external: [
      ...builtins,
      ...Object.keys(packageJson.dependencies),
    ],
    treeshake: {
      moduleSideEffects: false,
    },
    plugins: [
      progress(),
      resolve(),
      json(),
      commonjs({
        include: 'node_modules/**',
        sourceMap: false,
      }),
      strip({
        include: [
          '**/*.js',
          '**/*.ts',
        ],
        functions: [],
      }),
      copy({
        targets: [
        ],
      }),
      fileSize({
        showMinifiedSize: false,
        showGzippedSize: false,
      }),
    ],
  },

  {
    input: 'build/index.d.ts',
    output: [
      {
        file: 'es/index.d.ts',
        format: 'es',
      },
      {
        file: 'lib/index.d.ts',
        format: 'es',
      },
    ],
    plugins: [
      progress(),
      dts(),
    ],
  },
]
