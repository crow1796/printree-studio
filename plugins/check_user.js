import { fireAuth } from '~/plugins/firebase'
import Cookies from 'js-cookie'

export default function({ store }) {
  fireAuth.onAuthStateChanged(async user => {
    if (user) {
      const token = await user.getIdToken(true)
      store.commit('user/USER', {
        displayName: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
        emailVerified: user.emailVerified,
        uid: user.uid,
        isAnonymous: user.isAnonymous
      })
      Cookies.set('access_token', token)
      store.commit('user/IS_LOGGED_IN', true)
      return
    }
    store.commit('user/USER', null)
    store.commit('user/IS_LOGGED_IN', false)
  })
}
