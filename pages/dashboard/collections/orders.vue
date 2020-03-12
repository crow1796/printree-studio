<template>
  <div class="relative">
    <AreaLoader v-if="isLoading" />
    <div class="my-2 flex justify-between items-center">
      <div>
        <nuxt-link to="/dashboard/collections" class="text-xs text-blue-500 hover:text-blue-700">
          <font-awesome-icon :icon="['fas', 'arrow-left']" />
          <span class="ml-1">Back</span>
        </nuxt-link>
        <h2 class="text-2xl font-semibold leading-tight">Orders</h2>
      </div>
      <TotalProfitCounter v-model="totalProfit" />
    </div>
    <div class="border flex flex-col mb-6" v-for="(order, i) in orders" :key="i">
      <div class="flex border-b p-4 justify-between items-center">
        <div class="flex flex-col">
          <div class="font-bold uppercase">ORDER: {{ order.id }}</div>
          <div
            class="text-sm text-gray-500"
          >{{ order.placed_at ? `Placed at ${formatTimestamp(order.placed_at)}` : `Checked out at ${formatTimestamp(order.created_at)}` }}</div>
        </div>
        <div class="font-bold flex-flex-col">
          <div class="text-xs leading-none">Status:</div>
          <div
            class="uppercase"
            :class="{'text-green-600': order.status === 'delivered', 'text-primary': order.status !== 'delivered'}"
          >
            {{ orderStatus(order.status) }}
            <font-awesome-icon v-if="order.status === 'delivered'" :icon="['fas', 'check-circle']" />
          </div>
        </div>
      </div>
      <div class="px-4">
        <div
          class="flex flex-grow-0 px-4 py-2"
          v-for="(product, i) in order.products"
          :class="{ 'border-b': i < (order.products.length - 1) }"
          :key="i"
        >
          <div class="w-2/12 flex">
            <div class="w-24">
              <progressive-img class="relative mx-auto" :src="product.thumbnail" />
            </div>
          </div>
          <div class="flex flex-col w-3/12 justify-center">
            <span class="font-bold leading-none">
              {{
              product.meta.name
              }}
            </span>
            <span class="font-bold w-1/12 text-gray-500">
              {{
              product.size
              }}
            </span>
          </div>
          <div class="flex w-1/12 justify-end items-center">
            <div class="flex flex-col">
              <div>{{ product.price.formatMoney('₱ ') }}</div>
            </div>
          </div>
          <div class="flex w-1/12 justify-end items-center">
            <div class="flex flex-col">
              <font-awesome-icon :icon="['fas', 'times']" />
            </div>
          </div>
          <div class="flex w-2/12 justify-end items-center">
            <div class="flex flex-col">
              <div>Qty. {{ product.quantity }}</div>
            </div>
          </div>
          <div class="flex w-3/12 justify-end items-center">
            <div class="flex flex-col items-end">
              <div>{{ (product.price * product.quantity).formatMoney('₱ ') }}</div>
              <div
                class="text-xs font-bold text-primary"
              >My Profit: {{ (product.profit * product.quantity).formatMoney('₱ ') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import TotalProfitCounter from '@/components/TotalProfitCounter'
import { mapGetters } from 'vuex'

export default {
  layout: 'user_dashboard',
  components: {
    TotalProfitCounter
  },
  async mounted() {
    this.orders = await this.$store.dispatch(
      'user_dashboard/getOrdersForSeller',
      this.user
    )
    console.log(this.orders)
    this.totalProfit = _.sum(_.map(this.orders, 'total_profit'))
    this.isLoading = false
  },
  data() {
    return {
      totalProfit: 0,
      isLoading: true,
      orders: []
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/user'
    })
  },
  methods: {
    formatTimestamp(timestamp) {
      return moment(timestamp.toDate()).format('MMMM Do YYYY, h:mm:ss a')
    },
    orderStatus(status) {
      switch (status) {
        case 'pending':
          status = 'Order Received'
          break
        case 'shipping':
          status = 'Handed over to our Delivery Partner'
          break
      }
      return status
    }
  }
}
</script>