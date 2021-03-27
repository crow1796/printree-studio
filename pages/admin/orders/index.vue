<template>
  <div class="relative sm:px-8">
    <AreaLoader v-if="isLoading"/>
    <div class="my-2 flex sm:flex-row justify-between items-center">
      <h2 class="text-2xl font-semibold leading-tight">Orders</h2>
    </div>
    <div class="border flex flex-col mb-6 hover:border-primary cursor-pointer rounded" v-for="(order, i) in orders" :key="i" @click="goTo(order)">
      <div class="flex border-b p-4 justify-between items-center">
        <div class="flex flex-col">
          <div class="uppercase font-bold">ORDER: {{ order.orderNumber }}</div>
          <div
            class="text-sm text-gray-500"
          >{{ `Placed at ${_formatDate(order.created_at)}` }}</div>
        </div>
        <div class="font-bold">
          <div class="flex items-end">
            <div class="font-bold flex-flex-col">
              <div class="text-xs leading-none">Fulfillment Status:</div>
              <div
                class="uppercase text-green-600"
              >
                {{ order.fulfillmentStatus}}
              </div>
            </div>
            <div class="font-bold flex-flex-col ml-4">
              <div class="text-xs leading-none">Payment Status:</div>
              <div class="uppercase text-green-600">{{ order.financialStatus}}</div>
            </div>
            <div class="font-bold flex-flex-col ml-4">
              <div class="text-xs leading-none">Total:</div>
              <div
                class="uppercas"
              >
                {{ (_totalOf(order)).formatMoney('₱ ')}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import VuePureLightbox from 'vue-pure-lightbox'
import 'vue-pure-lightbox/dist/VuePureLightbox.css'

export default {
  layout: 'admin_dashboard',
  components: {
    VuePureLightbox
  },
  async mounted() {
    this.orders = await this.$store.dispatch('admin/allMarketplaceOrders')
    this.isLoading = false
  },
  data() {
    return {
      orders: [],
      isLoading: true,
      query: {
        sorting: {
          field: "created_at",
          order: "DESC",
        },
        pagination: {
          limit: 15,
          page: 1,
        },
      },
    }
  },
  methods: {
    goTo(order){
      this.$router.push(`/admin/orders/${order._id}`)
    },
    _totalOf(order){
      return _.sum(_.map(order.checkout.items, (item) => item.price * item.quantity)) + order.shippingFee
    },
    _formatDate(date){
      return moment(date).format("MMMM DD, YYYY hh:m A")
    },
    _frontOrFirstThumbnail(thumbnails) {
      let sides = _.keys(thumbnails)
      const side = _.includes(sides, 'front') ? 'front' : _.head(sides)

      return thumbnails[side]
    },
    _lightBoxMediaFor(thumbnails) {
      return _.reverse(_.map(thumbnails, thumbnail => thumbnail))
    },
    _processButtonTextOf(order) {
      let text = 'Process'
      switch (order.status) {
        case 'processing':
          text = 'Start Shipping'
          break
        case 'shipping':
          text = 'Delivered'
          break
      }
      return text
    },
    _processStatusOf(order) {
      let status = 'processing'
      switch (order.status) {
        case 'processing':
          status = 'shipping'
          break
        case 'shipping':
          status = 'delivered'
          break
      }
      this.processOrder(order, status)
    }
  }
}
</script>