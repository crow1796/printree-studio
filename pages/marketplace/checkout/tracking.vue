<template>
  <div class="relative">
    <AreaLoader v-if="isLoading" fullscreen />
    <div class="mx-auto pb-8 sm:pb-8 p-16 sm:p-16 lg:px-48 bg-gray-100" v-if="order">
      <div class="flex-grow flex flex-col relative w-full sm:w-7/12 mx-auto">
        <div class="flex justify-center mb-16">
          <a href="/marketplace">
            <img src="~/assets/images/logo-nav.png" alt="Printree Studio Logo" class="w-4/12 mx-auto"/>
          </a>
        </div>
      
        <div class="relative">
          <div>Order #{{ order.orderNumber }}</div>
          <div class="font-bold pb-4 border-b flex-grow text-3xl">
            <span>Thank you for your order!</span>
          </div>
        </div>

        <div class="border rounded p-4 my-4">
          <div class="font-bold mb-2">
            Your order is
            <span class="text-primary">{{ order.fulfillmentStatus }}</span>
          </div>

          <div
            v-if="order.fulfillmentStatus === 'pending'"
          >We’ve accepted your order, and we’re getting it ready. Come back to this page for updates on your shipment status.</div>
        </div>

        <div>
          <div class="font-bold p-4 border-b">Items</div>
          <div class="flex flex-col flex-grow overflow-auto">
            <div
              class="flex flex-grow-0 border-b px-4 py-2"
              v-for="(product, i) in order.checkout.items"
              :key="i"
            >
              <div class="w-2/12 flex-justify-between">
                <div class="w-16 mx-auto">
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
            <div class="flex justify-between px-4 pt-4 pb-2">
              <span>Subtotal</span>
              <span class="font-bold">{{ subTotal.formatMoney('₱ ') }}</span>
            </div>
            <div class="flex justify-between px-4">
              <span>Shipping</span>
              <span class="font-bold">{{ order.shippingFee.formatMoney('₱ ') }}</span>
            </div>
          </div>

          <div class="flex justify-between p-4 pb-8 font-bold text-xl">
            <span>Total</span>
            <span class="text-primary">{{ (subTotal + order.shippingFee).formatMoney('₱ ') }}</span>
          </div>
        </div>

        <div class="border p-4 mb-4 rounded">
          <div class="font-bold text-lg pb-4">Customer Information</div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div>
                <div class="font-bold">Shipping Address</div>
                <div>{{ order.shippingAddress.fullName }}</div>
                <div>{{ `${order.shippingAddress.street}, ${_brgyDescOf(order.shippingAddress.barangay)}, ${_cityDescOf(order.shippingAddress.city)}, ${_provDescOf(order.shippingAddress.province)}, ${order.shippingAddress.postcode}` }}</div>
              </div>
              <div class="pt-4">
                <div class="font-bold">Mobile Number</div>
                <div>{{ order.shippingAddress.mobileNumber }}</div>
              </div>
              <div class="pt-4">
                <div class="font-bold">Payment Method</div>
                <div>{{ order.paymentMethod.title }}</div>
              </div>
            </div>

            <div>
              <div>
                <div class="font-bold">Billing Address</div>
                <div>{{ order.billingAddress.fullName }}</div>
                <div>{{ `${order.billingAddress.street}, ${_brgyDescOf(order.billingAddress.barangay)}, ${_cityDescOf(order.billingAddress.city)}, ${_provDescOf(order.billingAddress.province)}, ${order.billingAddress.postcode}` }}</div>
              </div>
              <div class="pt-4">
                <div class="font-bold">Mobile Number</div>
                <div>{{ order.billingAddress.mobileNumber }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-center">
          <span class="mr-2">Need help?</span>
          <a
            class="px-3 py-2 text-xs hover:bg-gray-200 border rounded font-bold outline-none focus:outline-none mr-2"
            href="mailto:support@printreestudio.com"
          >Contact Us</a>
        </div>

        <div class="text-center text-sm mt-10">
          All rights reserved Printree Studio.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import map from "lodash/map";
import sum from "lodash/sum";

export default {
  layout: "empty",
  async mounted() {
    this.order = await this.$store.dispatch(
      "marketplace/getMarketplaceOrder",
      this.$route.query.order
    );

    this.isLoading = false;
  },
  data() {
    return {
      isLoading: true,
      order: null,
    };
  },
  methods: {
    _brgyDescOf(code) {
      const barangay = this.$locations.findBrgy(code);
      return barangay?.brgyDesc;
    },
    _provDescOf(code) {
      const province = this.$locations.findProvince(code);
      return province?.provDesc;
    },
    _cityDescOf(code) {
      const city = this.$locations.findCity(code);
      return city?.citymunDesc;
    },
  },
  computed: {
    subTotal() {
      return sum(
        map(this.order.checkout.items, (item) => item.price * item.quantity)
      );
    },
  },
};
</script>