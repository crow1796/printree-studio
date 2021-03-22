const state = () => ({
  shopConfig: {
    _id: null,
    logo: null,
    banner: null,
    slug: null,
    colors: {
      navBG: "#ffffff",
      navTextColor: "rgb(45, 55, 72)",
      navTextHoverColor: "red",
      bannerBGColor: "#ffffff",
      bannerBGSize: "cover",
    }
  }
})

const getters = {
  shopConfig(state) {
    return state.shopConfig
  }
}

const mutations = {
  SHOP_CONFIG(state, config) {
    state.shopConfig = config
  }
}

const actions = {
  async shopConfig(context, slug) {
    const config = await this.$api.marketplace.shopConfig(slug)
    context.commit("SHOP_CONFIG", config)
    return config
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
