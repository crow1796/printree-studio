import db from '~/plugins/lib/db/index'

const state = () => ({
  userCollections: [],
  userPurchases: []
})

const mutations = {
  USER_COLLECTIONS(state, userCollections) {
    state.userCollections = userCollections
  },
  USER_PURCHASES(state, purchases){
    state.userPurchases = purchases
  }
}

const getters = {
  userCollections(state) {
    return state.userCollections
  },
  userPurchases(state){
    return state.userPurchases
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
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
