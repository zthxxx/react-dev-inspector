// https://umijs.org/config/
import { defineConfig } from 'umi'


export default defineConfig({
  title: false,
  hash: true,
  history: {
    type: 'browser',
  },
  publicPath: '/umi3/',
  alias: {
    react: require.resolve('react'),
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

  /**
   * react-dev-inspector example configuration is as follows
   */
  plugins: [
    'react-dev-inspector/plugins/umi/react-inspector',
  ],
})
