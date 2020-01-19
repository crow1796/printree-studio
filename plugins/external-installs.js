import Vue from 'vue'
import VueTippy from 'vue-tippy'
import simplebar from 'simplebar-vue'
import 'simplebar/dist/simplebar.min.css'
import VueLazyload from 'vue-lazyload'
import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import AreaLoader from '@/components/AreaLoader'
import PTForm from '@/components/PTForm'
import VeeValidate from 'vee-validate'
import VueCurrencyInput from 'vue-currency-input'

Vue.use(VeeValidate)
Vue.component('simplebar', simplebar)
Vue.component('AreaLoader', AreaLoader)
Vue.use(VueTippy)
Vue.use(PTForm)
Vue.use(VueVirtualScroller)
const pluginOptions = {
  globalOptions: { currency: 'PHP' }
}
Vue.use(VueCurrencyInput, pluginOptions)
Vue.use(VueLazyload, {
  preLoad: 1,
  error: require('~/assets/images/logo.png'),
  loading: require('~/assets/images/loader.gif'),
  attempt: 1
})
if (process.client) {
  require('vue2-animate/dist/vue2-animate.min.css')
  const drr = require('@/components/Designer/drr').default
  const VueKonva = require('vue-konva')
  const vClickOutside = require('v-click-outside')
  const vue2Dropzone = require('vue2-dropzone')
  const VTooltip = require('v-tooltip').default
  require('vue2-dropzone/dist/vue2Dropzone.min.css')
  const ToggleButton = require('vue-js-toggle-button').default
  const VueNumber = require('vue-number-animation').default

  Vue.component('vue-dropzone', vue2Dropzone)
  Vue.component('drr', drr)
  Vue.use(VueNumber)
  Vue.use(ToggleButton)
  Vue.use(VTooltip)
  Vue.use(vClickOutside)
  Vue.use(VueKonva)
}
