import jwtDecode from 'jwt-decode'
var cookieparser = require('cookieparser')

export function getUserFromCookie (cookie) {
  if (process.server && process.static) return
  if (!cookie) return

  if (cookie) {
    const parsed = cookieparser.parse(cookie)
    const accessTokenCookie = parsed.access_token
    if (!accessTokenCookie) return

    const decodedToken = jwtDecode(accessTokenCookie)
    if (!decodedToken) return
    return decodedToken
  }
}

export function getUserFromSession (req) {
  return req.session ? req.session.userId : null
}
