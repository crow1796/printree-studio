<template>
  <VueTailwindDrawer ref="drawer" width="60%">
    <div class="flex flex-grow flex-col relative">
      <AreaLoader v-if="isLoading" />
      <div class="flex justify-between">
        <span class="font-bold pb-4 border-b flex-grow p-4">SHOPPING CART</span>
        <div
          class="select-none absolute right-0 top-0 mr-3 mt-3 cursor-pointer w-8 h-8 border rounded-full flex justify-center items-center hover:border-gray-600 hover:text-gray-700"
          @click="$refs.drawer.hide()"
        >
          <font-awesome-icon :icon="['fas', 'times']" class="text-xs" />
        </div>
      </div>
      <div class="flex flex-grow flex-col">
        <div class="flex flex-grow-0 border-b px-4 py-6" v-for="(product, i) in products" :key="i">
          <div class="flex w-1/12 justify-end items-center">
            <div>
              <label class="custom-checkbox block relative cursor-pointer text-xl pl-8">
                <input
                  class="absolute opacity-0 left-0 top-0 cursor-pointer"
                  type="checkbox"
                  checked="checked"
                />
                <span class="h-6 w-6 checkmark absolute top-0 left-0 bg-gray-400"></span>
              </label>
            </div>
          </div>
          <div class="w-3/12 flex-justify-between">
            <div class="w-32 mx-auto">
              <progressive-img class="relative mx-auto" :src="product.thumbnail" />
            </div>
          </div>
          <div class="flex flex-col w-3/12 justify-center">
            <span class="font-bold leading-none">
              {{
              product.name
              }}
            </span>
          </div>
          <div class="flex flex-col w-2/12 justify-center">
            <span class="font-bold leading-none text-center">
              <number
                :to="(product.price * product.quantity)"
                :format="(num) => num.formatMoney('₱ ')"
                :duration=".4"
              />
            </span>
          </div>
          <div class="flex w-2/12 justify-center items-center">
            <VueNumericInput
              align="center"
              style="width: 110px; height: 30px"
              :min="1"
              v-model="product.quantity"
            />
          </div>
          <div class="flex w-1/12 justify-end items-center">
            <div>
              <div
                class="select-none cursor-pointer w-8 h-8 flex justify-center items-center hover:text-primary"
              >
                <font-awesome-icon :icon="['fas', 'times']" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-between p-4 items-center border-t">
        <div class="flex flex-col">
          <span class="text-xs">Subtotal</span>
          <span class="font-bold text-primary">
            <number :to="subtotal" :format="(num) => num.formatMoney('₱ ')" :duration=".4" />
          </span>
        </div>
        <PTButton color="primary" @click="goToCheckout">
          <span class="mr-2">CHECKOUT</span>
          <font-awesome-icon :icon="['fas', 'arrow-right']" />
        </PTButton>
      </div>
    </div>
  </VueTailwindDrawer>
</template>

<script>
import VueTailwindDrawer from '@/components/VueTailwindDrawer'
import VueNumericInput from '@/components/VueNumericInput'
import { mapGetters } from 'vuex'

export default {
  components: {
    VueTailwindDrawer,
    VueNumericInput
  },
  data() {
    return {
      products: [],
      isLoading: true
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/user'
    }),
    subtotal() {
      return _.sum(
        _.map(this.products, ({ quantity, price }) => price * quantity)
      )
    }
  },
  methods: {
    show() {
      this.$refs.drawer.show()
      this.loadItems()
    },
    async loadItems() {
      this.isLoading = true
      const cart = await this.$store.dispatch(
        'marketplace/getCartOf',
        this.user
      )
      this.products = cart.products
      this.isLoading = false
    },
    goToCheckout() {
      this.$refs.drawer.hide()
      this.$router.replace('/marketplace/checkout/shipping')
    }
  }
}
</script>