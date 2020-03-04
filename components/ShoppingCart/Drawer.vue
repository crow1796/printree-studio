<template>
  <VueTailwindDrawer ref="drawer" width="60%" :closeOnBackdropClicked="closeOnBackdropClicked">
    <div class="flex flex-grow flex-col relative">
      <AreaLoader v-if="isLoading" />
      <Cart
        v-if="view === 'cart'"
        :selectedProducts="selectedProducts"
        :products="products"
        @reselectProducts="reselectProducts"
        @goToCheckout="goToCheckout"
        @removeProduct="removeProduct"
        @hide="$refs.drawer.hide()"
      />
      <Checkout v-if="view === 'checkout'" :products="selectedProducts" @back="backTo('cart', true)" />
    </div>
  </VueTailwindDrawer>
</template>

<script>
import Cart from '@/components/ShoppingCart/Cart'
import VueTailwindDrawer from '@/components/VueTailwindDrawer'
import Checkout from '@/components/ShoppingCart/Checkout'
import { mapGetters } from 'vuex'

export default {
  components: {
    VueTailwindDrawer,
    Cart,
    Checkout
  },
  data() {
    return {
      products: [],
      isLoading: true,
      selectedProducts: [],
      view: 'cart',
      closeOnBackdropClicked: true
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/user'
    })
  },
  methods: {
    backTo(view, closeOnBackdropClicked) {
      this.view = view
      this.closeOnBackdropClicked = closeOnBackdropClicked
    },
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
      this.selectedProducts = cart.products
      this.isLoading = false
    },
    goToCheckout() {
      if (!this.selectedProducts.length) return
      this.view = 'checkout'
      this.closeOnBackdropClicked = false
      // this.$refs.drawer.hide()
      // this.$router.replace('/marketplace/checkout/shipping')
    },
    removeProduct(product) {
      this.products = _.filter(
        this.products,
        ({ variantId }) => variantId != product.variantId
      )
      this.selectedProducts = _.filter(
        this.selectedProducts,
        ({ variantId }) => variantId != product.variantId
      )
    },
    reselectProducts({ e, product }) {
      if (!e.target.checked) {
        this.selectedProducts = _.filter(
          this.selectedProducts,
          ({ variantId }) => variantId != product.variantId
        )
        return
      }
      this.selectedProducts = [...this.selectedProducts, product]
    }
  }
}
</script>