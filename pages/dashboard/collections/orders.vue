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
    </div>
    <div class="border flex flex-col mb-6" v-for="(order, i) in orders" :key="i">
      <div class="flex border-b p-4 justify-between items-center">
        <div class="flex flex-col">
          <div class="font-bold uppercase">ORDER: {{ order.orderNum }}</div>
          <div
            class="text-sm text-gray-500"
          >{{ order.created_at ? `Placed at ${formatTimestamp(order.created_at)}` : `Checked out at ${formatTimestamp(order.created_at)}` }}</div>
        </div>
        <div class="flex">
          <div class="font-bold flex-flex-col mr-12">
            <div class="text-xs leading-none">Status:</div>
            <div
              class="uppercase"
              :class="{'text-green-600': order.fulfillmentStatus === 'fulfilled', 'text-primary': order.fulfillmentStatus !== 'fulfilled'}"
            >
              {{ order.fulfillmentStatus === "fulfilled" ? "Confirmed" : "Pending" }}
              <font-awesome-icon
                v-if="order.fulfillmentStatus === 'fulfilled'"
                :icon="['fas', 'check-circle']"
              />
            </div>
          </div>
          <div class="font-bold flex-flex-col">
            <div class="text-xs leading-none">Payment:</div>
            <div
              class="uppercase"
              :class="{'text-green-600': order.financialStatus === 'paid', 'text-primary': order.financialStatus !== 'paid'}"
            >
              {{ order.financialStatus || "Pending" }}
              <font-awesome-icon
                v-if="order.financialStatus === 'paid'"
                :icon="['fas', 'check-circle']"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="px-4">
        <div
          class="flex flex-grow-0 px-4 py-2"
          v-for="(product, i) in order.orderProducts"
          :class="{ 'border-b': i < (order.orderProducts.length - 1) }"
          :key="i"
        >
          <div class="w-2/12 flex">
            <div class="w-24">
              <progressive-img class="relative mx-auto" :src="product.variant.fullThumb" />
            </div>
          </div>
          <div class="flex flex-col w-4/12 justify-center">
            <span class="font-bold leading-none">
              {{
              product.variant.product.meta.name
              }}
            </span>
            <span class="font-bold w-1/12 text-gray-500">
              {{
              _sizeNameOfProduct(product)
              }}
            </span>
          </div>
          <div class="flex w-1/12 justify-end items-center">
            <div class="flex flex-col">
              <div>{{ product.price.formatMoney('₱ ') }}</div>
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
              >My Profit: {{ (_profitFrom(product)).formatMoney('₱ ') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";

export default {
  layout: "user_dashboard",
  async mounted() {
    await this.$store.dispatch("user_dashboard/ordersOfCurrentUser");
    // await this.$store.dispatch('user_dashboard/getTotalProfitOf', this.user)
    this.isLoading = false;
  },
  data() {
    return {
      isLoading: true,
    };
  },
  computed: {
    ...mapGetters({
      user: "user",
      orders: "user_dashboard/orders",
    }),
  },
  methods: {
    _profitFrom(product) {
      const size = _.find(product.variant.sizes, { shopId: product.shopId });
      return (size?.price || 0) * product.quantity;
    },
    _sizeNameOfProduct(product) {
      const size = _.find(product.variant.sizes, { shopId: product.shopId });
      return size?.name;
    },
    formatTimestamp(timestamp) {
      if (!timestamp) return;
      return moment(timestamp).format("MMMM Do YYYY, h:mm:ss a");
    },
  },
};
</script>