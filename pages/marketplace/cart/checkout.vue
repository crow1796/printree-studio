<template>
  <div class="relative">
    <AreaLoader v-if="isLoading" fullscreen />
    <div class="mx-auto p-16 sm:p-16 lg:px-48 bg-gray-100">
      <div class="flex-grow flex flex-col relative">
        <VueTailwindModal
          ref="addressSelectionModal"
          width="40%"
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
                class="flex flex-col px-4 py-5 border rounded cursor-pointer hover:border-primary hover:text-primary mb-4"
                v-for="address in userAddresses"
                :key="address.id"
                @click="selectAddress(address)"
              >
                <div class="flex justify-between items-end">
                  <div class="font-bold">{{ address.fullname }}</div>
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
                <div class="font-normal">{{ address.mobile_number }}</div>
                <div
                  class="font-normal"
                >{{ `${address.house_number}, ${address.barangay.brgyDesc}, ${address.city.citymunDesc}, ${address.province.provDesc}` }}</div>
                <div class="font-normal" v-if="address.notes">{{ address.notes }}</div>
              </div>
            </div>
          </div>
        </VueTailwindModal>
        <VueTailwindModal
          ref="addressFormModal"
          width="40%"
          content-class="rounded-none shadow-none text-gray-600"
          :backdrop="false"
        >
          <div class="flex flex-col relative">
            <AreaLoader v-if="isAddressModalLoading" />
            <div class="modal-heading border-b w-full p-4">
              <div class="flex justify-between w-full items-center">
                <div class="flex uppercase justify-between flex-grow">
                  <strong>{{ addressFormData.id ? 'Update' : 'Add an' }} Address</strong>
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
                    name="fullname"
                    class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                    type="text"
                    :class="{ 'border-red-400': errors.has('addressForm.fullname'), 'focus:border-gray-600': !errors.has('addressForm.fullname') }"
                    placeholder="Your Name"
                    v-model="addressFormData.fullname"
                    data-vv-as="Full Name"
                    v-validate="'required'"
                    data-vv-scope="addressForm"
                  />
                </div>
                <span
                  class="text-red-700 text-xs pt-1 font-bold inline-block"
                  v-if="errors.has('addressForm.fullname')"
                >{{ errors.first('addressForm.fullname') }}</span>
              </div>
              <div class="mb-3">
                <div>
                  <input
                    name="house_number"
                    class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                    type="text"
                    :class="{ 'border-red-400': errors.has('addressForm.house_number'), 'focus:border-gray-600': !errors.has('addressForm.house_number') }"
                    placeholder="Your House Number, Building and Street Name"
                    v-model="addressFormData.house_number"
                    data-vv-as="House Number, Building and Street Name"
                    v-validate="'required'"
                    data-vv-scope="addressForm"
                  />
                </div>
                <span
                  class="text-red-700 text-xs pt-1 font-bold inline-block"
                  v-if="errors.has('addressForm.house_number')"
                >{{ errors.first('addressForm.house_number') }}</span>
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
                      :value="province"
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
                      :value="city"
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
                      :value="brgy"
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
                    name="mobile_number"
                    class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                    type="text"
                    :class="{ 'border-red-400': errors.has('addressForm.mobile_number'), 'focus:border-gray-600': !errors.has('addressForm.mobile_number') }"
                    placeholder="Your Mobile Number"
                    v-model="addressFormData.mobile_number"
                    data-vv-as="Mobile Number"
                    v-validate="'required|numeric'"
                    data-vv-scope="addressForm"
                  />
                </div>
                <span
                  class="text-red-700 text-xs pt-1 font-bold inline-block"
                  v-if="errors.has('addressForm.mobile_number')"
                >{{ errors.first('addressForm.mobile_number') }}</span>
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
              <!-- <div class="mb-3 flex items-center">
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
                <label for="is_default" class="font-bold">
                  <input type="checkbox" name="is_default" id="is_default" v-model="addressFormData.is_default" />
                  Make this my default address
                </label>
                <span
                  class="text-red-700 text-xs pt-1 font-bold inline-block"
                  v-if="errors.has('is_default')"
                >{{ errors.first('is_default') }}</span>
              </div>-->
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
        <div class="flex justify-between">
          <span class="font-bold pb-4 border-b flex-grow p-4">
            <span>CHECKOUT</span>
          </span>
        </div>
        <div class="flex flex-col flex-grow overflow-auto">
          <div class="border-b">
            <div class="uppercase font-bold pb-4 border-b p-4">Choose your Delivery Option</div>
            <div class="px-4 pb-4 pt-2">
              <OptionButtons :options="deliveryOptions" v-model="deliveryOption">
                <template v-slot:default="{option}">
                  <div class="flex flex-col">
                    <div>{{ option.meta.cost.formatMoney('₱ ') }}</div>
                    <div class="text-xs font-normal">{{ option.label }}</div>
                    <div class="text-xs font-normal">Est. Arrival: {{ option.meta.est }}</div>
                  </div>
                </template>
              </OptionButtons>
            </div>
          </div>
          <div class="font-bold uppercase p-4 border-b">ITEMS</div>
          <div class="flex flex-col flex-grow overflow-auto">
            <div
              class="flex flex-grow-0 border-b px-4 py-2"
              v-for="(product, i) in products"
              :key="i"
            >
              <div class="w-2/12 flex-justify-between">
                <div class="w-16 mx-auto">
                  <progressive-img class="relative mx-auto" :src="product.thumbnail" />
                </div>
              </div>
              <div class="flex flex-col w-4/12 justify-center">
                <span class="font-bold leading-none">
                  {{
                  product.name
                  }}
                </span>
                <span class="font-bold text-gray-500">
                  {{
                  product.price.formatMoney('₱ ')
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
          <div class="font-bold uppercase p-4 border-b border-t">ADDRESS</div>
          <div class="flex flex-col py-4">
            <div class="flex">
              <div class="flex w-6/12 flex-col">
                <div
                  class="flex flex-col p-4 border rounded border-dashed mx-2 cursor-pointer hover:border-primary hover:text-primary bg-white"
                  @click="selectAddressFor('shipping')"
                >
                  <div
                    class="font-bold uppercase text-sm mb-2 text-gray-600 flex items-center justify-between"
                  >
                    <div>Shipping Address</div>
                  </div>
                  <div v-if="shippingAddress">
                    <div class="font-bold">{{ shippingAddress.fullname }}</div>
                    <div class="font-normal">{{ shippingAddress.mobile_number }}</div>
                    <div
                      class="font-normal"
                    >{{ `${shippingAddress.house_number}, ${shippingAddress.barangay.brgyDesc}, ${shippingAddress.city.citymunDesc}, ${shippingAddress.province.provDesc}` }}</div>
                    <div
                      class="font-normal"
                      v-if="shippingAddress.notes"
                    >{{ shippingAddress.notes }}</div>
                  </div>
                  <div class="font-bold" v-else>CHOOSE AN ADDRESS</div>
                </div>
                <span
                  class="text-red-700 text-xs pl-2 pt-1 font-bold inline-block"
                  v-if="shippingAddressError"
                >{{ shippingAddressError }}</span>
              </div>
              <div class="flex w-6/12 flex-col">
                <div
                  class="flex flex-col p-4 border rounded border-dashed mx-4 cursor-pointer hover:border-primary hover:text-primary bg-white"
                  @click="selectAddressFor('billing')"
                >
                  <div
                    class="font-bold uppercase text-sm mb-2 text-gray-600 flex justify-between items-center"
                  >
                    <div>Billing Address</div>
                  </div>
                  <div v-if="billingAddress">
                    <div class="font-bold">{{ billingAddress.fullname }}</div>
                    <div class="font-normal">{{ billingAddress.mobile_number }}</div>
                    <div
                      class="font-normal"
                    >{{ `${billingAddress.house_number}, ${billingAddress.barangay.brgyDesc}, ${billingAddress.city.citymunDesc}, ${billingAddress.province.provDesc}` }}</div>
                    <div class="font-normal" v-if="billingAddress.notes">{{ billingAddress.notes }}</div>
                  </div>
                  <div class="font-bold" v-else>CHOOSE AN ADDRESS</div>
                </div>
                <span
                  class="text-red-700 text-xs pl-4 pt-1 font-bold inline-block"
                  v-if="billingAddressError"
                >{{ billingAddressError }}</span>
              </div>
            </div>
            <div class="flex mt-4 pt-4 border-t">
              <div class="flex flex-grow mx-4 flex-col">
                <span class="uppercase font-bold text-xs mb-1">Phone Number</span>
                <div class="flex">
                  <input
                    type="text"
                    placeholder="Enter Your Phone Number"
                    class="px-6 py-2 rounded outline-none border mr-4 flex-grow flex"
                    v-model="contactNumber"
                    name="contact_number"
                    :class="{ 'border-red-400': errors.has('contact_number'), 'focus:border-gray-600': !errors.has('contact_number') }"
                    data-vv-as="Phone Number"
                    v-validate="'required|numeric'"
                  />
                </div>
                <span
                  class="text-red-700 text-xs pt-1 font-bold inline-block"
                  v-if="errors.has('contact_number')"
                >{{ errors.first('contact_number') }}</span>
              </div>
              <div class="flex flex-grow flex-col">
                <span class="uppercase font-bold text-xs mb-1">Email Address</span>
                <div class="flex">
                  <input
                    type="email"
                    placeholder="Enter Your Email Address"
                    class="px-6 py-2 rounded outline-none border mr-4 flex-grow flex"
                    v-model="contactEmail"
                    name="contact_email"
                    :class="{ 'border-red-400': errors.has('contact_email'), 'focus:border-gray-600': !errors.has('contact_email') }"
                    data-vv-as="Email"
                    v-validate="'required|email'"
                  />
                </div>
                <span
                  class="text-red-700 text-xs pt-1 font-bold inline-block"
                  v-if="errors.has('contact_email')"
                >{{ errors.first('contact_email') }}</span>
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
            <span class="text-xs">Total</span>
            <span class="font-bold text-primary leading-none my-1">
              <number :to="total" :format="(num) => num.formatMoney('₱ ')" :duration=".4" />
            </span>
            <span class="text-xs text-gray-500">VAT included, where applicable</span>
          </div>
          <PTButton color="primary" :disabled="!total" @click="confirmOrder">
            <span class="mr-2">PROCEED TO PAYMENT</span>
            <font-awesome-icon :icon="['fas', 'arrow-right']" />
          </PTButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OptionButtons from '@/components/OptionButtons'
import VueTailwindModal from '@/components/VueTailwindModal'
import { mapGetters } from 'vuex'
import { validate } from 'vee-validate'

export default {
  layout: 'marketplace',
  components: {
    OptionButtons,
    VueTailwindModal
  },
  created() {
    this.deliveryOption = _.first(this.deliveryOptions).value
  },
  data() {
    return {
      isLoading: false,
      products: [],
      selectingAddressFor: null,
      userAddresses: [],
      shippingAddressError: null,
      billingAddressError: null,
      addressLabels: [
        {
          label: 'Home',
          value: 'Home'
        },
        {
          label: 'Office',
          value: 'Office'
        }
      ],
      provinces: [],
      cities: [],
      barangays: [],
      isAddressModalLoading: false,
      voucherCode: null,
      deliveryOption: null,
      shippingAddress: null,
      billingAddress: null,
      contactNumber: null,
      contactEmail: null,
      addressFormData: {
        id: null,
        fullname: null,
        house_number: null,
        province: null,
        city: null,
        barangay: null,
        mobile_number: null,
        notes: null,
        label: null,
        is_default: false
      },
      deliveryOptions: [
        {
          label: 'Standard Delivery',
          value: 'standard',
          meta: {
            cost: 45,
            est: 'Feb. 5 - Feb. 10'
          }
        },
        {
          label: 'Express Delivery',
          value: 'express',
          meta: {
            cost: 105,
            est: 'Feb. 5 - Feb. 10'
          }
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      user: 'user'
    }),
    subtotal() {
      return _.sum(
        _.map(this.products, ({ quantity, price }) => quantity * price)
      )
    },
    total() {
      if (!this.deliveryOption) return this.subtotal
      return this.subtotal + this.deliveryOptionValue
    },
    deliveryOptionValue() {
      const option = _.find(this.deliveryOptions, { value: this.deliveryOption })
      if(!option) return 0
      return option.meta.cost
    }
  },
  methods: {
    async confirmOrder() {
      this.billingAddressError = null
      this.shippingAddressError = null
      if (!this.billingAddress)
        this.billingAddressError = 'Billing address is required.'
      if (!this.shippingAddress)
        this.shippingAddressError = 'Shipping address is required.'
      let validationResponse = await this.$validator.validateAll()
      if (
        !validationResponse ||
        this.billingAddressError ||
        this.shippingAddressError ||
        this.isLoading
      )
        return
      this.isLoading = true

      const order = await this.$store.dispatch('marketplace/confirmOrderFor', {
        user: this.user,
        products: _.map(this.products, ({id, quantity}) => ({id, quantity})),
        contact: {
          shipping_address: this.shippingAddress,
          billing_address: this.billingAddress,
          contact_number: this.contactNumber,
          contact_email: this.contactEmail
        },
        total: this.total
      })
      this.$storage.setLocalStorage('order_id', order.id)
      this.$router.replace('/marketplace/cart/payment')
    },
    selectAddress(address) {
      switch (this.selectingAddressFor) {
        case 'shipping':
          this.shippingAddress = address
          break
        case 'billing':
          this.billingAddress = address
          break
      }
      this.$refs.addressSelectionModal.hide()
    },
    selectAddressFor(address) {
      this.selectingAddressFor = address
      this.showAddressSelectionModal()
    },
    async editAddress(address) {
      this.addressFormData = address
      this.$refs.addressSelectionModal.hide()
      this.$refs.addressFormModal.show()
      this.isAddressModalLoading = true
      await this.getPHAddresses()
      this.isAddressModalLoading = false
    },
    async saveAddress() {
      let validationResponse = await this.$validator.validateAll('addressForm')
      if (!validationResponse || this.isAddressModalLoading) return
      this.isAddressModalLoading = true
      const address = await this.$store.dispatch('marketplace/saveAddress', {
        ...this.addressFormData,
        user_id: this.user.uid
      })
      this.$validator.reset()
      this.$refs.addressFormModal.hide()
      this.$refs.addressSelectionModal.show()
      this.$nextTick(() => {
        this.userAddresses = [...this.userAddresses, address]
        this.addressFormData = {
          fullname: null,
          house_number: null,
          province: null,
          city: null,
          postcode: null,
          mobile_number: null,
          notes: null,
          label: null,
          is_default: false
        }
      })
      this.isAddressModalLoading = false
    },
    async showAddressSelectionModal() {
      this.isAddressModalLoading = true
      this.$refs.addressSelectionModal.show()
      this.userAddresses = await this.$store.dispatch(
        'marketplace/getAddressesOf',
        this.user.uid
      )
      this.isAddressModalLoading = false
    },
    async getPHAddresses() {
      const { provinces, cities, barangays } = await this.$store.dispatch(
        'marketplace/getPHAddresses',
        {
          province: this.addressFormData.province
            ? this.addressFormData.province.provCode
            : '',
          city: this.addressFormData.city
            ? this.addressFormData.city.citymunCode
            : '',
          barangay: this.addressFormData.barangay
            ? this.addressFormData.barangay.brgyCode
            : ''
        }
      )
      this.provinces = provinces
      this.cities = cities
      this.barangays = barangays
    },
    async showAddressFormModal() {
      this.$refs.addressSelectionModal.hide()
      this.$refs.addressFormModal.show()
      this.isAddressModalLoading = true
      await this.getPHAddresses()
      this.isAddressModalLoading = false
    },
    hideAddressFormModal() {
      this.$validator.reset()
      this.$refs.addressFormModal.hide()
      this.$refs.addressSelectionModal.show()
      this.$nextTick(() => {
        this.addressFormData = {
          fullname: null,
          house_number: null,
          province: null,
          city: null,
          postcode: null,
          mobile_number: null,
          notes: null,
          label: null,
          is_default: false
        }
      })
    }
  }
}
</script>