import db from '~/plugins/lib/db/index'

const state = () => ({
})

const mutations = {
}

const getters = {
}

const actions = {
  async getProductsToSell(context, query){
    const res = await this.$axios.get('/products', query)
    return res.data.products
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
