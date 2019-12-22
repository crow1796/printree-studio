<template>
  <VueTailwindDrawer ref="drawer" width="100%">
    <div class="flex h-full w-full text-gray-600">
      <div class="flex flex-col w-full h-full">
        <div class="flex items-center justify-between border-b p-4">
          <div class="flex uppercase">
            <strong>Campaign Preview</strong>
          </div>
          <div class="flex text-right">
            <div
              class="select-none cursor-pointer w-8 h-8 border rounded-full flex justify-center items-center hover:border-gray-600 hover:text-gray-700"
              @click="hide"
            >
              <font-awesome-icon :icon="['fas', 'times']" class="text-xs" />
            </div>
          </div>
        </div>
        <div class="flex flex-grow">
          <div class="flex flex-grow flex-col p-2"></div>
          <div class="flex border-l w-3/12">
            <div class="flex flex-col w-full">
              <div class="flex p-4 uppercase border-b">
                <strong>My Products</strong>
              </div>
              <div class="flex p-4 flex-wrap">
                <div class="flex w-6/12 p-1" v-for="product in products" :key="product.id">
                  <div class="flex flex-col border rounded w-full">
                    <div class="px-2 pt-2" v-html="_placeholderOfFirstVariantOf(product)"></div>
                    <div class="px-2 pb-2 font-bold">{{ product.meta.name }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </VueTailwindDrawer>
</template>

<script>
import VueTailwindDrawer from '@/components/VueTailwindDrawer'

export default {
  props: ['products'],
  components: {
    VueTailwindDrawer
  },
  methods: {
    _placeholderOfFirstVariantOf(product) {
      const firstKey = _.first(_.keys(product.variants))
      return product.variants[firstKey][
        this._firstPrintableAreaOf(product.variants[firstKey])
      ].with_placeholder
    },
    _firstPrintableAreaOf(variant) {
      let areas = _.keys(variant)
      return _.includes(areas, 'front') ? 'front' : _.head(areas)
    },
    show() {
      this.$refs.drawer.show()
    },
    hide() {
      this.$refs.drawer.hide()
    }
  }
}
</script>