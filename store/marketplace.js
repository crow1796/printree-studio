import { _ } from 'core-js'
import find from 'lodash/find'

const state = () => ({
  cart: [],
  counts: {
    toPay: 0,
    toShip: 0,
    toReceive: 0,
    delivered: 0,
    cart: 0
  }
})

const mutations = {
  CART(state, cart) {
    state.cart = cart
  },
  COUNTS(state, counts) {
    _.map(counts, (count, k) => {
      state.counts[k] = count
    })
  },
  ADD_CART_ITEM_COUNT(state, quantity) {
    state.counts.cart += quantity
  },
  CART_ITEM_COUNT(state, count) {
    state.counts.cart = count
  },
}

const getters = {
  cart(state) {
    return state.cart
  },
  counts(state) {
    return state.counts
  },
}

const actions = {
  async getProductsToSell(context, query) {
    const products = await this.$api.marketplace.getProductsToSell(query)
    return products
  },
  async checkout(context, items) {
    const checkout = await this.$api.marketplace.checkout(items)
    return checkout
  },
  async getCheckout(context, id) {
    const checkout = await this.$api.marketplace.getCheckout(id)
    return checkout
  },
  async getCheckoutsOfCurrentUser(context, query) {
    const checkout = await this.$api.marketplace.getCheckoutsOfCurrentUser(query)
    return checkout
  },
  async getMarketplaceOrder(context, query) {
    const order = await this.$api.marketplace.getMarketplaceOrder(query)
    return order
  },
  async marketplaceOrders(context, query) {
    const checkout = await this.$api.marketplace.marketplaceOrders(query)
    return checkout
  },
  async getProductFromCollection(context, { collection, product }) {
    const prod = await db.getProductFromCollection(collection, product)
    return prod
  },
  async addToCart(context, item) {
    const res = await this.$api.marketplace.addToCart(item)
    await context.dispatch('getMPCounts')
    return res
  },
  async removeItemFromCart(context, item) {
    const res = await this.$api.marketplace.removeItemFromCart(item)
    return res
  },
  async getCartOfCurrentUser(context) {
    const cart = await this.$api.marketplace.getCartOfCurrentUser()
    return cart
  },

  async getCollectionMeta(context, id) {
    const meta = await this.$api.marketplace.getCollectionMeta(id)
    return meta
  },

  async getPHAddresses(context, { province, city, barangay }) {
    const provinceCode = province
    const cityCode = city
    let cities = []
    let provinces = this.$locations.provinces
    let barangays = []

    if (provinceCode) {
      cities = this.$locations.cities.filter(({ provCode }) => provCode === provinceCode)
    }

    if (cityCode) {
      barangays = this.$locations.barangays.filter(({ citymunCode }) => citymunCode === cityCode)
    }
    return { provinces, cities, barangays }
  },
  async getAddressInfo(context, { province, city, barangay }) {
    if (province) {
      province = find(provinces, { provCode: province })
    }

    if (city) {
      city = find(cities, { citymunCode: city })
    }

    if (barangay) {
      barangay = find(barangays, { brgyCode: barangay })
    }

    return { province, city, barangay }
  },
  async saveAddress(context, data) {
    const address = await this.$api.marketplace.saveAddress(data)
    return address
  },
  async getMPCounts(context, data = ["cart"]) {
    const counts = await this.$api.marketplace.getMPCounts(data)
    context.commit("COUNTS", counts)
    return counts
  },
  async saveShippingProfile(context, data) {
    const profile = await this.$api.marketplace.saveShippingProfile(data)
    return profile
  },
  async paymentMethods(_) {
    const paymentMethods = await this.$api.marketplace.paymentMethods()
    return paymentMethods
  },
  async calculateShippingFee(_, data) {
    const shippingRates = await this.$api.marketplace.calculateShippingFee(data)
    return shippingRates
  },
  async getAddressesOfCurrentUser(context, userId) {
    const addresses = await this.$api.marketplace.getAddressesOfCurrentUser()
    return addresses
  },
  async placeOrder(_, data) {
    const order = await this.$api.marketplace.placeOrder(data)
    return order
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
