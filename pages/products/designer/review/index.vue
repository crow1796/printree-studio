<template>
  <simplebar class="w-full h-full">
    <div class="flex p-4">
      <div class="product-item border border-white hover:border-gray-400 flex-col justify-start items-start" v-for="product in selectedProducts"
        :key="product.id">
        <ProductThumbnail :product="product"/>
        <div class="px-4 pb-4">
          <div class="px-2 text-lg">
            {{ product.name }}
          </div>
        </div>
      </div>
    </div>
  </simplebar>
</template>

<script>
import ProductThumbnail from '@/components/ProductThumbnail'
import { mapGetters } from 'vuex'

export default {
  layout: 'designer',
  components: {
    ProductThumbnail
  },
  computed: {
    ...mapGetters({
      selectedProducts: 'designer/selectedProducts'
    })
  }
}
</script>
