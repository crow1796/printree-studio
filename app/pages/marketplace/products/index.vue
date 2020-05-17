<template>
  <div class="container mx-auto">
    <div class="font-bold text-2xl mt-6 mb-2 px-8">All Products</div>
    <div class="relative min-h-area-loader">
      <AreaLoader v-if="isLoading" />
      <ProductsGrid :products="products" />
      <div class="flex flex-grow justify-center pb-6 mt-4">
        <ul class="flex">
          <li class="mx-1 px-3 py-2 text-sm font-semibold border px-6 py-4 rounded-lg text-xs items-center justify-center flex" :class="{
            'hover:text-primary-lighter hover:border-primary-lighter bg-white cursor-pointer text-gray-800': page.currentPage > 1, 'opacity-50': page.currentPage === 1
          }" @click="previous">
            <span class="flex items-center font-bold">
              <font-awesome-icon :icon="['fas', 'chevron-left']"/>
            </span>
          </li>
          <li
            class="mx-1 px-3text-sm font-semibold border px-6 py-4 rounded-lg text-xs items-center justify-center flex" :class="{ 'hover:text-primary-lighter hover:border-primary-lighter bg-white cursor-pointer text-gray-800': page.currentPage < totalNumberOfPages, 'opacity-50': page.currentPage === totalNumberOfPages }" @click="next"
          >
            <span class="flex items-center font-bold">
              <font-awesome-icon :icon="['fas', 'chevron-right']"/>
            </span>
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
    this._loadItems()
  },
  data() {
    return {
      previousFirstItem: null,
      lastItem: null,
      firstItem: null,
      isLoading: true,
      products: [],
      totalNumberOfPages: 3,
      page: {
        perPage: 2,
        currentPage: 1
      }
    }
  },
  methods: {
    async next(){
      if(this.page.currentPage === this.totalNumberOfPages) return
      this.page.currentPage = this.page.currentPage + 1
      this._loadItems(1)
    },
    async previous(){
      if(this.page.currentPage === 1) return
      this.page.currentPage = this.page.currentPage - 1
      this._loadItems(-1)
    },
    async _loadItems(step = 0){
      this.isLoading = true
      const res = await this.$store.dispatch('marketplace/getProductsToSell', { per_page: this.page.perPage, last_item: this.lastItem, first_item: this.firstItem, step })
      this.products = res.data
      if(res.page){
        this.firstItem = res.page.first
        this.lastItem = res.page.last
      }
      this.isLoading = false
    }
  }
}
</script>