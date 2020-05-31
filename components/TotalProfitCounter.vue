<template>
  <div class="flex">
    <div
      class="no-underline md:text-blue-dark flex items-center bg-primary rounded-full h-8 px-4 text-white text-sm leading-none"
    >
      <number
        ref="profit"
        :to="totalProfit"
        :format="(num) => num.formatMoney('₱ ')"
        :duration=".4"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      totalProfit: 'user_dashboard/totalProfit'
    })
  }
}
</script>