import auth from '~/plugins/lib/auth/index'

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
  async createAccount(context, data) {
    let res = await auth.createUserWithEmailAndPassword(data)
    if (res.status) context.dispatch('signIn', data)
    return res
  },
  async signIn(context, data) {
    let res = await auth.signInWithEmailAndPassword(data)
    return res
  },
  sendPasswordRecovery(context, data) {

  },
  async socialLogin(context, type){
    const response = await auth.socialLogin(type)
    if (response.status && response.user) {
      context.commit('USER', response.user)
      context.commit('IS_LOGGED_IN', true)
    }
    return response
  },
  signOut(context){
    return auth.signOut()
  },
  async signInAsAGuest(context){
    const response = await auth.signInAsAGuest()
    return response
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
