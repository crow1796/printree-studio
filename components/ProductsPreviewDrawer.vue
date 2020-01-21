<template>
  <VueTailwindDrawer ref="drawer" width="100%">
    <div class="flex h-full w-full text-gray-600 overflow-hidden">
      <div class="flex flex-col w-full h-full">
        <div class="flex items-center justify-between border-b p-4">
          <div class="flex w-4/12 uppercase flex-col">
            <div class="font-bold">
              <span class="font-bold mr-1">I WANT TO</span>
              <toggle-button
                :value="designMeta.plan == 'sell'"
                :labels="{checked: 'SELL', unchecked: 'BUY'}"
                :color="{ checked: '#E1274E', unchecked: '#63b3ed' }"
                :width="60"
                @change="changeCurrentProductPlan"
              />
              <span class="font-bold ml-1">
                {{products.length > 1 ? "THESE" : "THIS"}} PRODUCT
                <span v-if="products.length > 1">S</span>
              </span>
            </div>
            <div class="text-xs mt-1">
              {{ designMeta.plan == 'sell' ? '100% FREE ● NO INVENTORY' : 'BULK DISCOUNTS ● IMMEDIATE FULFILLMENT' }}
            </div>
          </div>
          <div class="flex w-4/12 uppercase justify-center font-bold">COLLECTION PREVIEW</div>
          <div class="flex w-4/12 justify-end">
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
                    <div class="flex flex-col w-full">
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
                  <input
                    type="text"
                    class="font-bold w-full"
                    placeholder="What's the name of this product?"
                    v-model="selectedProduct.meta.name"
                  />
                </div>
                <div class="text-3xl leading-none py-4 flex items-center">
                  <div>PHP 199.00 +</div>&nbsp;
                  <div>
                    <currency-input currency="PHP" placeholder="Your Profit" style="width: 215px" />
                  </div>
                  <div class="text-primary">
                    <div>= PHP 299.00</div>
                  </div>
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
import { mapGetters } from 'vuex'

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
  computed: {
    ...mapGetters({
      designMeta: 'designer/designMeta'
    })
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
      try {
        this.$store.commit('designer/CURRENT_PRODUCT_META', {
          id: this.selectedProduct.id,
          meta: this.selectedProduct.meta
        })
        this.selectedProduct = product
        const firstKey = _.first(_.keys(product.variants))
        this.selectedVariantKey = firstKey
      } catch (error) {}
    },
    changeCurrentProductPlan({ value }) {
      let plan = 'buy'
      if (value) plan = 'sell'
      this.$store.commit('designer/DESIGN_PLAN', plan)
    }
  }
}
</script>
