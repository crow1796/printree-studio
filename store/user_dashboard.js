import db from '~/plugins/lib/db/index'

const state = () => ({
  userCollections: []
})

const mutations = {
  USER_COLLECTIONS(state, userCollections) {
    state.userCollections = userCollections
  }
}

const getters = {
  userCollections(state) {
    return state.userCollections
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
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
