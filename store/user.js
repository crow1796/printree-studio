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

const actions = {
  async saveAuthToken(context, token){
    await this.$axios.put('/verify-token', {token})
    Cookies.set("access_token", token);
  },
  async createAccount(context, data) {
    let res = await auth.createUserWithEmailAndPassword(data)
    if (res.status) res = context.dispatch('signIn', data)
    return res
  },
  async signIn(context, data) {
    let res = await auth.signInWithEmailAndPassword(data)
    if (res.status && res.user) {
      context.commit('USER', res.user)
      context.commit('IS_LOGGED_IN', true)
      await context.dispatch('saveAuthToken', res.user.token)
    }
    return res
  },
  sendPasswordRecovery(context, data) {

  },
  async socialLogin(context, type){
    const response = await auth.socialLogin(type)
    if (response.status && response.user) {
      context.commit('USER', response.user)
      context.commit('IS_LOGGED_IN', true)
      await context.dispatch('saveAuthToken', response.user.token)
    }
    return response
  },
  async signOut(context){
    await auth.signOut()
    Cookies.remove('access_token')
    context.commit('IS_LOGGED_IN', false)
    context.commit('USER', null)
  },
  async signInAsAGuest(context){
    const response = await auth.signInAsAGuest()
    await context.dispatch('saveAuthToken', response.user.token)
    return response
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
