declare module 'global' {
  /**
   * those types are internals in 'https://github.com/facebook/react/blob/v16.14.0/packages/react-devtools-shared/src/backend/types.js'
   */
  type RendererID = number
  interface ReactRenderer {
    findFiberByHostInstance: (instance: any) => Fiber | undefined;
  };

  global {
    interface Window {
      /**
       * @import { DevToolsHook } from 'https://github.com/facebook/react/blob/v16.14.0/packages/react-devtools-shared/src/backend/types.js'
       * @type DevToolsHook
       */
      __REACT_DEVTOOLS_GLOBAL_HOOK__?: {
        renderers: Map<RendererID, ReactRenderer>;
      };

      __REACT_DEVTOOLS_TARGET_WINDOW__: Window;
    }
  }
}
