<template>
  <div class="container mx-auto">
    <div class="relative min-h-area-loader">
      <AreaLoader v-if="isLoading" />
      <div class="font-bold text-2xl mt-6 mb-2 px-8">Orders</div>

      <div class="px-8 mb-8">
        <OptionButtons :options="orderStatuses" v-model="orderStatus" :equalWidth="true">
          <template v-slot:default="{option}">
            <div class="flex flex-col items-center p-2">
              <div class="text-2xl mb-2">
                <font-awesome-icon :icon="['fas', option.meta.icon]" />
              </div>
              <div class="font-bold">{{ option.label }}</div>
              <div class="font-bold absolute top-0 right-0 py-2 px-3  flex justify-center items-center">{{ counts[option.value] }}</div>
            </div>
          </template>
        </OptionButtons>
      </div>

      <div class="px-8" v-if="orderStatus === 'toPay'">
        <div v-for="checkout in checkouts" :key="checkout._id" class="border rounded p-8 mb-8">
          <div class="font-bold pb-4 border-b flex items-center justify-between">
            <span>Items</span>
            <nuxt-link
              class="border px-8 py-2 font-bold rounded outline-none focus:outline-none border-white bg-primary text-white hover:bg-primary-lighter"
              :to="`/marketplace/checkout/${checkout._id}`"
            >Pay Now</nuxt-link>
          </div>
          <div class="flex flex-col flex-grow overflow-auto">
            <div
              class="flex flex-grow-0 border-b px-4 py-2"
              v-for="(product, i) in checkout.items"
              :key="i"
            >
              <div class="w-2/12 flex-justify-between">
                <div class="w-16">
                  <progressive-img class="relative mx-auto" :src="product.fullThumb" />
                </div>
              </div>
              <div class="flex flex-col w-4/12 justify-center">
                <span class="font-bold leading-none">
                  {{
                  product.productName
                  }}
                </span>
                <span class="font-bold text-gray-500">
                  {{
                  product.price.formatMoney('₱ ')
                  }},
                  {{
                  product.size
                  }}
                </span>
              </div>
              <div class="flex w-2/12 justify-center items-center">
                <div class="flex flex-col">
                  <div>Qty. {{ product.quantity }}</div>
                </div>
              </div>
              <div class="flex flex-col flex-grow justify-center items-end">
                <span class="font-bold leading-none text-center">
                  <number
                    :to="(product.price * product.quantity)"
                    :format="(num) => num.formatMoney('₱ ')"
                    :duration=".4"
                  />
                </span>
              </div>
            </div>
          </div>

          <div class="pb-4 border-b">
            <div class="flex justify-between pt-4 pb-2">
              <span>Subtotal</span>
              <span class="font-bold">{{ _subTotalOf(checkout).formatMoney('₱ ') }}</span>
            </div>
            <div class="flex justify-between">
              <span>Shipping</span>
              <nuxt-link
                :to="`/marketplace/checkout/${checkout._id}`"
                class="font-bold text-primary underline cursor-pointer"
              >To compute</nuxt-link>
            </div>
          </div>

          <div class="flex justify-between pt-4 font-bold text-xl">
            <span>Total</span>
            <span class="text-primary">{{ (_subTotalOf(checkout)).formatMoney('₱ ') }}</span>
          </div>
        </div>
      </div>

      <div class="px-8" v-else>
        <div v-for="order in orders" :key="order._id" class="border rounded p-8 mb-8">
          <div class="font-bold pb-4 border-b flex items-center justify-between">
            <span>Order #{{order.orderNumber}}</span>
            <a
              class="border px-8 py-2 font-bold rounded outline-none focus:outline-none border-white bg-primary text-white hover:bg-primary-lighter"
              :href="`/marketplace/checkout/tracking/?order=${order._id}`"
              target="_blank"
            >
              <span class="mr-2">View Status</span>
              <font-awesome-icon :icon="['fas', 'external-link-alt']" />
            </a>
          </div>
          <div class="flex flex-col flex-grow overflow-auto">
            <div
              class="flex flex-grow-0 border-b px-4 py-2"
              v-for="(product, i) in order.checkout.items"
              :key="i"
            >
              <div class="w-2/12 flex-justify-between">
                <div class="w-16">
                  <progressive-img class="relative mx-auto" :src="product.fullThumb" />
                </div>
              </div>
              <div class="flex flex-col w-4/12 justify-center">
                <span class="font-bold leading-none">
                  {{
                  product.productName
                  }}
                </span>
                <span class="font-bold text-gray-500">
                  {{
                  product.price.formatMoney('₱ ')
                  }},
                  {{
                  product.size
                  }}
                </span>
              </div>
              <div class="flex w-2/12 justify-center items-center">
                <div class="flex flex-col">
                  <div>Qty. {{ product.quantity }}</div>
                </div>
              </div>
              <div class="flex flex-col flex-grow justify-center items-end">
                <span class="font-bold leading-none text-center">
                  <number
                    :to="(product.price * product.quantity)"
                    :format="(num) => num.formatMoney('₱ ')"
                    :duration=".4"
                  />
                </span>
              </div>
            </div>
          </div>
          <div class="pb-4 border-b">
            <div class="flex justify-between pt-4 pb-2">
              <span>Subtotal</span>
              <span class="font-bold">{{ _subTotalOf(order.checkout).formatMoney('₱ ') }}</span>
            </div>
            <div class="flex justify-between">
              <span>Shipping</span>
              <span class="font-bold">{{ order.shippingFee.formatMoney('₱ ') }}</span>
            </div>
          </div>

          <div class="flex justify-between pt-4 font-bold text-xl">
            <span>Total</span>
            <span
              class="text-primary"
            >{{ ((_subTotalOf(order.checkout)) + order.shippingFee).formatMoney('₱ ') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OptionButtons from "@/components/OptionButtons";
import sum from "lodash/sum";
import map from "lodash/map";
import { mapGetters } from 'vuex'

export default {
  layout: "marketplace_dashboard",
  components: {
    OptionButtons,
  },
  data() {
    return {
      isLoading: false,
      orders: [],
      checkouts: [],
      orderStatuses: [
        {
          label: "To Pay",
          value: "toPay",
          meta: {
            icon: "wallet",
          },
        },
        {
          label: "To Ship",
          value: "toShip",
          meta: {
            icon: "dolly-flatbed",
          },
        },
        {
          label: "To Receive",
          value: "toReceive",
          meta: {
            icon: "shipping-fast",
          },
        },
        {
          label: "Delivered",
          value: "delivered",
          meta: {
            icon: "shipping-fast",
          },
        },
      ],
      orderStatus: null,
    };
  },
  computed: {
    ...mapGetters({
      user: "user",
      counts: "marketplace/counts",
    }),
  },
  methods: {
    _subTotalOf(checkout) {
      return sum(map(checkout.items, (item) => item.price * item.quantity));
    },
  },
  watch: {
    orderStatus: {
      async handler(to, from) {
        if (!to) return;
        this.isLoading = true;
        let newStatus

        switch (to) {
          case "toPay":
            this.checkouts = await this.$store.dispatch(
              "marketplace/getCheckoutsOfCurrentUser",
              {
                order: null,
              }
            );
            break;
          case "toShip":
          case "toReceive":
          case "delivered":
            if(to === 'toShip') newStatus = 'pending'
            if(to === 'toReceive') newStatus = 'fulfilled'
            if(to === 'delivered') newStatus = 'delivered'
            this.orders = await this.$store.dispatch(
              "marketplace/marketplaceOrders",
              {
                fulfillmentStatus: [newStatus],
              }
            );
            console.log(this.checkouts);
            break;
        }

        this.isLoading = false;
      },
    },
  },
};
</script>