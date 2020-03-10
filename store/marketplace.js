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
    const products = await db.getProductsToSell(query)
    return products
  },
  async getProductFromCollection(context, {collection, product}){
    const prod = await db.getProductFromCollection(collection, product)
    return prod
  },
  async addToCartOf(context, {item, user}){
    await db.addToCartOf(item, user)
  },
  async getCartOf(context, user){
    const cart = await db.getCartOf(user)
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
