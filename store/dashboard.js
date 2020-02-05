import db from '~/plugins/lib/db/index'

const state = () => ({
  userCollections: []
})

const getters = {
  userCollections(state){
    return state.userCollections
  }
}

const mutations = {
  USER_COLLECTIONS(state, userCollections){
    state.userCollections = userCollections
  }
}

const actions = {
  async getUserCollectionsOf(context, userId){
    const collections = await db.getUserCollectionsOf(userId)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
