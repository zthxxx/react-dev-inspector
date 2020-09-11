declare module 'global' {
  global {
    interface Window {
      /**
       * @import { DevToolsHook } from 'https://github.com/facebook/react/blob/v16.13.1/packages/react-devtools-shared/src/backend/types.js'
       * @type DevToolsHook
       */
      __REACT_DEVTOOLS_GLOBAL_HOOK__: any;

      __REACT_DEVTOOLS_TARGET_WINDOW__: Window;
    }
  }
}
