<template>
  <div
    class="inset-0 z-70 overflow-auto bg-smoke-light flex vue-tailwind-modal"
    :class="position"
    v-if="isShown"
    @click="() => backdrop ? hide() : makeBounce()"
  >
    <transition name="slide" enter-active-class="slideInDown" leave-active-class="slideOutUp">
      <div
        class="relative bg-white m-auto flex-col flex rounded shadow overflow-auto sm:overflow-hidden -content"
        @click.stop
        v-if="isContentShown"
        :class="[{ '-bounce': bounce },contentClass]"
        :style="{ 'width': width }"
      >
        <slot />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    position: {
      default: 'fixed'
    },
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
  data() {
    return {
      isShown: false,
      isContentShown: false,
      bounce: false,
      bounceTimeout: null
    }
  },
  methods: {
    makeBounce() {
      clearTimeout(this.bounceTimeout)
      this.bounce = true
      this.bounceTimeout = setTimeout(() => {
        this.bounce = false
      }, 300)
    },
    show() {
      document.body.style.overflow = 'hidden'
      this.isShown = true
      setTimeout(() => {
        this.isContentShown = true
      }, 300)
    },
    hide() {
      document.body.style.overflow = 'auto'
      this.isContentShown = false
      setTimeout(() => {
        this.isShown = false
      }, 300)
    }
  }
}
</script>

<style lang="scss" scoped>
.-bounce {
  animation: bounce 0.3s ease;
}

@keyframes bounce {
  0% {
    transform: scale(1) rotateZ(0deg);
  }
  50% {
    transform: scale(1.01) rotateZ(0.5deg);
  }
  60% {
    transform: scale(0.99) rotateZ(-0.5deg);
  }
  80% {
    transform: scale(1.01) rotateZ(0.5deg);
  }
  100% {
    transform: scale(0.99) rotateZ(-0.5deg);
  }
}
</style>
