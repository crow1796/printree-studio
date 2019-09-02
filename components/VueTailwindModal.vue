<template>
    <div class="fixed inset-0 z-50 overflow-hidden bg-smoke-light flex"
        v-if="isShown"
        @click="() => backdrop ? hide() : makeBounce()">
        <transition name="slide"
            enter-active-class="slideInDown"
            leave-active-class="slideOutUp">
            <div class="relative bg-white m-auto flex-col flex rounded shadow overflow-hidden"
              @click.stop v-if="isContentShown"
                :class="[{ '-bounce': bounce },contentClass]"
                :style="{ 'width': width }">
                <slot/>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
  props: {
    contentClass: {
      default: 'p-4'
    },
    width: {
      default: '50%'
    },
    backdrop: {
      type: Boolean,
      default: true
    }
  },
  data(){
    return {
      isShown: false,
      isContentShown: false,
      bounce: false,
      bounceTimeout: null
    }
  },
  methods: {
    makeBounce(){
      clearTimeout(this.bounceTimeout)
      this.bounce = true
      this.bounceTimeout = setTimeout(() => {
        this.bounce = false
      }, 300)
    },
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
      }, 300)
    }
  }
}
</script>

<style lang="scss" scoped>
.-bounce{
  animation: bounce .3s ease;
}

@keyframes bounce {
  0% { transform: scale(1) rotateZ(0deg); }
  50% { transform: scale(1.01) rotateZ(.5deg); }
  60% { transform: scale(0.99) rotateZ(-.5deg); }
  80% { transform: scale(1.01) rotateZ(.5deg); }
  100% { transform: scale(0.99) rotateZ(-.5deg); }
}
</style>
