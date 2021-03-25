<template>
  <div class="relative sm:px-8">
    <AreaLoader v-if="isLoading" fullscreen />
    <VueTailwindModal
      ref="fulfillmentStatusModal"
      width="30%"
      content-class="rounded-none shadow-none text-gray-600"
    >
      <div class="flex flex-col">
        <div class="modal-heading border-b w-full p-4">
          <div class="flex justify-between w-full items-center">
            <div class="flex uppercase justify-center flex-grow">
              <strong>Update Fulfillment Status</strong>
            </div>
          </div>
        </div>
        <div class="modal-body p-4">
          <form>
            <div class="mb-4 flex-grow">
              <label for="name" class="font-bold">Status</label>
              <div class="mt-2">
                <select
                  name="fulfillmentStatus"
                  class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                  type="text"
                  :class="{ 'border-red-400': errors.has('fulfillmentFormData.fulfillmentStatus'), 'focus:border-gray-600': !errors.has('fulfillmentFormData.fulfillmentStatus') }"
                  placeholder="Fulfillment Status"
                  v-model="fulfillmentFormData.fulfillmentStatus"
                  data-vv-as="Fulfillment Status"
                  v-validate="'required'"
                  data-vv-scope="fulfillmentFormData"
                >
                  <option :value="null">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="shipping">Shipping</option>
                  <option value="fulfilled">Fulfilled</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <span
                class="text-red-700 text-xs pt-1 font-bold inline-block"
                v-if="errors.has('fulfillmentFormData.fulfillmentStatus')"
              >{{ errors.first('fulfillmentFormData.fulfillmentStatus') }}</span>
            </div>

            <div class="flex">
              <div class="mr-2">
                <div>
                  <input
                    name="statusUrl"
                    class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                    type="text"
                    :class="{ 'border-red-400': errors.has('fulfillmentFormData.statusUrl'), 'focus:border-gray-600': !errors.has('fulfillmentFormData.statusUrl') }"
                    placeholder="Tracking URL"
                    v-model="fulfillmentFormData.statusUrl"
                  />
                </div>
                <span
                  class="text-red-700 text-xs pt-1 font-bold inline-block"
                  v-if="errors.has('fulfillmentFormData.statusUrl')"
                >{{ errors.first('fulfillmentFormData.statusUrl') }}</span>
              </div>
              <div class="ml-2">
                <div>
                  <input
                    name="trackingCode"
                    class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                    type="text"
                    :class="{ 'border-red-400': errors.has('fulfillmentFormData.trackingCode'), 'focus:border-gray-600': !errors.has('fulfillmentFormData.trackingCode') }"
                    placeholder="Tracking Code"
                    v-model="fulfillmentFormData.trackingCode"
                  />
                </div>
                <span
                  class="text-red-700 text-xs pt-1 font-bold inline-block"
                  v-if="errors.has('fulfillmentFormData.trackingCode')"
                >{{ errors.first('fulfillmentFormData.trackingCode') }}</span>
              </div>
            </div>
          </form>
        </div>
        <div class="flex modal-footer justify-between flex-shrink p-4 border-t items-center">
          <button
            type="button"
            class="justify-center items-center focus:outline-none outline-none border px-3 py-2 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
            @click="hideModal($refs.fulfillmentStatusModal)"
          >Cancel</button>

          <button
            type="button"
            class="shadow-xl border border-white bg-primary px-8 py-2 font-bold rounded text-white hover:bg-primary-lighter"
            @click="updateFulfillmentStatus"
          >Save</button>
        </div>
      </div>
    </VueTailwindModal>
    <VueTailwindModal
      ref="paymentStatusModal"
      width="30%"
      content-class="rounded-none shadow-none text-gray-600"
    >
      <div class="flex flex-col">
        <div class="modal-heading border-b w-full p-4">
          <div class="flex justify-between w-full items-center">
            <div class="flex uppercase justify-center flex-grow">
              <strong>Update Payment Status</strong>
            </div>
          </div>
        </div>
        <div class="modal-body p-4">
          <div>
            <form>
              <div class="mb-4 flex-grow">
                <label for="name" class="font-bold">Status</label>
                <div class="mt-2">
                  <select
                    name="financialStatus"
                    class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                    type="text"
                    :class="{ 'border-red-400': errors.has('financialFormData.financialStatus'), 'focus:border-gray-600': !errors.has('financialFormData.financialStatus') }"
                    placeholder="Financial Status"
                    v-model="financialFormData.financialStatus"
                    data-vv-as="Financial Status"
                    v-validate="'required'"
                    data-vv-scope="financialFormData"
                  >
                    <option :value="null">Select Status</option>
                    <option value="pending">Pending</option>
                    <option value="partial">Partially Paid</option>
                    <option value="paid">Fully Paid</option>
                    <option value="refunded">Refunded</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <span
                  class="text-red-700 text-xs pt-1 font-bold inline-block"
                  v-if="errors.has('financialFormData.financialStatus')"
                >{{ errors.first('financialFormData.financialStatus') }}</span>
              </div>

              <div v-if="financialFormData.financialStatus === 'partial'">
                <div>
                  <input
                    name="partialAmount"
                    class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                    type="text"
                    :class="{ 'border-red-400': errors.has('financialFormData.partialAmount'), 'focus:border-gray-600': !errors.has('financialFormData.partialAmount') }"
                    placeholder="Amount Paid"
                    v-model.number="financialFormData.partialAmount"
                    data-vv-as="Amount Paid"
                    v-validate="'required|numeric|required_if:financialStatus,partial'"
                    data-vv-scope="financialFormData"
                  />
                </div>
                <span
                  class="text-red-700 text-xs pt-1 font-bold inline-block"
                  v-if="errors.has('financialFormData.partialAmount')"
                >{{ errors.first('financialFormData.partialAmount') }}</span>
              </div>
            </form>
          </div>
        </div>
        <div class="flex modal-footer justify-between flex-shrink p-4 border-t items-center">
          <button
            type="button"
            class="justify-center items-center focus:outline-none outline-none border px-3 py-2 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
            @click="hideModal($refs.paymentStatusModal)"
          >Cancel</button>

          <button
            type="button"
            class="shadow-xl border border-white bg-primary px-8 py-2 font-bold rounded text-white hover:bg-primary-lighter"
            @click="updateFinancialStatus"
          >Save</button>
        </div>
      </div>
    </VueTailwindModal>
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
                <span
                  class="ml-2 cursor-pointer text-blue-600 hover:underline text-xs"
                  title="Edit"
                  v-tippy="{arrow: true}"
                  @click="$refs.fulfillmentStatusModal.show()"
                >
                  <font-awesome-icon :icon="['fas', 'edit']" />
                </span>
              </div>
            </div>
            <div class="font-bold flex-flex-col ml-4">
              <div class="text-xs leading-none">Payment Status:</div>
              <div class="uppercase text-green-600">
                {{ order.financialStatus}}
                <span
                  class="ml-2 cursor-pointer text-blue-600 hover:underline text-xs"
                  title="Edit"
                  v-tippy="{arrow: true}"
                  @click="$refs.paymentStatusModal.show()"
                >
                  <font-awesome-icon :icon="['fas', 'edit']" />
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
            <div class="font-bold flex-flex-col ml-4" v-if="order.trackingCode">
              <div class="text-xs leading-none">Tracking Code:</div>
              <div class="uppercas">
                <a
                  :href="order.statusUrl"
                  target="_blank"
                  class="text-blue-600 hover:underline font-bold"
                >{{ order.trackingCode }}</a>
              </div>
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
import VueTailwindModal from "@/components/VueTailwindModal";
import moment from "moment";
import VueTailwindDropdown from "@/components/VueTailwindDropdown";
import VuePureLightbox from "vue-pure-lightbox";
import "vue-pure-lightbox/dist/VuePureLightbox.css";

export default {
  layout: "admin_dashboard",
  components: {
    VueTailwindDropdown,
    VuePureLightbox,
    VueTailwindModal,
  },
  async mounted() {
    const res = await this.$store.dispatch("admin/allMarketplaceOrders", {
      _id: this.$route.params.id,
    });
    this.order = _.first(res);
    this.fulfillmentFormData.fulfillmentStatus = this.order.fulfillmentStatus;
    this.fulfillmentFormData.trackingCode = this.order.trackingCode;
    this.fulfillmentFormData.statusUrl = this.order.statusUrl;

    this.financialFormData.financialStatus = this.order.financialStatus;
    this.isLoading = false;
  },
  data() {
    return {
      order: null,
      isLoading: true,
      fulfillmentFormData: {
        fulfillmentStatus: null,
        trackingCode: null,
        statusUrl: null,
      },
      financialFormData: {
        financialStatus: null,
      },
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
    hideModal(ref) {
      ref.hide();
      this.fulfillmentFormData.fulfillmentStatus = this.order.fulfillmentStatus;
      this.financialFormData.financialStatus = this.order.financialStatus;
    },
    async updateFulfillmentStatus() {
      const isValid = await this.$validator.validateAll("fulfillmentFormData");
      if (this.isLoading) return;
      if (!isValid) {
        this.$toast.error("Please fix the errors below.", { position: "top" });
        return;
      }

      this.isLoading = true;

      const res = await this.$store.dispatch("admin/updateOrder", {
        id: this.$route.params.id,
        orderInput: this.fulfillmentFormData,
      });

      this.order = {
        ...this.order,
        ...res,
      };

      this.hideModal(this.$refs.fulfillmentStatusModal);

      this.isLoading = false;
    },
    async updateFinancialStatus() {
      const isValid = await this.$validator.validateAll("financialFormData");
      if (this.isLoading) return;
      if (!isValid) {
        this.$toast.error("Please fix the errors below.", { position: "top" });
        return;
      }

      this.isLoading = true;

      const res = await this.$store.dispatch("admin/updateOrder", {
        id: this.$route.params.id,
        orderInput: this.financialFormData,
      });

      this.order = {
        ...this.order,
        ...res,
      };

      this.hideModal(this.$refs.paymentStatusModal);

      this.isLoading = false;
    },
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