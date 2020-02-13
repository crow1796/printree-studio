import auth from '~/plugins/lib/auth/index'
import { fireAuth } from '~/plugins/firebase'
import Cookies from 'js-cookie'

const state = () => ({
  user: null,
  isLoggedIn: false
})

const mutations = {
  USER(state, user){
    state.user = user
  },
  IS_LOGGED_IN(state, status){
    state.isLoggedIn = status
  }
}

const getters = {
  user(state){
    return state.user
  },
  isLoggedIn(state) {
    return state.isLoggedIn
  }
}

const saveAuthToken = async () => {
  const token = await fireAuth.admin.currentUser.getIdToken();
  Cookies.set("access_token", token);
}

const actions = {
  async signIn(context, secret) {
    let res = await auth.signInWithCustomToken(secret)
    if (res.status && res.user) {
      context.commit('USER', res.user)
      context.commit('IS_LOGGED_IN', true)
    }
    await saveAuthToken()
    return res
  },
  signOut(context){
    Cookies.remove('access_token')
    return auth.signOut()
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
