import type { LaunchEditorParams } from './types'

/**
 * endpoint params for {@link LaunchEditorParams}
 */
export const launchEditorEndpoint = '/__inspect-open-in-editor'

/**
 * @deprecated replace to use {@link launchEditorEndpoint}
 *   legacy endpoint in `react-dev-utils/launchEditorEndpoint`
 *
 *   retain origin endpoint for backward compatibility <= v2.1.0-beta.7
 *
 *   - https://github.com/facebook/create-react-app/blob/v5.0.1/packages/react-dev-utils/launchEditorEndpoint.js
 *   - used in https://github.com/facebook/create-react-app/blob/v5.0.1/packages/react-dev-utils/errorOverlayMiddleware.js#L14
 *
 */
export const reactDevUtilsLaunchEditorEndpoint = '/__open-stack-frame-in-editor'

