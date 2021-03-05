const { ReactInspectorPlugin } = require('react-dev-inspector/plugins/webpack')
const {
  override,
  disableEsLint,
  addWebpackResolve,
  addWebpackAlias,
  addBabelPresets,
  addWebpackPlugin,
} = require('customize-cra')


module.exports = override(
  disableEsLint(),
  addWebpackResolve({
    symlinks: false,
  }),
  addWebpackAlias({
    react: require.resolve('react'),
  }),
  ...addBabelPresets(
    [
      // https://github.com/emotion-js/emotion/tree/master/packages/babel-preset-css-prop#options
      '@emotion/babel-preset-css-prop',
      {
        autoLabel: true,
      },
    ],
  ),

  /**
   * react-dev-inspector example configuration is as follows
   */

  (config) => {
    config.module.rules.unshift({
      enforce: 'pre',
      test: /\.[jt]sx$/,
      exclude: [
        /node_modules/,
        /\/devTools\//,
        /\.storybook\//,
      ],
      use: [
        {
          loader: 'react-dev-inspector/plugins/webpack/inspector-loader',
          options: {
            // loader options docs see:
            // https://github.com/zthxxx/react-dev-inspector#inspector-loader-props
            exclude: [],
            babelPlugins: [],
            babelOptions: {},
          },
        },
      ],
    })
    return config
  },
  addWebpackPlugin(
    new ReactInspectorPlugin(),
  ),
)
