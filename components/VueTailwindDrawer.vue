<template>
  <div class="absolute h-full z-20"
    v-if="isShown"
    @click="() => backdrop ? hide() : false"
    :class="{
      'bg-smoke-lighter': backdrop,
      'right-0': position == 'right',
      'left-0': position == 'left'
    }"
    :style="{
      width: backdrop ? '100%' : width
    }">
    <transition name="slide"
      :enter-active-class="position == 'right' ? 'slideInRight' : 'slideInLeft'"
      :leave-active-class="position == 'right' ? 'slideOutRight' : 'slideOutLeft'">
      <div class="flex h-full flex-col z-10 bg-white absolute"
        :class="{
          'border-l right-0': position == 'right',
          'border-r left-0': position == 'left'
        }"
        :style="{
          width: backdrop ? width : '100%'
        }"
        v-show="isContentShown"
        style="animation-duration: 0.1s"
        @click.stop>
        <slot/>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    position: {
      default: 'left'
    },
    width: {
      default: '25%'
    },
    backdrop: {
      type: Boolean,
      default: true
    }
  },
  data(){
    return {
      isShown: false,
      isContentShown: false
    }
  },
  methods: {
    show(){
      this.isShown = true
      setTimeout(() => {
        this.isContentShown = true
      }, 300)
    },
    hide(){
      this.isContentShown = false
      setTimeout(() => {
        this.isShown = false
        this.$emit('hidden')
      }, 300)
    }
  }
}
</script>
