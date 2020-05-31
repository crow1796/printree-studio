import jwtDecode from 'jwt-decode'
var cookieparser = require('cookieparser')

export function getUserFromCookie (cookie) {
  if (cookie) {
    const parsed = cookieparser.parse(cookie)
    const accessTokenCookie = parsed.access_token
    if (!accessTokenCookie) return

    const decodedToken = jwtDecode(cookie)
    if (!decodedToken) return
    return decodedToken
  }
}

export function getUserFromSession (req) {
  return req.session ? req.session.userId : null
}
