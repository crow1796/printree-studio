<template>
  <div class="relative">
    <div class="select-none" @click.stop="isOpen = !isOpen">
      <slot name="trigger" />
    </div>
    <div
      class="absolute z-10 bg-white shadow-xl rounded border right-0 mt-3"
      :style="{width}"
      v-show="isOpen"
      v-click-outside="hide"
    >
      <slot name="content" />
    </div>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'

export default {
  props: {
    width: {
      default: '100%'
    }
  },
  directives: {
    ClickOutside
  },
  data() {
    return {
      isOpen: false
    }
  },
  methods: {
    hide() {
      if (!this.isOpen) return
      this.isOpen = false
    }
  }
}
</script>