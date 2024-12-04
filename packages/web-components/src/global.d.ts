declare module 'global' {
  global {
    interface Window {
      __REACT_DEVTOOLS_TARGET_WINDOW__: Window;
    }
  }
}


declare module '*.css'
declare module '*.less'


declare module '*.css?inline' {
  const stylesheet: string
  export default stylesheet
}

/**
 * - `?inline` for vite: https://vitejs.dev/guide/features#disabling-css-injection-into-the-page
 * - in rollup, use `alias` to remove `?inline` query params
 */
declare module '*.less?inline' {
  const stylesheet: string
  export default stylesheet
}
