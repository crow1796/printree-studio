<template>
  <div class="relative sm:px-8">
    <AreaLoader v-if="isLoading" />
    <button
      type="button"
      href="#"
      @click.prevent="$router.back"
      class="text-xs text-blue-500 hover:text-blue-700"
    >
      <font-awesome-icon :icon="['fas', 'arrow-left']" />
      <span class="ml-1">Back</span>
    </button>
    <div class="my-2 flex sm:flex-row justify-between items-center">
      <h2 class="text-2xl font-semibold leading-tight">Order</h2>
    </div>
    <div class="border flex flex-col mb-6" v-if="order">
      <div class="flex border-b p-4 justify-between items-center">
        <div class="flex flex-col">
          <div class="uppercase font-bold">ORDER: {{ order.orderNumber }}</div>
          <div class="text-sm text-gray-500">{{ `Placed at ${_formatDate(order.created_at)}` }}</div>
        </div>
        <div class="font-bold">
          <div class="flex items-end">
            <div class="font-bold flex-flex-col">
              <div class="text-xs leading-none">Fulfillment Status:</div>
              <div class="uppercase text-green-600 flex items-center">
                {{ order.fulfillmentStatus}}
                <span class="ml-2 cursor-pointer text-blue-600 hover:underline text-xs" title="Edit" v-tippy="{arrow: true}">
                  <font-awesome-icon :icon="['fas', 'edit']"/>
                </span>
              </div>
            </div>
            <div class="font-bold flex-flex-col ml-4">
              <div class="text-xs leading-none">Payment Status:</div>
              <div class="uppercase text-green-600">
                {{ order.financialStatus}}
                <span class="ml-2 cursor-pointer text-blue-600 hover:underline text-xs" title="Edit" v-tippy="{arrow: true}">
                  <font-awesome-icon :icon="['fas', 'edit']"/>
                </span>
              </div>
            </div>
            <div class="font-bold flex-flex-col ml-4">
              <div class="text-xs leading-none">Subtotal:</div>
              <div class="uppercas">{{ (total).formatMoney('₱ ')}}</div>
            </div>
            <div class="font-bold flex-flex-col ml-4">
              <div class="text-xs leading-none">Shipping Fee:</div>
              <div class="uppercas">{{ (order.shippingFee).formatMoney('₱ ')}}</div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div
          class="flex flex-grow-0 px-4 py-2"
          v-for="(product, i) in order.checkout.items"
          :class="{ 'border-b': i < (order.checkout.items.length - 1) }"
          :key="i"
        >
          <div class="w-2/12 flex">
            <div class="w-16">
              <VuePureLightbox :thumbnail="product.fullThumb" :images="[product.fullThumb]" />
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
            <a
              :href="`/admin/generate/${product.variant._id}`"
              target="_blank"
              class="text-blue-600 hover:underline font-bold"
            >Open Designs</a>
          </div>
        </div>
      </div>
      <div class="border-t">
        <div class="p-4">
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
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import VueTailwindDropdown from "@/components/VueTailwindDropdown";
import VuePureLightbox from "vue-pure-lightbox";
import "vue-pure-lightbox/dist/VuePureLightbox.css";

export default {
  layout: "admin_dashboard",
  components: {
    VueTailwindDropdown,
    VuePureLightbox,
  },
  async mounted() {
    const res = await this.$store.dispatch("admin/allMarketplaceOrders", {
      _id: this.$route.params.id,
    });
    this.order = _.first(res);
    this.isLoading = false;
  },
  data() {
    return {
      order: null,
      isLoading: true,
    };
  },
  computed: {
    total() {
      return _.sum(
        _.map(this.order.checkout.items, (item) => item.price * item.quantity)
      );
    },
  },
  methods: {
    _brgyDescOf(code) {
      const barangay = this.$locations.findBrgy(code);
      console.log(barangay);
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
    _formatDate(date) {
      return moment(date).format("MMMM DD, YYYY hh:m A");
    },
    _frontOrFirstThumbnail(thumbnails) {
      let sides = _.keys(thumbnails);
      const side = _.includes(sides, "front") ? "front" : _.head(sides);

      return thumbnails[side];
    },
    _lightBoxMediaFor(thumbnails) {
      return _.reverse(_.map(thumbnails, (thumbnail) => thumbnail));
    },
    _processButtonTextOf(order) {
      let text = "Process";
      switch (order.status) {
        case "processing":
          text = "Start Shipping";
          break;
        case "shipping":
          text = "Delivered";
          break;
      }
      return text;
    },
    _processStatusOf(order) {
      let status = "processing";
      switch (order.status) {
        case "processing":
          status = "shipping";
          break;
        case "shipping":
          status = "delivered";
          break;
      }
      this.processOrder(order, status);
    },
  },
};
</script>