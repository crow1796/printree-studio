<template>
  <div class="flex-grow flex flex-col">
    <VueTailwindModal
      ref="addressSelectionModal"
      width="35%"
      content-class="rounded-none shadow-none text-gray-600"
      :backdrop="false"
    >
      <div class="flex flex-col relative">
        <AreaLoader v-if="addressFormLoading" />
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
        <div class="modal-body p-4">
          <div
            class="flex flex-col p-8 border rounded border-dashed cursor-pointer hover:border-primary hover:text-primary items-center justify-center mb-4"
            @click="showAddressFormModal"
          >
            <div class="font-bold">ADD A NEW ADDRESS</div>
          </div>
          <div
            class="flex flex-col px-4 py-5 border rounded cursor-pointer hover:border-primary hover:text-primary"
          >
            <div class="font-bold">Joshua Tundag</div>
            <div class="font-normal">Puerto, Purok 4, Cagayan de Oro City, Misamis Oriental</div>
          </div>
        </div>
        <!-- <div class="flex modal-footer justify-between flex-shrink p-4 border-t items-center">
          <button
            type="button"
            class="justify-center items-center focus:outline-none outline-none border px-3 py-2 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
          >Cancel</button>

          <button
            type="button"
            class="shadow-xl border border-white bg-primary px-8 py-2 font-bold rounded text-white hover:bg-primary-lighter"
          >SAVE</button>
        </div>-->
      </div>
    </VueTailwindModal>
    <VueTailwindModal
      ref="addressFormModal"
      width="35%"
      content-class="rounded-none shadow-none text-gray-600"
      :backdrop="false"
    >
      <div class="flex flex-col">
        <div class="modal-heading border-b w-full p-4">
          <div class="flex justify-between w-full items-center">
            <div class="flex uppercase justify-between flex-grow">
              <strong>Add an Address</strong>
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
            <label for="fullname" class="font-bold">Full Name</label>
            <div>
              <input
                name="fullname"
                class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                type="text"
                :class="{ 'border-red-400': errors.has('fullname'), 'focus:border-gray-600': !errors.has('fullname') }"
                placeholder="Your Name"
                v-model="addressFormData.fullname"
                data-vv-as="Full Name"
                v-validate="'required'"
              />
            </div>
            <span
              class="text-red-700 text-xs pt-1 font-bold inline-block"
              v-if="errors.has('fullname')"
            >{{ errors.first('fullname') }}</span>
          </div>
          <div class="mb-3">
            <label for="address" class="font-bold">Address</label>
            <div>
              <input
                name="address"
                class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                type="text"
                :class="{ 'border-red-400': errors.has('address'), 'focus:border-gray-600': !errors.has('address') }"
                placeholder="Your Address"
                v-model="addressFormData.address"
                data-vv-as="Address"
                v-validate="'required'"
              />
            </div>
            <span
              class="text-red-700 text-xs pt-1 font-bold inline-block"
              v-if="errors.has('address')"
            >{{ errors.first('address') }}</span>
          </div>
          <div class="mb-3">
            <label for="province" class="font-bold">Province</label>
            <div>
              <select
                name="province"
                class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                type="text"
                :class="{ 'border-red-400': errors.has('province'), 'focus:border-gray-600': !errors.has('province') }"
                placeholder="Your Province"
                v-model="addressFormData.province"
                data-vv-as="Province"
                v-validate="'required'"
              >
                <option :value="null">Select Province</option>
                <option
                  v-for="province in provinces"
                  :key="province.i"
                  :value="null"
                >{{ province.provDesc }}</option>
              </select>
            </div>
            <span
              class="text-red-700 text-xs pt-1 font-bold inline-block"
              v-if="errors.has('province')"
            >{{ errors.first('province') }}</span>
          </div>
          <div class="mb-3">
            <label for="city" class="font-bold">City</label>
            <div>
              <select
                name="city"
                class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                type="text"
                :class="{ 'border-red-400': errors.has('city'), 'focus:border-gray-600': !errors.has('city') }"
                placeholder="Your City"
                v-model="addressFormData.city"
                data-vv-as="City"
                v-validate="'required'"
              >
                <option :value="null">Select City</option>
              </select>
            </div>
            <span
              class="text-red-700 text-xs pt-1 font-bold inline-block"
              v-if="errors.has('city')"
            >{{ errors.first('city') }}</span>
          </div>
          <div class="mb-3">
            <label for="barangay" class="font-bold">Barangay</label>
            <div>
              <select
                name="barangay"
                class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                type="text"
                :class="{ 'border-red-400': errors.has('barangay'), 'focus:border-gray-600': !errors.has('barangay') }"
                placeholder="Your Barangay"
                v-model="addressFormData.barangay"
                data-vv-as="Barangay"
                v-validate="'required'"
              >
                <option :value="null">Select Barangay</option>
              </select>
            </div>
            <span
              class="text-red-700 text-xs pt-1 font-bold inline-block"
              v-if="errors.has('barangay')"
            >{{ errors.first('barangay') }}</span>
          </div>
          <div class="mb-3">
            <label for="barangay" class="font-bold">Other Notes</label>
            <div>
              <textarea
                class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                type="text"
                placeholder="Your Other Notes"
                v-model="addressFormData.barangay"
                data-vv-as="Other Notes"
                v-validate="'required'"
              />
            </div>
            <span
              class="text-red-700 text-xs pt-1 font-bold inline-block"
              v-if="errors.has('barangay')"
            >{{ errors.first('barangay') }}</span>
          </div>
        </div>
        <div class="flex modal-footer justify-between flex-shrink p-4 border-t items-center">
          <button
            type="button"
            class="justify-center items-center focus:outline-none outline-none border px-3 py-2 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
            @click="hideAddressFormModal"
          >Cancel</button>

          <button
            type="button"
            class="shadow-xl border border-white bg-primary px-8 py-2 font-bold rounded text-white hover:bg-primary-lighter"
          >SAVE</button>
        </div>
      </div>
    </VueTailwindModal>
    <div class="flex justify-between">
      <span class="font-bold pb-4 border-b flex-grow p-4">
        <span class="mr-4 cursor-pointer">
          <font-awesome-icon :icon="['fas', 'arrow-left']" @click="$emit('back')" />
        </span>
        <span>CHECKOUT</span>
      </span>
    </div>
    <div class="flex flex-grow flex-col">
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
      <div class="flex flex-col flex-grow overflow-auto" style="max-height: 200px;">
        <div class="flex flex-grow-0 border-b px-4 py-2" v-for="(product, i) in products" :key="i">
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
          <div
            class="flex w-6/12 flex-col p-4 border rounded border-dashed mx-2 cursor-pointer hover:border-primary hover:text-primary"
            @click="showAddressSelectionModal"
          >
            <div
              class="font-bold uppercase text-sm mb-2 text-gray-600 flex items-center justify-between"
            >
              <div>Shipping Address</div>
            </div>
            <div v-if="shippingAddress">
              <div class="font-bold">Joshua Tundag</div>
              <div class="font-normal">Puerto, Purok 4, Cagayan de Oro City, Misamis Oriental</div>
            </div>
            <div class="font-bold" v-else>CHOOSE AN ADDRESS</div>
          </div>
          <div
            class="flex w-6/12 flex-col p-4 border rounded border-dashed mx-4 cursor-pointer hover:border-primary hover:text-primary"
          >
            <div
              class="font-bold uppercase text-sm mb-2 text-gray-600 flex justify-between items-center"
            >
              <div>Billing Address</div>
            </div>
            <div v-if="billingAddress">
              <div class="font-bold">Joshua Tundag</div>
              <div class="font-normal">Puerto, Purok 4, Cagayan de Oro City, Misamis Oriental</div>
            </div>
            <div class="font-bold" v-else>CHOOSE AN ADDRESS</div>
          </div>
        </div>
        <div class="flex mt-4 pt-4 border-t">
          <div class="flex flex-grow mx-4 flex-col">
            <span class="uppercase font-bold text-xs mb-1">Phone Number</span>
            <input
              type="text"
              placeholder="Enter Your Phone Number"
              class="px-6 py-2 rounded outline-none border mr-4"
            />
          </div>
          <div class="flex flex-grow flex-col">
            <span class="uppercase font-bold text-xs mb-1">Email Address</span>
            <input
              type="email"
              placeholder="Enter Your Email Address"
              class="px-6 py-2 rounded outline-none border mr-4"
            />
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
      <PTButton color="primary" :disabled="!total" @click="placeOrder">
        <span class="mr-2">PLACE ORDER</span>
        <font-awesome-icon :icon="['fas', 'arrow-right']" />
      </PTButton>
    </div>
  </div>
</template>

<script>
import OptionButtons from '@/components/OptionButtons'
import VueTailwindModal from '@/components/VueTailwindModal'

export default {
  components: {
    OptionButtons,
    VueTailwindModal
  },
  props: {
    products: { type: Array, default: () => [] }
  },
  created() {
    this.deliveryOption = _.first(this.deliveryOptions).value
  },
  data() {
    return {
      provinces: [],
      cities: [],
      barangays: [],
      addressFormLoading: false,
      voucherCode: null,
      deliveryOption: null,
      shippingAddress: null,
      billingAddress: null,
      addressFormData: {
        fullname: null,
        address: null,
        province: null,
        city: null,
        barangay: null,
        mobileNumber: null,
        notes: null,
        label: null,
        isDefault: false
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
      return _.find(this.deliveryOptions, { value: this.deliveryOption }).meta
        .cost
    }
  },
  methods: {
    placeOrder() {},
    showAddressSelectionModal() {
      this.$refs.addressSelectionModal.show()
    },
    async showAddressFormModal() {
      this.$refs.addressSelectionModal.hide()
      this.$refs.addressFormModal.show()
      this.addressFormLoading = true
      const { provinces } = await this.$store.dispatch(
        'marketplace/getAddresses'
      )
      this.provinces = provinces
    },
    hideAddressFormModal() {
      this.$refs.addressFormModal.hide()
      this.addressFormData = {
        fullname: null,
        address: null,
        province: null,
        city: null,
        postcode: null,
        mobileNumber: null,
        notes: null,
        label: null,
        isDefault: false
      }
      this.$refs.addressSelectionModal.show()
    }
  }
}
</script>