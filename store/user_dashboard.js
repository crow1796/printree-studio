import db from '~/plugins/lib/db/index'

const state = () => ({
  userCollections: [],
  userPurchases: [],
  payouts: [],
  totalProfit: 0
})

const mutations = {
  USER_COLLECTIONS(state, userCollections) {
    state.userCollections = userCollections
  },
  USER_PURCHASES(state, purchases){
    state.userPurchases = purchases
  },
  TOTAL_PROFIT(state, total){
    state.totalProfit = total
  },
  PAYOUTS(state, payouts){
    state.payouts = payouts
  },
  INSERT_PAYOUT(state, payout){
    state.payouts.unshift(payout)
  },
  REMOVE_PAYOUT(state, payout){
    const index = _.findIndex(state.payouts, { id: payout.id })
    const tmpPayouts = JSON.parse(JSON.stringify(state.payouts))
    tmpPayouts.splice(index)
    state.payouts = tmpPayouts
  },
  CANCEL_PAYOUT(state, payout){
    const index = _.findIndex(state.payouts, { id: payout.id })
    state.payouts[index] = {
      ...payout,
      status: 'cancelled'
    }
  },
  UPDATE_PAYOUT(state, payout){
    const index = _.findIndex(state.payouts, { id: payout.id })
    state.payouts[index] = payout
  },
  DECR_TOTAL_PROFIT_BY(state, amount){
    state.totalProfit -= amount
  },
  INCR_TOTAL_PROFIT_BY(state, amount){
    state.totalProfit += amount
  }
}

const getters = {
  userCollections(state) {
    return state.userCollections
  },
  userPurchases(state){
    return state.userPurchases
  },
  totalProfit(state){
    return state.totalProfit
  },
  payouts(state){
    return state.payouts
  }
}

const actions = {
  async getUserCollectionsOf(context, userId) {
    const collections = await db.getUserCollectionsOf(userId)
    context.commit('USER_COLLECTIONS', collections)
    return collections
  },
  removeCollectionById(context, id) {
    const tmpCollection = JSON.parse(
      JSON.stringify(context.getters.userCollections)
    )
    tmpCollection.splice(_.findIndex(tmpCollection, { id }), 1)
    context.commit('USER_COLLECTIONS', tmpCollection)
  },
  async getUserPurchasesOf(context, user){
    const orders = await db.getUserPurchasesOf(user)
    context.commit('USER_PURCHASES', orders)
  },
  async getOrdersForSeller(context, user){
    const orders = await db.getOrdersForSeller(user)
    return orders
  },
  async getTotalProfitOf(context, user){
    const total = await db.getTotalProfitOf(user)
    context.commit('TOTAL_PROFIT', total)
  },
  async getPayoutsOf(context, user){
    const res = await db.getPayoutsOf(user)
    if(res.status){
      context.commit('PAYOUTS', res.data)
      return
    }
  },
  async sendPayoutRequest(context, data){
    const res = await db.sendPayoutRequest(data)
    const totalProfit = context.getters.totalProfit
    if(res.status){
      if(res.data.updated_at){
        const index = _.findIndex(context.getters.payouts, { id: res.data.id })
        context.commit('TOTAL_PROFIT', ((totalProfit + context.getters.payouts[index].amount) - res.data.amount))
        context.commit('UPDATE_PAYOUT', res.data)
        return res
      }
      context.commit('DECR_TOTAL_PROFIT_BY', res.data.amount)
      context.commit('INSERT_PAYOUT', res.data)
    }
    return res
  },
  async cancelPayout(context, {user, payout}){
    const res = await db.cancelPayout({user, payout})
    if(res.status){
      context.commit('CANCEL_PAYOUT', payout)
      context.commit('INCR_TOTAL_PROFIT_BY', payout.amount)
    }
    return res
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
