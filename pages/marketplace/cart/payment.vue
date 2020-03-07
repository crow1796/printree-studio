<template>
  <div class="relative">
    <AreaLoader v-if="isLoading" fullscreen />
    <div class="mx-auto p-16 sm:p-16 lg:px-48 bg-gray-100">
      <div class="flex-grow flex flex-col relative">
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
                  <div>{{ option.label }}</div>
                  <div class="text-xs font-normal" v-if="option.disabled">Coming Soon</div>
                </div>
              </template>
            </OptionButtons>
          </div>
        </div>

        <div class="flex justify-end p-4 items-center border-t">
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

export default {
  layout: 'marketplace',
  components: {
    OptionButtons,
    VueTailwindModal
  },
  created() {
    this.isLoading = false
    this.paymentOption = _.first(this.paymentOptions).value
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
  data() {
    return {
      isLoading: true,
      paymentOption: null,
      paymentOptions: [
        {
          label: 'Cash on Delivery',
          value: 'COD'
        },
        {
          label: 'GCASH',
          value: 'gcash',
          disabled: true
        }
      ]
    }
  },
  methods: {
    placeOrder() {}
  }
}
</script>