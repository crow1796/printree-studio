
import Vue from 'vue'
import VueTippy from 'vue-tippy'
import simplebar from 'simplebar-vue'
import 'simplebar/dist/simplebar.min.css'
import VueLazyload from 'vue-lazyload'
import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

Vue.component('simplebar', simplebar)
Vue.use(VueTippy)
Vue.use(VueVirtualScroller)
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: require('~/assets/images/logo.png'),
  loading: require('~/assets/images/loader.gif'),
  attempt: 1
})
if (process.client) {
  require('vue2-animate/dist/vue2-animate.min.css')
  const drr = require('@minogin/vue-drag-resize-rotate').default
  const VueKonva = require('vue-konva')
  const vClickOutside = require('v-click-outside')
  const vue2Dropzone = require('vue2-dropzone')
  const Popover = require('vue-js-popover').default
  require('vue2-dropzone/dist/vue2Dropzone.min.css')

  Vue.component('vue-dropzone', vue2Dropzone)
  Vue.component('drr', drr)
  Vue.use(Popover)
  Vue.use(vClickOutside)
  Vue.use(VueKonva)
}
