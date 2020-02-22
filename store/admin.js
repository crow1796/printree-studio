import auth from '~/plugins/lib/auth/index'
import db from '~/plugins/lib/db/index'
import Cookies from 'js-cookie'

const state = () => ({
  user: null,
  isLoggedIn: false,
  users: [],
  collections: []
})

const mutations = {
  USER(state, user){
    state.user = user
  },
  IS_LOGGED_IN(state, status){
    state.isLoggedIn = status
  },
  USERS(state, users){
    state.users = users
  },
  COLLECTIONS(state, collections){
    state.collections = collections
  },
  UPDATE_USER(state, user){
    state.users[_.findIndex(state.users, { uid: user.uid})] = user
  }
}

const getters = {
  user(state){
    return state.user
  },
  isLoggedIn(state) {
    return state.isLoggedIn
  },
  users(state){
    return state.users
  },
  collections(state){
    return state.collections
  }
}

const actions = {
  async getUsers(context){
    const res = await this.$axios.get('/users')
    context.commit('USERS', res.data.users)
  },
  async getCollections(context){
    const res = await this.$axios.get('/collections')
    context.commit('COLLECTIONS', res.data.collections)
  },
  async updateUser(context, data){
    const res = await this.$axios.patch(`/users/${data.uid}`, data)
    context.commit('UPDATE_USER', res.data.user)
  },
  async updateCollection(context, {id, data}){
    await db.updateCollection(id, data)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
