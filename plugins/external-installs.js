
import Vue from 'vue'
import VueTippy from 'vue-tippy'
import simplebar from 'simplebar-vue'
import 'simplebar/dist/simplebar.min.css'

Vue.use(VueTippy)
Vue.component('simplebar', simplebar)
if (process.client) {
  require('vue2-animate/dist/vue2-animate.min.css')
  const VueKonva = require('vue-konva')
  const vClickOutside = require('v-click-outside')

  Vue.use(vClickOutside)
  Vue.use(VueKonva)
}
