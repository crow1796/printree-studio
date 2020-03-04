import db from '~/plugins/lib/db/index'

const state = () => ({
  cart: []
})

const mutations = {
  CART(state, cart){
    state.cart = cart
  }
}

const getters = {
  cart(state){
    return state.cart
  }
}

const actions = {
  async getProductsToSell(context, query){
    const res = await this.$axios.get('/products', query)
    return res.data.products
  },
  async getProductFromCollection(context, {collection, product}){
    const res = await this.$axios.get(`/collections/${collection}/products/${product}`)
    return res.data.product
  },
  async addToCartOf(context, {item, user}){
    await db.addToCartOf(item, user)
  },
  async getCartOf(context, user){
    const cart = await db.getCartOf(user)
    return cart
  },
  async getAddresses(context, query){
    const res = await this.$axios.get(`/addresses`)
    return res.data
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
