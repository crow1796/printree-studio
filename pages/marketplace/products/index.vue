<template>
  <div class="container mx-auto">
    <div class="font-bold text-2xl mt-6 px-8">
      All Products
    </div>
    <div class="relative">
      <AreaLoader v-if="isLoading"/>
      <ProductsGrid :products="products"/>
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
  async created(){
    this.products = await this.$store.dispatch('marketplace/getProductsToSell')
    this.isLoading = false
  },
  data(){
    return {
      isLoading: true,
      products: []
    }
  }
}
</script>