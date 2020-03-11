<template>
  <div class="relative sm:px-8 py-8">
    <AreaLoader v-if="isLoading" fullscreen />
    <div class="my-2 flex sm:flex-row justify-between items-center">
      <h2 class="text-2xl font-semibold leading-tight">Orders</h2>
      <h2 class="text-2xl font-semibold leading-tight">Total: {{ total.formatMoney('₱ ') }}</h2>
    </div>
    <div class="border flex flex-col mb-6" v-for="(order, i) in orders" :key="i">
      <div class="flex border-b p-4 justify-between items-center">
        <div class="flex flex-col">
          <div class="uppercase font-bold">ORDER: {{ order.id }}</div>
          <div
            class="text-sm text-gray-500"
          >{{ order.placed_at ? `Placed at ${(order.placed_at)}` : `Checked out at ${(order.created_at)}` }}</div>
        </div>
        <div class="font-bold">
          <div class="flex items-end">
            <div class="font-bold flex-flex-col">
              <div class="text-xs leading-none">Status:</div>
              <div
                class="uppercase"
                :class="{'text-green-600': order.status === 'delivered', 'text-primary': order.status !== 'delivered'}"
              >
                {{ orderStatus(order.status) }}
                <font-awesome-icon
                  v-if="order.status === 'delivered'"
                  :icon="['fas', 'check-circle']"
                />
              </div>
            </div>
            <button
              class="px-2 py-1 text-xs bg-primary hover:bg-primary-lighter text-white border rounded mx-1 cursor-pointer font-bold uppercase ml-2"
              type="button"
              @click="_processStatusOf(order)"
              v-if="order.status !== 'delivered'"
            >{{ _processButtonTextOf(order) }}</button>
          </div>
        </div>
      </div>
      <div>
        <div
          class="flex flex-grow-0 px-4 py-2"
          v-for="(product, i) in order.products"
          :class="{ 'border-b': i < (order.products.length - 1) }"
          :key="i"
        >
          <div class="w-2/12 flex">
            <div class="w-16">
              <VuePureLightbox
                :thumbnail="_frontOrFirstThumbnail(product.thumbnails)"
                :images="_lightBoxMediaFor(product.thumbnails)"
              />
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
          <div class="flex w-2/12 justify-end items-center">
            <div class="flex flex-col">
              <div>Qty. {{ product.quantity }}</div>
            </div>
          </div>
          <div class="flex-grow flex justify-end items-center">
            <div>
              <VueTailwindDropdown>
                <template v-slot:trigger>
                  <div
                    class="px-2 py-1 text-xs bg-white hover:bg-gray-200 border rounded mx-1 cursor-pointer font-bold"
                  >
                    <span class="mr-2">DOWNLOADS</span>
                    <font-awesome-icon :icon="['fas', 'chevron-down']" />
                  </div>
                </template>
                <template v-slot:content>
                  <div class="flex flex-col flex-grow">
                    <a
                      class="px-3 py-2 text-xs bg-white hover:bg-gray-200 uppercase font-bold"
                      target="_blank"
                      v-for="(side, key) in product.designs"
                      :href="side"
                      :key="key"
                    >{{ key }}</a>
                  </div>
                </template>
              </VueTailwindDropdown>
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
import VueTailwindDropdown from '@/components/VueTailwindDropdown'
import VuePureLightbox from 'vue-pure-lightbox'
import styles from 'vue-pure-lightbox/dist/VuePureLightbox.css'

export default {
  layout: 'admin_dashboard',
  components: {
    VueTailwindDropdown,
    VuePureLightbox
  },
  async mounted() {
    await this.$store.dispatch('admin/getOrders')
    this.isLoading = false
  },
  data() {
    return {
      isLoading: true
    }
  },
  computed: {
    ...mapGetters({
      orders: 'admin/orders'
    }),
    total() {
      return _.sum(_.map(this.orders, 'total'))
    }
  },
  methods: {
    orderStatus(status) {
      switch (status) {
        case 'pending':
          status = 'Order Received'
          break
      }
      return status
    },
    async processOrder(order, status) {
      this.isLoading = true
      const res = await this.$store.dispatch('admin/processOrder', {
        order,
        status
      })
      if (!res) {
        this.$toast.error('Order status updated failed!', {
          position: 'top'
        })
        return
      }
      this.$toast.success('Order status has been updated successfully!', {
        position: 'top'
      })
      this.isLoading = false
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