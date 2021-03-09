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
  async getFeaturedProducts(context, query){
    const products = await db.getFeaturedProducts(query)
    return products
  },
  async getProductsToSell(context, query){
    const products = await this.$api.marketplace.getProductsToSell(query)
    return products
  },
  async getProductFromCollection(context, {collection, product}){
    const prod = await db.getProductFromCollection(collection, product)
    return prod
  },
  async addToCart(context, item){
    const res = await this.$api.marketplace.addToCart(item)
    return res
  },
  async removeItemFromCart(context, item){
    const res = await this.$api.marketplace.removeItemFromCart(item)
    return res
  },
  async getCartOfCurrentUser(context){
    const cart = await this.$api.marketplace.getCartOfCurrentUser()
    return cart
  },
  async getPHAddresses(context, {province, city, barangay}){
    const provinceCode = province
    const cityCode = city
    let provinces = []
    let cities = []
    let barangays = []
    let rawProvinces = require('~/resources/data/refprovince.json')
    provinces = rawProvinces.RECORDS
    if (provinceCode) {
      let rawCities = require('~/resources/data/refcitymun.json')
      cities = rawCities.RECORDS

      cities = cities.filter(({ provCode }) => provCode === provinceCode)
    }
    if (cityCode) {
      let rawBarangays = require('~/resources/data/refbrgy.json')
      barangays = rawBarangays.RECORDS

      barangays = barangays.filter(({ citymunCode }) => citymunCode === cityCode)
    }
    return { provinces, cities, barangays }
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
  async placeOrder(context, { orderId, paymentMethod}){
    await db.placeOrder(orderId, paymentMethod)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
