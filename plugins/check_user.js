import { fireAuth } from '~/plugins/firebase'

export default function({store}){
  fireAuth.onAuthStateChanged((user) => {
    if(user){
      store.commit('user/USER', {
        displayName: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
        emailVerified: user.emailVerified,
        uid: user.uid,
        isAnonymous: user.isAnonymous
      })
      store.commit('user/IS_LOGGED_IN', true)
      return
    }
    store.commit('user/USER', null)
    store.commit('user/IS_LOGGED_IN', false)
  })
}
