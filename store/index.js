import {getUserFromCookie, getUserFromSession} from '@/helpers'

export const actions = {
  async nuxtServerInit ({ commit }, { req }) {
    const user = getUserFromCookie(req)
    if (user) {
      await commit('user/USER', {
        displayName: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
        emailVerified: user.emailVerified,
        uid: user.uid,
        isAnonymous: user.isAnonymous
      })
      await commit('user/IS_LOGGED_IN', true)
    }
  }
}
