<template>
  <div class="relative">
    <AreaLoader v-if="isLoading" fullscreen />
    <div class="my-2 flex sm:flex-row justify-between items-center"><h2 class="text-2xl font-semibold leading-tight">My Orders</h2></div>
    <div class="border flex flex-col mb-6" v-for="(order, i) in userPurchases" :key="i">
      <div class="flex border-b p-4 justify-between items-center">
        <div class="flex flex-col">
          <div class="uppercase font-bold">ORDER: {{ order.id }}</div>
          <div
            class="text-sm text-gray-500"
          >{{ order.placed_at ? `Placed at ${formatTimestamp(order.placed_at)}` : `Checked out at ${formatTimestamp(order.created_at)}` }}</div>
        </div>
        <div class="uppercase font-bold">
          {{ orderStatus(order.status) }}
        </div>
      </div>
      <div class="p-4">
        <div
          class="flex flex-grow-0 px-4 py-2"
          v-for="(product, i) in order.products"
          :class="{ 'border-b': i < (order.products.length - 1) }"
          :key="i"
        >
          <div class="w-2/12 flex">
            <div class="w-16">
              <progressive-img class="relative mx-auto" :src="product.thumbnail" />
            </div>
          </div>
          <div class="flex flex-col w-4/12 justify-center">
            <span class="font-bold leading-none">
              {{
              product.meta.name
              }}
            </span>
            <span class="font-bold text-gray-500">
              {{
              product.size
              }}
            </span>
          </div>
          <div class="flex flex-grow justify-end items-center">
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
import moment from 'moment'

export default {
  layout: 'user_dashboard',
  async mounted() {
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
  },
  methods: {
    formatTimestamp(timestamp){
      return moment(timestamp.toDate()).format('MMMM Do YYYY, h:mm:ss a')
    },
    orderStatus(status){
      switch(status){
        case 'pending':
          status = 'Order Received'
          break
      }
      return status
    }
  }
}
</script>