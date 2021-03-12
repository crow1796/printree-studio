import find from 'lodash/find'

const state = () => ({
  cart: []
})

const mutations = {
  CART(state, cart) {
    state.cart = cart
  }
}

const getters = {
  cart(state) {
    return state.cart
  }
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
  async getMarketplaceOrder(context, id) {
    const order = await this.$api.marketplace.getMarketplaceOrder(id)
    return order
  },
  async getProductFromCollection(context, { collection, product }) {
    const prod = await db.getProductFromCollection(collection, product)
    return prod
  },
  async addToCart(context, item) {
    const res = await this.$api.marketplace.addToCart(item)
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
