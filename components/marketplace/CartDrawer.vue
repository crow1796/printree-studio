<template>
  <VueTailwindDrawer ref="drawer" class="cart-drawer" position="right" :closeOnBackdropClicked="!isLoading">
    <div class="relative h-full">
      <AreaLoader v-if="isLoading" />

      <div class="mx-auto bg-gray-100 h-full">
        <div class="flex-grow flex flex-col h-full">
          <div class="flex justify-between pb-4 border-b flex-grow p-4 items-center">
            <span class="font-bold">SHOPPING CART</span>
            <div class="flex text-right">
              <div
                class="select-none cursor-pointer w-8 h-8 border rounded-full flex justify-center items-center hover:border-gray-600 hover:text-gray-700"
                @click="hide"
              >
                <font-awesome-icon :icon="['fas', 'times']" class="text-xs" />
              </div>
            </div>
          </div>

          <div class="flex flex-grow flex-col h-full bg-white overflow-auto">
            <div class="flex flex-grow-0 border-b relative px-4 py-2">
              <div class="flex items-center">
                <CustomCheckbox :checked="isSelectedAll" @change="toggleSelectAll" />
                <span
                  class="ml-2 cursor-pointer"
                  @click="toggleSelectAll"
                >{{ isSelectedAll ? 'Deselect' : "Select" }} All</span>
              </div>
            </div>
            <div
              class="flex flex-grow-0 border-b relative py-2"
              v-for="(product, i) in products"
              :key="i"
            >
              <div
                class="select-none cursor-pointer w-8 h-8 flex justify-center items-center hover:text-primary outline-none focus:outline-none absolute top-0 right-0 mr-2 mt-2"
                title="Remove from Cart"
                v-tippy="{arrow: true}"
                @click="removeProduct(product)"
              >
                <font-awesome-icon :icon="['fas', 'times']" />
              </div>

              <div class="flex w-1/12 justify-end items-center">
                <div>
                  <label class="custom-checkbox block relative cursor-pointer text-xl pl-8">
                    <input
                      class="absolute opacity-0 left-0 top-0 cursor-pointer"
                      type="checkbox"
                      :checked="isSelected(product)"
                      @change="reselectProducts({e: $event, product})"
                    />
                    <span class="h-6 w-6 checkmark absolute top-0 left-0 bg-gray-400"></span>
                  </label>
                </div>
              </div>
              <div class="w-3/12 flex-justify-between">
                <div class="w-32 mx-auto">
                  <progressive-img class="relative mx-auto" :src="product.fullThumb" style="width: 80px"/>
                </div>
              </div>
              <div class="flex flex-col w-3/12 justify-center">
                <span class="font-bold leading-none">
                  {{
                  product.productName
                  }}
                </span>
                <span class="font-bold text-gray-500">
                  {{
                  product.price.formatMoney('₱ ')
                  }}, {{ product.size }}
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
                <div class="flex flex-col">
                  <div>
                    <VueNumericInput
                      align="center"
                      style="width: 100%; height: 30px"
                      :min="1"
                      :max="product.max"
                      :value="product.quantity"
                      :disabled="isUpdatingQty"
                      @change="(e) => updateQtyOf(product, e)"
                    />
                  </div>
                  <!-- <div class="text-xs mt-1 font-bold" :class="{'text-red-600': product.max <= 10}">
                    <span v-if="product.max <= 10">Only</span>
                    {{ product.max }} stock(s) left
                  </div>-->
                </div>
              </div>
            </div>
            <div
              class="text-3xl my-12 text-gray-400 text-center font-bold"
              v-if="!products.length"
            >Your cart is empty.</div>
          </div>

          <div class="flex justify-between p-4 items-center border-t">
            <div class="flex flex-col">
              <span class="text-xs">Subtotal</span>
              <span class="font-bold text-primary">
                <number :to="subtotal" :format="(num) => num.formatMoney('₱ ')" :duration=".4" />
              </span>
            </div>
            <PTButton color="primary" :disabled="!subtotal || isUpdatingQty || isCheckingOut" @click="checkout">
              <span class="mr-2">CHECKOUT</span>
              <font-awesome-icon :icon="['fas', 'arrow-right']" />
            </PTButton>
          </div>
        </div>
      </div>
    </div>
  </VueTailwindDrawer>
</template>

<script>
import VueTailwindDrawer from "@/components/VueTailwindDrawer";
import VueNumericInput from "@/components/VueNumericInput";
import CustomCheckbox from "@/components/CustomCheckbox";
import { mapGetters } from "vuex";

export default {
  components: {
    VueTailwindDrawer,
    VueNumericInput,
    CustomCheckbox,
  },
  computed: {
    ...mapGetters({
      user: "user",
    }),
    isSelectedAll() {
      return (
        this.selectedProducts.length === this.products.length &&
        this.products.length
      );
    },
    subtotal() {
      return _.sum(
        _.map(this.selectedProducts, ({ quantity, price }) => price * quantity)
      );
    },
  },
  data() {
    return {
      isLoading: true,
      products: [],
      selectedProducts: [],
      isUpdatingQty: false,
      isCheckingOut: false
    };
  },
  methods: {
    async updateQtyOf(item, newQty) {
      if(this.isUpdatingQty) return
      this.isUpdatingQty = true;
      await this.$store.dispatch("marketplace/addToCart", {
        variant: item.variant._id,
        quantity: newQty,
        size: item.size,
        isUpdatingQty: true
      });
      item.quantity = newQty
      this.isUpdatingQty = false;
    },
    async show() {
      this.isLoading = true;
      this.$refs.drawer.show();
      await this.loadItems();
      this.isLoading = false;
    },
    hide() {
      this.$refs.drawer.hide();
      document.body.style.overflow = 'auto'
    },
    isSelected(product) {
      return _.filter(
        this.selectedProducts,
        ({ variant, size }) =>
          product.variant._id === variant._id && product.size === size
      ).length;
    },
    async loadItems() {
      this.isLoading = true;
      const cart = await this.$store.dispatch(
        "marketplace/getCartOfCurrentUser"
      );
      this.products = cart.items;
      this.selectedProducts = cart.items;
      this.isLoading = false;
    },
    async removeProduct(product) {
      if(this.isUpdatingQty) return
      this.isLoading = true;
      const cart = await this.$store.dispatch(
        "marketplace/removeItemFromCart",
        product._id
      );
      this.isLoading = false;

      if (cart?.items?.length === this.products.length) return;

      this.products = _.filter(
        this.products,
        ({ variant, size }) =>
          variant._id !== product.variant._id ||
          (variant._id === product.variant._id && size !== product.size)
      );

      this.selectedProducts = _.filter(
        this.products,
        ({ variant, size }) =>
          variant._id !== product.variant._id ||
          (variant._id === product.variant._id && size !== product.size)
      );
    },
    toggleSelectAll() {
      if (this.selectedProducts.length !== this.products.length) {
        this.selectedProducts = this.products;
        return;
      }
      this.selectedProducts = [];
    },
    reselectProducts({ e, product }) {
      if (!e.target.checked) {
        this.selectedProducts = _.filter(
          this.selectedProducts,
          ({ variant, size }) =>
            variant._id !== product.variant._id ||
            (variant._id === product.variant._id && product.size !== size)
        );
        return;
      }
      this.selectedProducts = [...this.selectedProducts, product];
    },
    async checkout() {
      if(this.isUpdatingQty || this.isCheckingOut) return
      this.isLoading = true
      this.isCheckingOut = true
      const checkout = await this.$store.dispatch('marketplace/checkout', _.map(this.selectedProducts, '_id'))

      this.hide()
      
      this.$router.replace(`/marketplace/checkout/${checkout._id}`);
      this.isCheckingOut = false
    },
  },
};
</script>