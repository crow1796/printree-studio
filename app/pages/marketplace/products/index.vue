<template>
  <div class="container mx-auto">
    <div class="font-bold text-2xl mt-6 px-8">All Products</div>
    <div class="relative min-h-area-loader">
      <AreaLoader v-if="isLoading" />
      <ProductsGrid :products="products" />
      <div class="flex flex-grow justify-center pb-6">
        <ul class="flex">
          <li class="mx-1 px-3 py-2 text-gray-800 text-sm font-semibold border px-4 py-2 rounded-lg hover:text-primary-lighter hover:border-primary-lighter bg-white text-xs cursor-pointer items-center justify-center flex">
            <a class="flex items-center font-bold" href="#">
              <font-awesome-icon :icon="['fas', 'chevron-left']"/>
            </a>
          </li>
          <li
            class="mx-1 px-3 py-2 text-gray-800 text-sm font-semibold border px-4 py-2 rounded-lg hover:text-primary-lighter hover:border-primary-lighter bg-white text-xs cursor-pointer"
          >
            <a class="font-bold" href="#">1</a>
          </li>
          <li
            class="mx-1 px-3 py-2 text-gray-800 text-sm font-semibold border px-4 py-2 rounded-lg hover:text-primary-lighter hover:border-primary-lighter bg-white text-xs cursor-pointer"
          >
            <a class="font-bold" href="#">2</a>
          </li>
          <li
            class="mx-1 px-3 py-2 text-gray-800 text-sm font-semibold border px-4 py-2 rounded-lg hover:text-primary-lighter hover:border-primary-lighter bg-white text-xs cursor-pointer"
          >
            <a class="font-bold" href="#">3</a>
          </li>
          <li
            class="mx-1 px-3 text-gray-800 text-sm font-semibold border px-4 py-2 rounded-lg hover:text-primary-lighter hover:border-primary-lighter bg-white text-xs cursor-pointer items-center justify-center flex"
          >
            <a class="flex items-center font-bold" href="#">
              <font-awesome-icon :icon="['fas', 'chevron-right']"/>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import ProductsGrid from '@/components/ProductsGrid'

export default {
  layout: 'marketplace',
  components: {
    ProductsGrid
  },
  async mounted() {
    this.products = await this.$store.dispatch('marketplace/getProductsToSell')
    this.isLoading = false
  },
  data() {
    return {
      isLoading: true,
      products: []
    }
  }
}
</script>