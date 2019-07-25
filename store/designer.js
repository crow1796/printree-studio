const state = () => ({
  isPreviewShown: false
})

const getters = {
  isPreviewShown(state){
    return state.isPreviewShown
  }
}

const mutations = {
  IS_PREVIEW_SHOWN(state, isPreviewShown){
    state.isPreviewShown = isPreviewShown
    localStorage.setItem('printree:isPreviewShown', isPreviewShown)
  }
}

const actions = {

}

export default {
  state,
  mutations,
  actions,
  getters
}
