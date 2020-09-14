// https://umijs.org/config/
import { defineConfig } from 'umi'
import path from 'path'


export default defineConfig({
  title: false,
  manifest: {
    basePath: '/',
  },
  hash: true,
  history: {
    type: 'browser',
  },
  // umi routes: https://umijs.org/docs/routing
  // routes: [
  //   { exact: true, path: '/', component: 'index' },
  // ],
  publicPath: '/',
  alias: {
    src: path.resolve(__dirname, 'src'),
    'react-dev-inspector': path.resolve(__dirname, '..'),
  },
  ignoreMomentLocale: true,
  targets: {
    chrome: 80,
  },

  extraBabelPresets: [
    [
      // https://github.com/emotion-js/emotion/tree/master/packages/babel-preset-css-prop#options
      '@emotion/babel-preset-css-prop',
      {
        autoLabel: true,
      },
    ],
  ],
  plugins: [
    '../plugins/umi/react-inspector',
  ],
})
