const { ReactInspectorPlugin } = require('react-dev-inspector/plugins/webpack')
const {
  override,
  disableEsLint,
  addWebpackResolve,
  addWebpackAlias,
  addBabelPlugin,
  addBabelPresets,
  addWebpackPlugin,
} = require('customize-cra')

/**
 * origin config: https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/config/webpack.config.js
 *
 * customize-cra api code: https://github.com/arackaf/customize-cra/blob/master/src
 */
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

  addBabelPlugin([
    'react-dev-inspector/plugins/babel',
    {
      excludes: [
        /xxxx-want-to-ignore/,
      ],
    },
  ]),
  addWebpackPlugin(
    new ReactInspectorPlugin(),
  ),
)
