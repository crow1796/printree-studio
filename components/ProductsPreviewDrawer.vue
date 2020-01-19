<template>
  <VueTailwindDrawer ref="drawer" width="100%">
    <div class="flex h-full w-full text-gray-600 overflow-hidden">
      <div class="flex flex-col w-full h-full">
        <div class="flex items-center justify-between border-b p-4">
          <div class="flex uppercase">
            <strong>Collection Preview</strong>
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
          <div class="flex flex-col overflow-auto w-9/12">
            <div class="flex flex-grow p-4">
              <div class="large-thumbnail w-6/12 flex flex-col">
                <div
                  v-html="
                    selectedProduct.variants[selectedVariantKey][
                      _firstPrintableAreaOf(
                        selectedProduct.variants[selectedVariantKey]
                      )
                    ].with_placeholder
                  "
                ></div>
                <div class="variants flex">
                  <div
                    class="flex w-1/5 cursor-pointer border border-transparent hover:border-gray-500 p-1 rounded mr-1"
                    v-for="(variant, vid) in selectedProduct.variants"
                    :class="{
                      'border-gray-500 shadow-xl': selectedVariantKey === vid
                    }"
                    :key="variant.id"
                    @click="() => (selectedVariantKey = vid)"
                  >
                    <div class="flex flex-col">
                      <div
                        v-html="
                          variant[_firstPrintableAreaOf(variant)]
                            .with_placeholder
                        "
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex flex-col mt-5 w-full ml-4">
                <div class="text-4xl">
                  <!-- {{ selectedProduct.meta.name }} -->
                  <input
                    type="text"
                    class="font-bold w-full"
                    placeholder="What's the name of this product?"
                  />
                </div>
                <div class="text-3xl leading-none font-bold text-primary py-4">
                  <currency-input currency="PHP" placeholder="How much would this cost?"/>
                </div>
                <div>
                  <div class="font-bold">Size & Quantity</div>
                  <div class="flex flex-wrap">
                    <div
                      class="px-4 py-2 border mr-2 hover:border-gray-600 rounded font-bold mt-2"
                      v-for="({ price, quantity }, i) in selectedProduct
                        .variants[selectedVariantKey].sizes"
                      :key="i"
                    >
                      <div class="flex items-center">
                        <div class="text-center mr-2">{{ i }}:</div>
                        <div>
                          <VueNumericInput
                            :min="0"
                            align="center"
                            style="width: 90px"
                            class="ml-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="font-bold mt-2">Printing Options</div>
                  <div class="flex flex-wrap">
                    <div
                      class="px-4 py-2 border mr-2 cursor-pointer hover:border-gray-600 rounded font-bold mt-2"
                    >Screen Printing</div>
                    <div
                      class="px-4 py-2 border mr-2 cursor-pointer hover:border-gray-600 rounded font-bold mt-2"
                    >Direct To Garments(DTG)</div>
                    <div
                      class="px-4 py-2 border mr-2 cursor-pointer hover:border-gray-600 rounded font-bold mt-2"
                    >Dye Sublimation</div>
                    <div
                      class="px-4 py-2 border mr-2 cursor-pointer hover:border-gray-600 rounded font-bold mt-2"
                    >Heat Press</div>
                    <div
                      class="px-4 py-2 border mr-2 cursor-pointer hover:border-gray-600 rounded font-bold mt-2"
                    >Vinyl Cutting</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex justify-end p-4 border-t">
              <button
                type="button"
                class="border px-8 py-2 font-bold rounded outline-none focus:outline-none bg-white hover:bg-gray-100 mr-2"
              >Previous</button>
              <button
                type="button"
                class="border px-8 py-2 font-bold rounded outline-none focus:outline-none border-white bg-primary text-white hover:bg-primary-lighter"
              >Next</button>
            </div>
          </div>
          <div class="flex border-l w-3/12">
            <div class="flex flex-col w-full">
              <div class="flex p-4 uppercase border-b">
                <strong>My Products</strong>
              </div>
              <div class="overflow-auto h-full">
                <div class="flex p-4 flex-wrap">
                  <div class="flex w-6/12 p-1" v-for="product in products" :key="product.id">
                    <div
                      class="flex flex-col border rounded w-full cursor-pointer hover:border-gray-500"
                      :class="{
                        'border-gray-500 shadow-xl':
                          selectedProduct.id === product.id
                      }"
                      @click="selectProduct(product)"
                    >
                      <div class="px-2 pt-2" v-html="_placeholderOfFirstVariantOf(product)"></div>
                    </div>
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
import VueNumericInput from '@/components/VueNumericInput'

export default {
  props: ['products'],
  components: {
    VueTailwindDrawer,
    VueNumericInput
  },
  created() {},
  data() {
    return {
      selectedProduct: this.products[0],
      selectedVariantKey: _.first(_.keys(this.products[0].variants)),
      selectedSize: null
    }
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
    },
    selectProduct(product) {
      this.selectedProduct = product
      const firstKey = _.first(_.keys(product.variants))
      this.selectedVariantKey = firstKey
    }
  }
}
</script>
