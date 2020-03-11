import auth from '~/plugins/lib/auth/index'
import db from '~/plugins/lib/db/index'
import Cookies from 'js-cookie'

const state = () => ({
  user: null,
  isLoggedIn: false,
  users: [],
  collections: [],
  orders: []
})

const mutations = {
  USER(state, user) {
    state.user = user
  },
  IS_LOGGED_IN(state, status) {
    state.isLoggedIn = status
  },
  USERS(state, users) {
    state.users = users
  },
  COLLECTIONS(state, collections) {
    state.collections = collections
  },
  UPDATE_USER(state, user) {
    state.users[_.findIndex(state.users, { uid: user.uid })] = user
  },
  ORDERS(state, orders) {
    state.orders = orders
  },
  PROCESS_ORDER(state, order) {
    state.orders[_.findIndex(state.orders, { id: order.id })] = order
  },
  UPDATE_COLLECTION_STATUS(state, { id, status }) {
    const colIndex = _.findIndex(state.collections, { id: id })
    state.collections[colIndex].status = status
  }
}

const getters = {
  user(state) {
    return state.user
  },
  isLoggedIn(state) {
    return state.isLoggedIn
  },
  users(state) {
    return state.users
  },
  collections(state) {
    return state.collections
  },
  orders(state) {
    return state.orders
  }
}

const actions = {
  async getUsers(context) {
    const res = await this.$axios.get('/users')
    context.commit('USERS', res.data.users)
  },
  async getCollections(context) {
    const res = await this.$axios.get('/collections')
    context.commit('COLLECTIONS', res.data.collections)
  },
  async updateUser(context, data) {
    const res = await this.$axios.patch(`/users/${data.uid}`, data)
    context.commit('UPDATE_USER', res.data.user)
  },
  async updateCollection(context, { id, data }) {
    await db.updateCollection(id, data)
    context.commit('UPDATE_COLLECTION_STATUS', {
      id,
      status: data.status
    })
  },
  async getOrders(context, query) {
    const res = await this.$axios.get('/orders')
    context.commit('ORDERS', res.data.orders)
  },
  async processOrder(context, { order, status }) {
    let reqStatus = true
    try{
      const res = await this.$axios.put(`/orders/${order.id}/process/${status}`)
      context.commit('PROCESS_ORDER', {
        ...order,
        status
      })
    } catch(e){
      reqStatus = false
    }
    return reqStatus
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
