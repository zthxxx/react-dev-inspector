/**
 * `index.web.ts` is in front of `index.ts`
 *
 * due to extension order in `moduleFileExtensions`
 *
 * https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/config/paths.js#L32
 */

import React from 'react'
import ReactDOM from 'react-dom'
import Layout from './layouts'

const rootElement = document.getElementById('root')
ReactDOM.render(
  React.createElement(Layout),
  rootElement,
)
