<template>
  <div
    class="bg-red-200 border-t-4 border-primary rounded-b text-teal-900 px-4 py-3 fixed"
    :class="[placement]"
    v-if="isShown"
  >
    <div class="flex">
      <div class="py-1">
        <font-awesome-icon
          :icon="['fas', 'info-circle']"
          class="fill-current h-6 w-6 text-primary text-lg mr-4"
        />
      </div>
      <div>
        <slot/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    minWidth: {
      default: 400
    },
    placement: {
      default: 'top-right'
    },
    delay: {
      default: 3000
    }
  },
  data(){
    return {
      isShown: false
    }
  },
  methods: {
    hide(){
      this.isShown = false
    },
    show(){
      this.isShown = true
      setTimeout(() => {
        this.hide()
      }, this.delay)
    }
  }
}
</script>

<style lang="scss" scoped>
  .top{
    &-left{
      top: 5%;
      left: 3%;
    }

    &-center{
      top: 5%;
      left: 50%;
      transform: translateX(-50%);
    }

    
    &-right{
      top: 5%;
      right: 3%;
    }
  }
</style>