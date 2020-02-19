import { getUserFromCookie } from '@/helpers'

export const actions = {
  async nuxtServerInit({ commit }, { req }) {
    const user = getUserFromCookie(req.headers.cookie)
    if (user) {
      await commit('user/USER', {
        displayName: user.name,
        email: user.email,
        emailVerified: user.email_verified,
        uid: user.user_id,
        role: user.role
      })
      await commit('user/IS_LOGGED_IN', true)
      return
    }
  }
}
