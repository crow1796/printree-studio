import adminDb from '~/plugins/lib/db/admin'
import db from '~/plugins/lib/db'

const state = () => ({
  user: null,
  isLoggedIn: false,
  users: [],
  collections: [],
  orders: [],
  payouts: []
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
    state.orders[_.findIndex(state.orders, { _id: order._id })] = order
  },
  UPDATE_COLLECTION_STATUS(state, { _id, status }) {
    const colIndex = _.findIndex(state.collections, { _id: _id })
    state.collections[colIndex].status = status
  },
  PAYOUTS(state, payouts) {
    state.payouts = payouts
  },
  UPDATE_PAYOUT(state, payout) {
    const index = _.findIndex(state.payouts, { _id: payout._id })
    state.payouts[index] = payout
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
  },
  payouts(state) {
    return state.payouts
  }
}

const actions = {
  async getUsers(context) {
    const users = await this.$api.admin.getUsers()
    context.commit('USERS', users)
  },
  async getCollections(context, searchQuery) {
    const collections = await this.$api.admin.getCollections(searchQuery)
    context.commit('COLLECTIONS', collections)
  },
  async updateUser(context, data) {
    const res = await this.$axios.patch(`/users/${data.uid}`, data)
    context.commit('UPDATE_USER', res.data.user)
  },
  async updateCollection(context, { _id, data }) {
    await db.updateCollection(_id, data)
    context.commit('UPDATE_COLLECTION_STATUS', {
      _id,
      status: data.status
    })
  },
  async updateCollectionStatus(context, { _id, status }) {
    await this.$api.admin.updateCollectionStatus({ _id, status })
    context.commit('UPDATE_COLLECTION_STATUS', {
      _id,
      status
    })
  },
  async getOrders(context, query) {
    const res = await this.$axios.get('/orders')
    context.commit('ORDERS', res.data.orders)
  },
  async processOrder(context, { order, status }) {
    let reqStatus = true
    try {
      const res = await this.$axios.put(`/orders/${order._id}/process/${status}`)
      context.commit('PROCESS_ORDER', {
        ...order,
        status
      })
    } catch (e) {
      reqStatus = false
    }
    return reqStatus
  },
  async payoutRequests(context, data) {
    const payouts = await this.$api.admin.payoutRequests(data)
    context.commit('PAYOUTS', payouts)
    return payouts
  },
  async updatePayoutStatusTo(context, { payout, status }) {
    let res = null
    switch (status) {
      case 'processing':
        res = await this.$api.admin.processPayoutRequest(payout)
        break;
      case 'declined':
        res = await this.$api.admin.declinePayoutRequest(payout)
        break;
      case 'paid':
        res = await this.$api.admin.paidPayoutRequest(payout)
        break;
    }
    if (res) {
      context.commit('UPDATE_PAYOUT', res)
    }
    return res
  },
  async markAsFeatured(context, data) {
    const res = await adminDb.markAsFeatured(data)
    return res
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
