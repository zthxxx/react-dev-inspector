// https://umijs.org/config/
import { defineConfig } from 'umi'
import path from 'path'


export default defineConfig({
  title: false,
  hash: true,
  history: {
    type: 'browser',
  },
  // umi routes: https://umijs.org/docs/routing
  // routes: [
  //   { exact: true, path: '/', component: 'index' },
  // ],
  publicPath: '/umi3/',
  alias: {
    src: path.resolve(__dirname, 'src'),
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
    'react-dev-inspector/plugins/umi/react-inspector',
  ],
})
