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
  async approveAccount(context, _id) {
    const user = await this.$api.admin.approveAccount(_id)
    return user
  },
  async getUserById(context, _id) {
    const user = await this.$api.admin.getUserById({ _id })
    return user
  },
  async generateVariantImages(context, data) {
    const generatedVariantImages = await this.$api.admin.generateVariantImages(data)
    return generatedVariantImages
  },
  async getUsers(context, query) {
    const users = await this.$api.admin.getUsers(query)
    context.commit('USERS', users)
  },
  async getCollectionsAndCommit(context, searchQuery) {
    const collections = await this.$api.admin.getCollections(searchQuery)
    context.commit('COLLECTIONS', collections)
  },
  async getCollections(context, searchQuery) {
    const collections = await this.$api.admin.getCollections(searchQuery)
    return collections
  },
  async shippingProfiles(context) {
    const profiles = await this.$api.admin.shippingProfiles()
    return profiles
  },
  async saveShippingProfile(context, data) {
    const profile = await this.$api.admin.saveShippingProfile(data)
    return profile
  },
  async updateUser(context, data) {
    const res = await this.$axios.patch(`/users/${data.uid}`, data)
    context.commit('UPDATE_USER', res.data.user)
  },
  async deleteUser(context, { _id }) {
    const res = await this.$api.admin.deleteUserById(_id);
    return res
  },
  removeUserById(context, _id) {
    const tmpUsers = JSON.parse(
      JSON.stringify(context.getters.users)
    )
    tmpUsers.splice(_.findIndex(tmpUsers, { _id }), 1)
    context.commit('USERS', tmpUsers)
  },
  async updateCollectionStatus(context, { _id, status, notes, products }) {
    await this.$api.admin.updateCollectionStatus({ _id, status, notes, products })
  },
  async totalEarningsOfUser(context, id) {
    const total = await this.$api.admin.totalEarningsOfUser(id)
    return total
  },
  async allMarketplaceOrders(context, query) {
    const res = await this.$api.admin.allMarketplaceOrders(query)
    return res
  },
  async updateOrder(context, data) {
    const res = await this.$api.admin.updateOrder(data)
    return res
  },
  async updateCustomizableProduct(context, data) {
    const res = await this.$api.admin.updateCustomizableProduct(data)
    return res
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
  async payoutRequests(context, query) {
    const payouts = await this.$api.admin.payoutRequests(query)
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

  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
