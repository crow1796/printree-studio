<template>
  <div class="flex">
    <div
      class="no-underline md:text-blue-dark flex items-center bg-primary rounded-full h-8 px-4 text-white text-sm leading-none"
    >
      <number
        animationPaused
        ref="profit"
        :to="value"
        :format="(num) => num.formatMoney('₱ ')"
        :duration=".4"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      default: 0
    }
  },
  watch: {
    value(to){
      this.$nextTick(() => {
        this.$refs.profit.play()
      })
    }
  }
}
</script>