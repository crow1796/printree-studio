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
  },
  async getProductFromCollection(context, {collection, product}){
    const res = await this.$axios.get(`/collections/${collection}/products/${product}`)
    return res.data.product
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
