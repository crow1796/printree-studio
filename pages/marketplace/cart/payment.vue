<template>
  <div class="relative">
    <AreaLoader v-if="isLoading" />
    <div class="mx-auto p-16 sm:p-16 lg:px-48 bg-gray-100">
      <div v-if="isReceived">
        <div class="flex items-center justify-center flex-col flex-grow">
          <div class="text-6xl text-primary">
            <font-awesome-icon :icon="['far', 'check-circle']" />
          </div>
          <div class="font-bold uppercase text-2xl">ORDER RECEIVED!</div>
          <div class="mt-8">
            <nuxt-link
              to="/marketplace/products"
              class="border border-white bg-primary px-8 py-4 font-bold rounded text-white hover:bg-primary-lighter"
            >
              <font-awesome-icon :icon="['fas', 'shopping-bag']" />
              <span class="mx-2">Continue Shopping</span>
              <font-awesome-icon :icon="['fas', 'arrow-right']" />
            </nuxt-link>
          </div>
        </div>
      </div>
      <div class="flex-grow flex flex-col relative" v-if="!isReceived">
        <div class="flex justify-between">
          <span class="font-bold pb-4 border-b flex-grow p-4">
            <span>CHOOSE PAYMENT OPTION</span>
          </span>
        </div>
        <div class="flex-grow flex flex-col relative items-center">
          <div class="px-4 pb-4 pt-2">
            <OptionButtons :options="paymentOptions" v-model="paymentOption">
              <template v-slot:default="{option}">
                <div class="flex flex-col">
                  <div class="text-center text-4xl" v-if="option.icon">
                    <font-awesome-icon :icon="['fas', option.icon]" />
                  </div>
                  <div
                    class="text-center mb-2"
                    :class="{'opacity-25': option.disabled}"
                    v-if="option.image"
                  >
                    <img :src="option.image" class="mx-auto w-12" />
                  </div>
                  <div>{{ option.label }}</div>
                  <div class="text-xs font-normal" v-if="option.disabled">Not Available</div>
                </div>
              </template>
            </OptionButtons>
          </div>
        </div>
        <div class="flex justify-center p-4 items-center border-t">
          <PTButton color="primary" @click="placeOrder">
            <span class="mr-2">PLACE ORDER</span>
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
import SevenElevenLogo from '~/assets/images/7-eleven.png'
import GCashLogo from '~/assets/images/gcash.png'

export default {
  layout: 'marketplace',
  components: {
    OptionButtons,
    VueTailwindModal
  },
  created() {
    if(!this.$storage.getLocalStorage('order_id')){
      this.$router.replace('/marketplace/cart')
      return
    }
    this.isLoading = false
    this.paymentOption = _.first(
      _.filter(this.paymentOptions, ({ disabled }) => !disabled)
    ).value
  },
  mounted() {
    window.onbeforeunload = e => {
      e = e || window.event
      // For IE and Firefox prior to version 4
      if (e) {
        e.returnValue = 'Sure?'
      }
      // For Safari
      return 'Sure?'
    }
  },
  destroyed(){
    window.onbeforeunload = null
  },
  data() {
    return {
      isReceived: false,
      isLoading: true,
      paymentOption: null,
      paymentOptions: [
        {
          icon: 'credit-card',
          label: 'Credit or Debit Card',
          value: 'card',
          disabled: true
        },
        {
          icon: 'university',
          label: 'Online Banking',
          value: 'bank',
          disabled: true
        },
        {
          image: SevenElevenLogo,
          label: '7-Eleven',
          value: '711',
          disabled: true
        },
        {
          icon: 'truck',
          label: 'Cash on Delivery',
          value: 'COD'
        },
        {
          image: GCashLogo,
          label: 'GCASH',
          value: 'gcash',
          disabled: true
        }
      ]
    }
  },
  methods: {
    async placeOrder() {
      this.isLoading = true
      const order = this.$storage.getLocalStorage('order_id')
      await this.$store.dispatch('marketplace/placeOrder', {orderId: order, paymentMethod: this.paymentOption})
      this.$storage.removeLocalStorage('order_id')
      this.isReceived = true
      this.isLoading = false
    }
  }
}
</script>