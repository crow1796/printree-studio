<template>
  <simplebar class="h-full w-full relative">
    <AreaLoader v-if="isLoading"/>
    <div class="flex flex-wrap p-4">
      <div class="flex w-1/3 p-1"
        v-for="(product, index) in availableProducts"
        :key="index"
        @click="toggleProduct(product)">
        <div class="select-product flex border flex-grow rounded cursor-pointer select-none"
          :class="{ 'border-primary hover:border-primary-lighter': _hasBeenSelected(product), 'hover:border-gray-500': !_hasBeenSelected(product) }">
          <div class="flex w-1/3 product-thumb p-4 items-center justify-center">
            <img :src="_firstVariantPlaceholderOf(product)"
              class="w-full"/>
          </div>
          <div class="flex flex-grow flex-col product-desc p-4 relative"
            :class="{ 'text-primary hover:text-primary-lighter': _hasBeenSelected(product) }">
            <div class="font-bold text-lg mb-4">
              {{ product.name }}
            </div>
            <div class="flex flex-col">
              <div class="flex py-1 items-center">
                <font-awesome-icon :icon="['fas', 'tag']"/>
                <div class="pl-2">
                  Sizes - {{ _availableSizesOf(product) }}
                </div>
              </div>
              <div class="flex py-1 items-center">
                <font-awesome-icon :icon="['far', 'circle']"/>
                <div class="pl-2 cursor-help">
                  <span class="border-b border-dashed hover:border-gray-500">
                    {{ product.availableVariants.length }} Variants
                  </span>
                </div>
              </div>
            </div>
            <div class="absolute outline-none focus:outline-none bg-white select-icon rounded-full border w-10 flex h-10 items-center justify-center"
              :class="{ 'border-primary hover:border-primary-lighter hover:text-primary-lighter text-primary': _hasBeenSelected(product) }"
              style="right: 10px; bottom: 10px;">
              <font-awesome-icon :icon="['fas', _hasBeenSelected(product) ? 'check' : 'plus']"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </simplebar>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  async created(){
    this.isLoading = true
    await this.$store.dispatch('designer/fetchAvailableProducts')
    this.isLoading = false
    this.tmpProducts = JSON.parse(JSON.stringify(this.selectedProducts))
  },
  data(){
    return {
      tmpProducts: [],
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      availableProducts: 'designer/availableProducts',
      selectedProducts: 'designer/selectedProducts'
    })
  },
  methods: {
    toggleProduct(product){
      if(this._hasBeenSelected(product)){
        if(this.tmpProducts.length == 1) return
        let index = _.findIndex(this.tmpProducts, { id: product.id })
        this.tmpProducts.splice(index, 1)
        this.$emit('selected', this.tmpProducts)
        return
      }
      product = JSON.parse(JSON.stringify(product))
      this.tmpProducts.push(product)
      this.$emit('selected', this.tmpProducts)
    },
    _firstVariantPlaceholderOf(product){
      if(!product.availableVariants.length) return
      let firstSide = (_.keys(product.availableVariants[0].printable_area))[0]
      return product.availableVariants[0].printable_area[firstSide].placeholder
    },
    _availableSizesOf(product){
      if(!product.availableVariants.length) return
      let sizeNames = _.map(product.availableVariants[0].sizes, 'name')
      return sizeNames.join(', ')
    },
    _hasBeenSelected(product){
      return _.find(this.tmpProducts, { id: product.id })
    }
  }
}
</script>

<style lang="scss" scoped>
  .thumbnail:not([lazy="loaded"]){
    width: 16px;
    height: 16px;
  }
</style>
