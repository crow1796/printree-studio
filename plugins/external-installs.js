
import Vue from 'vue'
import VueTippy from 'vue-tippy'

Vue.use(VueTippy)
if (process.client) {
  require('vue2-animate/dist/vue2-animate.min.css')
  const VueKonva = require('vue-konva')
  const vClickOutside = require('v-click-outside')

  Vue.use(vClickOutside)
  Vue.use(VueKonva)
}
