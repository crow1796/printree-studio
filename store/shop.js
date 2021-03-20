const state = () => ({
  shopConfig: {
    navBG: "#ffffff",
    navTextColor: "rgb(45, 55, 72)",
    navTextHoverColor: "red",
    bannerBGColor: "#ffffff",
    bannerBGSize: "cover",
  }
})

const getters = {
  shopConfig(state){
    return state.shopConfig
  }
}

const mutations = {

}

const actions = {
  async loadConfig(context){
    const res = await this.$api.marketplace.loadConfig()
    return res
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
