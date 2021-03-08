import path from 'path'
import type { RequestHandler } from 'express'
import createReactLaunchEditorMiddleware from 'react-dev-utils/errorOverlayMiddleware'
import launchEditorEndpoint from 'react-dev-utils/launchEditorEndpoint'

const reactLaunchEditorMiddleware: RequestHandler = createReactLaunchEditorMiddleware()


export const launchEditorMiddleware: RequestHandler = (req, res, next) => {
  if (req.url.startsWith(launchEditorEndpoint)) {
    /**
     * retain origin endpoint for backward compatibility <= v1.2.0
     */
    if (
      // relative route used in `Inspector.tsx` `gotoEditor()`
      req.url.startsWith(`${launchEditorEndpoint}/relative`)
      && typeof req.query.fileName === 'string'
    ) {
      req.query.fileName = path.join(process.cwd(), req.query.fileName)
    }

    reactLaunchEditorMiddleware(req, res, next)
  } else {
    next()
  }
}

/**
 * retain create method for backward compatibility <= v1.2.0
 */
export const createLaunchEditorMiddleware: () => RequestHandler = () => launchEditorMiddleware
