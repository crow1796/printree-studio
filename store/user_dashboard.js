const state = () => ({
  userCollections: [],
  userPurchases: [],
  payouts: [],
  totalProfit: 0,
  orders: []
})

const mutations = {
  UPDATE_NAME_OF_COLLECTION(state, { _id, name }) {
    state.userCollections[
      _.findIndex(state.userCollections, { _id })
    ].name = name;
  },
  USER_COLLECTIONS(state, userCollections) {
    state.userCollections = userCollections
  },
  USER_PURCHASES(state, purchases) {
    state.userPurchases = purchases
  },
  TOTAL_PROFIT(state, total) {
    state.totalProfit = total
  },
  PAYOUTS(state, payouts) {
    state.payouts = payouts
  },
  INSERT_PAYOUT(state, payout) {
    state.payouts.unshift(payout)
  },
  REMOVE_PAYOUT(state, payout) {
    const index = _.findIndex(state.payouts, { id: payout.id })
    const tmpPayouts = JSON.parse(JSON.stringify(state.payouts))
    tmpPayouts.splice(index)
    state.payouts = tmpPayouts
  },
  CANCEL_PAYOUT(state, payout) {
    const index = _.findIndex(state.payouts, { _id: payout._id })
    state.payouts[index] = {
      ...payout,
      status: 'cancelled'
    }
  },
  UPDATE_PAYOUT(state, payout) {
    const index = _.findIndex(state.payouts, { _id: payout._id })
    state.payouts[index] = payout
  },
  DECR_TOTAL_PROFIT_BY(state, amount) {
    state.totalProfit -= amount
  },
  INCR_TOTAL_PROFIT_BY(state, amount) {
    state.totalProfit += amount
  },
  ORDERS(state, orders) {
    state.orders = orders
  },
  UPDATE_COLLECTION_STATUS(state, { _id, newStatus }) {
    const index = _.findIndex(state.userCollections, { _id })
    state.userCollections[index].status = newStatus
  }
}

const getters = {
  userCollections(state) {
    return state.userCollections
  },
  userPurchases(state) {
    return state.userPurchases
  },
  totalProfit(state) {
    return state.totalProfit
  },
  payouts(state) {
    return state.payouts
  },
  orders(state) {
    return state.orders
  }
}

const actions = {
  async getUserCollectionsOf(context, userId) {
    const collections = await this.$api.getUserCollectionsOf(userId)
    context.commit('USER_COLLECTIONS', collections)
    return collections
  },
  async collectionStatus(context, collectionId) {
    const collection = await this.$api.userDashboard.collectionStatus(collectionId)
    return collection?.status
  },
  async updateCollectionName(context, { _id, newName }) {
    await this.$api.updateCollectionName({ _id, name: newName });
    context.commit("UPDATE_NAME_OF_COLLECTION", {
      _id,
      name: newName
    })
  },
  removeCollectionById(context, id) {
    const tmpCollection = JSON.parse(
      JSON.stringify(context.getters.userCollections)
    )
    tmpCollection.splice(_.findIndex(tmpCollection, { id }), 1)
    context.commit('USER_COLLECTIONS', tmpCollection)
  },
  async getUserPurchasesOf(context, user) {
    const orders = await db.getUserPurchasesOf(user)
    context.commit('USER_PURCHASES', orders)
  },
  async ordersOfCurrentUser(context, user) {
    const orders = await this.$api.userDashboard.ordersOfCurrentUser()
    context.commit('ORDERS', orders)
    return orders
  },
  async totalEarningsOfCurrentUser(context) {
    const total = await this.$api.userDashboard.totalEarningsOfCurrentUser()
    context.commit('TOTAL_PROFIT', total)
  },
  async payoutsOfCurrentUser(context, query) {
    const payouts = await this.$api.userDashboard.payoutsOfCurrentUser(query)
    context.commit('PAYOUTS', payouts)
  },
  async payoutRequest(context, data) {
    const payout = await this.$api.userDashboard.payoutRequest(data)
    context.commit('DECR_TOTAL_PROFIT_BY', payout.amount)
    context.commit('INSERT_PAYOUT', payout)
    return payout
  },
  async editPayoutRequest(context, data) {
    const payout = await this.$api.userDashboard.editPayoutRequest(data)
    if (payout) {
      context.commit('UPDATE_PAYOUT', payout)
    }
    return payout
  },
  async cancelPayoutRequest(context, id) {
    const payout = await this.$api.userDashboard.cancelPayoutRequest(id)
    if (payout) {
      context.commit('CANCEL_PAYOUT', payout)
      context.commit('INCR_TOTAL_PROFIT_BY', payout.amount)
    }
    return payout
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
