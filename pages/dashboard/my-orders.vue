<template>
  <div class="relative">
    <AreaLoader v-if="isLoading" fullscreen />
    <div class="border flex flex-col" v-for="(order, i) in userPurchases" :key="i">
      <div class="border-b p-4">
        <div class="flex flex-col">
          <div class="uppercase font-bold">ORDER #</div>
          <div class="text-sm text-gray-500">Placed Mar 08, 2019 11:19PM</div>
        </div>
      </div>
      <div class="p-4">
        <div class="flex flex-grow-0 border-b px-4 py-2" v-for="(product, i) in order.products" :key="i">
          <div class="w-2/12 flex-justify-between">
            <div class="w-16 mx-auto">
              <progressive-img class="relative mx-auto" :src="product.thumbnail" />
            </div>
          </div>
          <div class="flex flex-col w-4/12 justify-center">
            <span class="font-bold leading-none">
              {{
              product.name
              }}
            </span>
          </div>
          <div class="flex w-2/12 justify-center items-center">
            <div class="flex flex-col">
              <div>Qty. {{ product.quantity }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  layout: 'user_dashboard',
  async created() {
    await this.$store.dispatch('user_dashboard/getUserPurchasesOf', this.user)
    this.isLoading = false
  },
  data() {
    return {
      isLoading: true
    }
  },
  computed: {
    ...mapGetters({
      userPurchases: 'user_dashboard/userPurchases',
      user: 'user/user'
    })
  }
}
</script>