<template>
  <div class="relative">
    <AreaLoader v-if="isLoading" fullscreen />
    <div class="mx-auto p-16 sm:p-16 lg:px-48 bg-gray-100">
      <div class="flex-grow flex flex-col relative w-full sm:w-7/12 mx-auto">
        <VueTailwindModal
          ref="addressSelectionModal"
          width="30%"
          content-class="rounded-none shadow-none text-gray-600"
          :backdrop="false"
        >
          <div class="flex flex-col relative">
            <AreaLoader v-if="isAddressModalLoading" />
            <div class="modal-heading border-b w-full p-4">
              <div class="flex justify-between w-full items-center">
                <div class="flex uppercase justify-between flex-grow">
                  <strong>CHOOSE AN ADDRESS</strong>
                  <div
                    class="select-none absolute right-0 top-0 mr-3 mt-3 cursor-pointer w-8 h-8 border rounded-full flex justify-center items-center hover:border-gray-600 hover:text-gray-700"
                    @click="$refs.addressSelectionModal.hide()"
                  >
                    <font-awesome-icon :icon="['fas', 'times']" class="text-xs" />
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-body px-4 pt-4">
              <div
                class="flex flex-col p-8 border rounded border-dashed cursor-pointer hover:border-primary hover:text-primary items-center justify-center mb-4"
                @click="showAddressFormModal"
              >
                <div class="font-bold">ADD A NEW ADDRESS</div>
              </div>
              <div
                class="flex flex-col px-4 py-5 border rounded cursor-pointer hover:border-primary hover:text-primary mb-4 relative"
                v-for="address in userAddresses"
                :key="address.id"
                @click="selectAddress(address)"
              >
                <span
                  v-if="address.isDefault"
                  class="rounded-full text-xs px-2 mr-1 bg-primary text-white absolute top-0 left-0 mt-2 ml-3"
                >Default</span>
                <div class="flex justify-between items-end">
                  <div class="font-bold">{{ address.fullName }}</div>
                  <button
                    type="button"
                    class="rounded border px-3 py-1 text-xs text-gray-700 hover:bg-gray-300"
                    @click.stop="editAddress(address)"
                  >
                    <span>Edit</span>
                    <span>
                      <font-awesome-icon :icon="['fas', 'edit']" />
                    </span>
                  </button>
                </div>
                <div class="font-normal">{{ address.mobileNumber }}</div>
                <div
                  class="font-normal"
                >{{ `${address.street}, ${_brgyDescOf(address.barangay)}, ${_cityDescOf(address.city)}, ${_provDescOf(address.province)}` }}</div>
                <div class="font-normal" v-if="address.notes">{{ address.notes }}</div>
              </div>
            </div>
          </div>
        </VueTailwindModal>
        <VueTailwindModal
          ref="addressFormModal"
          width="30%"
          content-class="rounded-none shadow-none text-gray-600"
          :backdrop="false"
        >
          <div class="flex flex-col relative">
            <AreaLoader v-if="isAddressModalLoading" />
            <div class="modal-heading border-b w-full p-4">
              <div class="flex justify-between w-full items-center">
                <div class="flex uppercase justify-between flex-grow">
                  <strong>{{ addressFormData._id ? 'Update' : 'Add an' }} Address</strong>
                  <div
                    class="select-none absolute right-0 top-0 mr-3 mt-3 cursor-pointer w-8 h-8 border rounded-full flex justify-center items-center hover:border-gray-600 hover:text-gray-700"
                    @click="hideAddressFormModal"
                  >
                    <font-awesome-icon :icon="['fas', 'times']" class="text-xs" />
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-body p-4">
              <div class="mb-3">
                <div>
                  <input
                    name="fullName"
                    class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                    type="text"
                    :class="{ 'border-red-400': errors.has('addressForm.fullName'), 'focus:border-gray-600': !errors.has('addressForm.fullName') }"
                    placeholder="Your Name"
                    v-model="addressFormData.fullName"
                    data-vv-as="Full Name"
                    v-validate="'required'"
                    data-vv-scope="addressForm"
                  />
                </div>
                <span
                  class="text-red-700 text-xs pt-1 font-bold inline-block"
                  v-if="errors.has('addressForm.fullName')"
                >{{ errors.first('addressForm.fullName') }}</span>
              </div>
              <div class="mb-3">
                <div>
                  <select
                    name="province"
                    class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                    type="text"
                    :class="{ 'border-red-400': errors.has('addressForm.province'), 'focus:border-gray-600': !errors.has('addressForm.province') }"
                    placeholder="Your Province"
                    v-model="addressFormData.province"
                    data-vv-as="Province"
                    v-validate="'required'"
                    @change="getPHAddresses()"
                    data-vv-scope="addressForm"
                  >
                    <option :value="null">Select Province</option>
                    <option
                      v-for="province in provinces"
                      :key="province.i"
                      :value="province.provCode"
                    >{{ province.provDesc }}</option>
                  </select>
                </div>
                <span
                  class="text-red-700 text-xs pt-1 font-bold inline-block"
                  v-if="errors.has('addressForm.province')"
                >{{ errors.first('addressForm.province') }}</span>
              </div>
              <div class="mb-3">
                <div>
                  <select
                    name="city"
                    class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                    type="text"
                    :class="{ 'border-red-400': errors.has('addressForm.city'), 'focus:border-gray-600': !errors.has('addressForm.city') }"
                    placeholder="Your City"
                    v-model="addressFormData.city"
                    data-vv-as="City"
                    v-validate="'required'"
                    @change="getPHAddresses()"
                    data-vv-scope="addressForm"
                  >
                    <option :value="null">Select City</option>
                    <option
                      v-for="city in cities"
                      :key="city.i"
                      :value="city.citymunCode"
                    >{{ city.citymunDesc }}</option>
                  </select>
                </div>
                <span
                  class="text-red-700 text-xs pt-1 font-bold inline-block"
                  v-if="errors.has('addressForm.city')"
                >{{ errors.first('addressForm.city') }}</span>
              </div>
              <div class="mb-3">
                <div>
                  <select
                    name="barangay"
                    class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                    type="text"
                    :class="{ 'border-red-400': errors.has('addressForm.barangay'), 'focus:border-gray-600': !errors.has('addressForm.barangay') }"
                    placeholder="Your Barangay"
                    v-model="addressFormData.barangay"
                    data-vv-as="Barangay"
                    v-validate="'required'"
                    data-vv-scope="addressForm"
                  >
                    <option :value="null">Select Barangay</option>
                    <option
                      v-for="brgy in barangays"
                      :key="brgy.i"
                      :value="brgy.brgyCode"
                    >{{ brgy.brgyDesc }}</option>
                  </select>
                </div>
                <span
                  class="text-red-700 text-xs pt-1 font-bold inline-block"
                  v-if="errors.has('addressForm.barangay')"
                >{{ errors.first('addressForm.barangay') }}</span>
              </div>

              <div class="mb-3">
                <div>
                  <input
                    name="street"
                    class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                    type="text"
                    :class="{ 'border-red-400': errors.has('addressForm.street'), 'focus:border-gray-600': !errors.has('addressForm.street') }"
                    placeholder="Your House Number, Building and Street Name"
                    v-model="addressFormData.street"
                    data-vv-as="House Number, Building and Street Name"
                    v-validate="'required'"
                    data-vv-scope="addressForm"
                  />
                </div>
                <span
                  class="text-red-700 text-xs pt-1 font-bold inline-block"
                  v-if="errors.has('addressForm.street')"
                >{{ errors.first('addressForm.street') }}</span>
              </div>
              <div class="mb-3">
                <div>
                  <input
                    name="postcode"
                    class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                    type="number"
                    :class="{ 'border-red-400': errors.has('addressForm.postcode'), 'focus:border-gray-600': !errors.has('addressForm.postcode') }"
                    placeholder="Your Zip Code"
                    v-model="addressFormData.postcode"
                    data-vv-as="Zip Code"
                    v-validate="'required|numeric'"
                    data-vv-scope="addressForm"
                  />
                </div>
                <span
                  class="text-red-700 text-xs pt-1 font-bold inline-block"
                  v-if="errors.has('addressForm.postcode')"
                >{{ errors.first('addressForm.postcode') }}</span>
              </div>
              <div class="mb-3">
                <div>
                  <input
                    name="mobileNumber"
                    class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                    type="text"
                    :class="{ 'border-red-400': errors.has('addressForm.mobileNumber'), 'focus:border-gray-600': !errors.has('addressForm.mobileNumber') }"
                    placeholder="Your Mobile Number"
                    v-model="addressFormData.mobileNumber"
                    data-vv-as="Mobile Number"
                    v-validate="'required|numeric'"
                    data-vv-scope="addressForm"
                  />
                </div>
                <span
                  class="text-red-700 text-xs pt-1 font-bold inline-block"
                  v-if="errors.has('addressForm.mobileNumber')"
                >{{ errors.first('addressForm.mobileNumber') }}</span>
              </div>
              <div>
                <div>
                  <textarea
                    name="other_notes"
                    class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                    placeholder="Your Other Notes"
                    v-model="addressFormData.notes"
                  />
                </div>
              </div>
              <div class="mb-3 flex items-center">
                <label for="label" class="font-bold mr-4 mt-2">Address Label</label>
                <div>
                  <OptionButtons
                    :options="addressLabels"
                    v-model="addressFormData.label"
                    :checkIcon="false"
                  />
                </div>
                <span
                  class="text-red-700 text-xs pt-1 font-bold inline-block"
                  v-if="errors.has('label')"
                >{{ errors.first('label') }}</span>
              </div>
              <div>
                <label for="isDefault" class="font-bold">
                  <input
                    type="checkbox"
                    name="isDefault"
                    id="isDefault"
                    v-model="addressFormData.isDefault"
                  />
                  Make this my default address
                </label>
                <span
                  class="text-red-700 text-xs pt-1 font-bold inline-block"
                  v-if="errors.has('isDefault')"
                >{{ errors.first('isDefault') }}</span>
              </div>
            </div>
            <div class="flex modal-footer justify-between flex-shrink p-4 border-t items-center">
              <button
                type="button"
                class="justify-center items-center focus:outline-none outline-none border px-8 py-2 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
                @click="hideAddressFormModal"
              >Cancel</button>

              <button
                @click="saveAddress"
                type="button"
                class="shadow-xl border border-white bg-primary px-8 py-2 font-bold rounded text-white hover:bg-primary-lighter"
              >SAVE</button>
            </div>
          </div>
        </VueTailwindModal>
        <div class="flex justify-between relative">
          <button
            type="button"
            href="#"
            @click.prevent="$router.back"
            class="text-xs text-blue-500 hover:text-blue-700 absolute left-0 top-0"
          >
            <font-awesome-icon :icon="['fas', 'arrow-left']" />
            <span class="ml-1">Back</span>
          </button>

          <span class="font-bold pb-4 border-b flex-grow p-4 text-3xl text-center">
            <span>Checkout</span>
          </span>
        </div>
        <div class="flex flex-col flex-grow overflow-auto">
          <div class="font-bold p-4 border-b">Items</div>
          <div class="flex flex-col flex-grow overflow-auto">
            <div
              class="flex flex-grow-0 border-b px-4 py-2"
              v-for="(product, i) in products"
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
          <div class="font-bold p-4 border-b">Address</div>
          <div class="flex flex-col py-4">
            <div class="flex">
              <div class="flex w-6/12 flex-col">
                <div
                  class="flex flex-col p-4 border rounded border-dashed mx-2 cursor-pointer hover:border-primary hover:text-primary bg-white"
                  :class="{
                    'border-primary text-primary': shippingAddress
                  }"
                  @click="selectAddressFor('shipping')"
                >
                  <div
                    class="font-bold text-sm mb-2 text-gray-600 flex items-center justify-between"
                  >
                    <div>Shipping Address</div>
                  </div>
                  <div v-if="shippingAddress">
                    <div class="flex justify-between items-center">
                      <div class="font-bold">{{ shippingAddress.fullName }}</div>

                      <span
                        v-if="shippingAddress.isDefault"
                        class="rounded-full text-xs px-2 mr-1 bg-primary text-white py-1"
                      >Default</span>
                    </div>
                    <div class="font-normal">{{ shippingAddress.mobileNumber }}</div>
                    <div
                      class="font-normal"
                    >{{ `${shippingAddress.street}, ${_brgyDescOf(shippingAddress.barangay)}, ${_cityDescOf(shippingAddress.city)}, ${_provDescOf(shippingAddress.province)}` }}</div>
                    <div
                      class="font-normal"
                      v-if="shippingAddress.notes"
                    >{{ shippingAddress.notes }}</div>
                  </div>
                  <div class="font-bold" v-else>Choose an address</div>
                </div>
                <span
                  class="text-red-700 text-xs pl-2 pt-1 font-bold inline-block"
                  v-if="shippingAddressError"
                >{{ shippingAddressError }}</span>
              </div>
              <div class="flex w-6/12 flex-col">
                <div
                  class="flex flex-col p-4 border rounded border-dashed mx-2 cursor-pointer hover:border-primary hover:text-primary bg-white"
                  :class="{
                    'border-primary text-primary': billingAddress
                  }"
                  @click="selectAddressFor('billing')"
                >
                  <div
                    class="font-bold text-sm mb-2 text-gray-600 flex justify-between items-center"
                  >
                    <div>Billing Address</div>
                  </div>
                  <div v-if="billingAddress">
                    <div class="flex justify-between items-center">
                      <div class="font-bold">{{ billingAddress.fullName }}</div>

                      <span
                        v-if="billingAddress.isDefault"
                        class="rounded-full text-xs px-2 mr-1 bg-primary text-white py-1"
                      >Default</span>
                    </div>
                    <div class="font-normal">{{ billingAddress.mobileNumber }}</div>
                    <div
                      class="font-normal"
                    >{{ `${billingAddress.street}, ${_brgyDescOf(billingAddress.barangay)}, ${_cityDescOf(billingAddress.city)}, ${_provDescOf(billingAddress.province)}` }}</div>
                    <div class="font-normal" v-if="billingAddress.notes">{{ billingAddress.notes }}</div>
                  </div>
                  <div class="font-bold" v-else>Choose an address</div>
                </div>
                <span
                  class="text-red-700 text-xs pl-4 pt-1 font-bold inline-block"
                  v-if="billingAddressError"
                >{{ billingAddressError }}</span>
              </div>
            </div>
          </div>
          <div class="border-t">
            <div class="font-bold pb-4 border-b p-4">Payment Method</div>
            <div class="px-4 pb-4 pt-2">
              <OptionButtons :options="paymentMethods" v-model="paymentMethod">
                <template v-slot:default="{option}">
                  <div class="flex flex-col">{{ option.label }}</div>
                </template>
              </OptionButtons>
            </div>
          </div>
          <div class="border-t">
            <div class="font-bold pb-4 border-b p-4">Shipping Options</div>
            <div class="px-4 pb-4 pt-2">
              <div v-if="!isCalculatingSF">
                <OptionButtons :options="shippingRates" v-model="shippingRate">
                  <template v-slot:default="{option}">
                    <div class="flex flex-col">
                      <div>{{ option.meta.cost.formatMoney('₱ ') }}</div>
                      <div class="text-xs font-bold">{{ option.label }}</div>
                      <div class="text-xs font-normal">{{ option.name }}</div>
                    </div>
                  </template>
                </OptionButtons>
              </div>

              <div v-if="isCalculatingSF">
                <ContentLoader
                  :width="300"
                  :height="33"
                  :speed="2"
                  primaryColor="#f3f3f3"
                  secondaryColor="#ecebeb"
                >
                  <rect x="0" y="0" rx="0" ry="0" width="60" height="33" />
                  <rect x="65" y="0" rx="0" ry="0" width="60" height="33" />
                  <rect x="130" y="0" rx="0" ry="0" width="60" height="33" />
                </ContentLoader>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-between p-4 border-t">
          <div class="flex mr-4">
            <input
              type="text"
              v-model="voucherCode"
              placeholder="Enter Voucher Code"
              class="px-6 py-2 rounded outline-none border mr-2"
            />
            <PTButton color="primary" :disabled="!voucherCode">APPLY</PTButton>
          </div>
          <div class="flex flex-col">
            <div class="font-bold flex items-center">
              <div class="flex flex-col">
                <span class="text-xs font-normal">Items Total</span>
                <number :to="subtotal" :format="(num) => num.formatMoney('₱ ')" :duration=".4" />
              </div>
              <span class="mx-2">+</span>
              <div class="flex flex-col">
                <span class="text-xs font-normal">Shipping Fee</span>
                <number
                  :to="deliveryOptionValue"
                  :format="(num) => num.formatMoney('₱ ')"
                  :duration=".4"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-between p-4 items-center border-t">
          <div class="flex flex-col">
            <span class="text-xs">Grand Total</span>
            <span class="font-bold text-primary leading-none my-1">
              <number :to="total" :format="(num) => num.formatMoney('₱ ')" :duration=".4" />
            </span>
            <span class="text-xs text-gray-500">VAT included, where applicable</span>
          </div>
          <PTButton color="primary" :disabled="!total || isCalculatingSF" @click="placeOrder">
            <span class="mr-2">Place Order</span>
            <font-awesome-icon :icon="['fas', 'arrow-right']" />
          </PTButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OptionButtons from "@/components/OptionButtons";
import VueTailwindModal from "@/components/VueTailwindModal";
import { mapGetters } from "vuex";
import { ContentLoader } from "vue-content-loader";

export default {
  layout: "empty",
  middleware: ["authenticated"],
  components: {
    OptionButtons,
    VueTailwindModal,
    ContentLoader,
  },
  async mounted() {
    const checkout = await this.$store.dispatch(
      "marketplace/getCheckout",
      this.$route.params.id
    );

    await this._loadAddresses();
    await this._loadPaymentMethods();

    this.paymentMethod = _.first(this.paymentMethods).value;

    this.shippingAddress = _.find(this.userAddresses, { isDefault: true });
    this.billingAddress = _.find(this.userAddresses, { isDefault: true });

    this.products = checkout.items;

    this.isLoading = false;
  },
  data() {
    return {
      isLoading: true,
      isCalculatingSF: false,
      products: [],
      selectingAddressFor: null,
      userAddresses: [],
      shippingAddressError: null,
      billingAddressError: null,
      addressLabels: [
        {
          label: "Home",
          value: "home",
        },
        {
          label: "Office",
          value: "office",
        },
      ],
      provinces: [],
      cities: [],
      barangays: [],
      isAddressModalLoading: false,
      voucherCode: null,
      shippingRate: null,
      shippingAddress: null,
      billingAddress: null,
      contactNumber: null,
      contactEmail: null,
      addressFormData: {
        _id: null,
        fullName: null,
        street: null,
        province: null,
        city: null,
        barangay: null,
        mobileNumber: null,
        notes: null,
        label: "home",
        isDefault: false,
      },
      shippingRates: [],
      paymentMethod: null,
      paymentMethods: [],
    };
  },
  computed: {
    ...mapGetters({
      user: "user",
    }),
    subtotal() {
      return _.sum(
        _.map(this.products, ({ quantity, price }) => quantity * price)
      );
    },
    total() {
      if (!this.shippingRate) return this.subtotal;
      return this.subtotal + this.deliveryOptionValue;
    },
    deliveryOptionValue() {
      const option = _.find(this.shippingRates, {
        value: this.shippingRate,
      });
      if (!option) return 0;
      return option.meta.cost;
    },
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
    async placeOrder() {
      this.billingAddressError = null;
      this.shippingAddressError = null;
      if (!this.billingAddress)
        this.billingAddressError = "Billing address is required.";
      if (!this.shippingAddress)
        this.shippingAddressError = "Shipping address is required.";
      let validationResponse = await this.$validator.validateAll();
      if (
        !validationResponse ||
        this.billingAddressError ||
        this.shippingAddressError ||
        this.isLoading ||
        this.isCalculatingSF
      )
        return;
      this.isLoading = true;

      const order = await this.$store.dispatch("marketplace/placeOrder", {
        checkout: this.$route.params.id,
        shippingAddress: this.shippingAddress._id,
        billingAddress: this.billingAddress._id,
        shippingRate: this.shippingRate,
        paymentMethod: this.paymentMethod,
      });
      this.$router.replace(
        `/marketplace/checkout/tracking/?order=${order._id}`
      );
    },
    selectAddress(address) {
      switch (this.selectingAddressFor) {
        case "shipping":
          this.shippingAddress = address;
          break;
        case "billing":
          this.billingAddress = address;
          break;
      }
      this.$refs.addressSelectionModal.hide();
    },
    selectAddressFor(address) {
      this.selectingAddressFor = address;
      this.showAddressSelectionModal();
    },
    async editAddress(address) {
      this.addressFormData = JSON.parse(JSON.stringify(address));
      this.$refs.addressSelectionModal.hide();
      this.$refs.addressFormModal.show();
      this.isAddressModalLoading = true;
      await this.getPHAddresses();
      this.isAddressModalLoading = false;
    },
    async saveAddress() {
      let validationResponse = await this.$validator.validateAll("addressForm");
      if (!validationResponse || this.isAddressModalLoading) return;
      this.isAddressModalLoading = true;
      await this.$store.dispatch(
        "marketplace/saveAddress",
        this.addressFormData
      );
      this.$validator.reset();
      this.$refs.addressFormModal.hide();
      this.$refs.addressSelectionModal.show();

      await this._loadAddresses();
      this.shippingAddress = _.find(this.userAddresses, {
        _id: this.shippingAddress?._id,
      });
      this.billingAddress = _.find(this.userAddresses, {
        _id: this.billingAddress?._id,
      });

      this.$nextTick(() => {
        this.addressFormData = {
          fullName: null,
          street: null,
          province: null,
          city: null,
          barangay: null,
          postcode: null,
          mobileNumber: null,
          notes: null,
          label: "home",
          isDefault: false,
        };
      });
      this.isAddressModalLoading = false;
    },
    async _loadAddresses() {
      this.userAddresses = await this.$store.dispatch(
        "marketplace/getAddressesOfCurrentUser"
      );
    },
    async _loadPaymentMethods() {
      const paymentMethods = await this.$store.dispatch(
        "marketplace/paymentMethods"
      );

      this.paymentMethods = _.map(paymentMethods, (p) => ({
        label: p.title,
        value: p._id,
      }));
    },
    async showAddressSelectionModal() {
      this.$refs.addressSelectionModal.show();
    },
    async getPHAddresses() {
      const { provinces, cities, barangays } = await this.$store.dispatch(
        "marketplace/getPHAddresses",
        {
          province: this.addressFormData.province,
          city: this.addressFormData.city,
          barangay: this.addressFormData.barangay,
        }
      );
      this.provinces = provinces;
      this.cities = cities;
      this.barangays = barangays;
    },
    async showAddressFormModal() {
      this.$refs.addressSelectionModal.hide();
      this.$refs.addressFormModal.show();
      this.isAddressModalLoading = true;
      await this.getPHAddresses();
      this.isAddressModalLoading = false;
    },
    hideAddressFormModal() {
      this.$validator.reset();
      this.$refs.addressFormModal.hide();
      this.$refs.addressSelectionModal.show();
      this.$nextTick(() => {
        this.addressFormData = {
          fullName: null,
          street: null,
          province: null,
          city: null,
          barangay: null,
          postcode: null,
          mobileNumber: null,
          notes: null,
          label: "home",
          isDefault: false,
        };
      });
    },
  },
  watch: {
    shippingAddress: {
      deep: true,
      immediate: true,
      async handler(to) {
        if (!to) return;
        this.isCalculatingSF = true;

        const rates = await this.$store.dispatch(
          "marketplace/calculateShippingFee",
          { checkout: this.$route.params.id, address: to._id }
        );
        this.shippingRates = _.map(rates, (rate) => ({
          label: rate.zone.profile.name,
          name: rate.name,
          value: rate._id,
          meta: {
            cost: rate.price,
          },
        }));
        this.shippingRate = _.first(this.shippingRates)?.value || null;
        this.isCalculatingSF = false;
      },
    },
  },
};
</script>