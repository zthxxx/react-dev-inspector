import type { NextHandleFunction, IncomingMessage } from 'connect'

export const queryParser: NextHandleFunction = (req: IncomingMessage & { query?: Object }, res, next) => {
  if (!req.query && req.url) {
    const url = new URL(req.url, 'https://placeholder.domain')
    const query = url.searchParams
    req.query = Object.fromEntries(query.entries())
  }
  next()
}
