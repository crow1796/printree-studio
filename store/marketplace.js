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
  async getPHAddresses(context, params){
    const res = await this.$axios.get(`/addresses`, {params})
    return res.data
  },
  async saveAddress(context, data){
    const address = await db.saveAddress(data)
    return address
  },
  async getAddressesOf(context, userId){
    const addresses = await db.getAddressesOf(userId)
    return addresses
  },
  async confirmOrderFor(context, payload){
    const order = await db.confirmOrderFor(payload)
    return order
  },
  async placeOrder(context, orderId){
    await db.placeOrder(orderId)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
