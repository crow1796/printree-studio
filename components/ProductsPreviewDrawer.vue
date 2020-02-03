<template>
  <VueTailwindDrawer ref="drawer" width="100%">
    <VueTailwindModal ref="planModal">
      <div class="flex flex-grow flex-col text-gray-600">
        <div class="font-bold">
          <div class="text-center text-2xl uppercase font-bold mb-4 font-normal">
            I want to...
          </div>
          <div class="flex">
            <div class="border rounded w-6/12 flex cursor-pointer hover:border-gray-600 items-center justify-center mr-2 relative">
              <div class="mx-4 my-6 flex flex-col items-center justify-center">
                <div class="flex items-center justify-center">
                  <img src="~/assets/images/sell.svg" class="w-10/12" style="width: 200px;"/>
                </div>
                <div class="text-4xl flex-justify-center text-primary mt-4">
                  SELL
                </div>
                <div class="flex flex-grow font-normal">
                  100% FREE ● NO INVENTORY
                </div>
              </div>
            </div>
            <div class="border rounded w-6/12 flex cursor-pointer hover:border-gray-600 items-center justify-center ml-2 relative">
              <div class="mx-4 my-6 flex flex-col items-center justify-center">
                <div class="flex items-center justify-center">
                  <img src="~/assets/images/buy.svg" class="w-10/12" style="width: 280px;"/>
                </div>
                <div class="text-4xl flex-justify-center text-primary mt-4">
                  BUY
                </div>
                <div class="flex flex-grow font-normal">
                  BULK DISCOUNTS ● FOR YOUR ORGANIZATION
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-between pt-4 mt-4 border-t">
              <button
                type="button"
                class="px-8 py-2 font-bold rounded outline-none focus:outline-none border hover:border-gray-600 hover:text-gray-700 mr-4"
                @click="$refs.planModal.hide()"
              >CANCEL</button>
            <button
              type="button"
              class="border px-8 py-2 font-bold rounded outline-none focus:outline-none border-white bg-primary text-white hover:bg-primary-lighter"
            >
              <span>PROCEED</span>
              <span class="ml-2">
                <font-awesome-icon :icon="['fas', 'arrow-right']"/>
              </span>
            </button>
          </div>
          <!-- <toggle-button
            :value="designMeta.plan == 'sell'"
            :labels="{checked: 'SELL', unchecked: 'BUY'}"
            :color="{ checked: '#E1274E', unchecked: '#63b3ed' }"
            :width="60"
            @change="changeCurrentProductPlan"
          />
          <span class="font-bold ml-1">
            {{products.length > 1 ? "THESE" : "THIS"}} PRODUCT
            <span v-if="products.length > 1">S</span>
          </span> -->
        </div>
        <!-- <div
          class="text-xs mt-1"
        >{{ designMeta.plan == 'sell' ? '100% FREE ● NO INVENTORY' : 'BULK DISCOUNTS ● IMMEDIATE FULFILLMENT' }}</div> -->
      </div>
    </VueTailwindModal>
    <div class="flex h-full w-full text-gray-600 overflow-hidden">
      <div class="flex flex-col w-full h-full">
        <div class="flex items-center border-b p-4">
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
                <div>
                  <img
                    :src="selectedProduct.variants[selectedVariantKey][
                      _firstPrintableAreaOf(
                        selectedProduct.variants[selectedVariantKey]
                      )
                    ].with_placeholder"
                  />
                </div>
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
                      <div>
                        <img
                          :src="variant[_firstPrintableAreaOf(variant)]
                            .with_placeholder"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex flex-col mt-5 w-full ml-4">
                <div class="text-4xl">
                  <input
                    type="text"
                    class="font-bold w-full outline-none"
                    placeholder="What's the name of this product?*"
                    v-model="selectedProduct.meta.name"
                  />
                </div>
                <div class="text-3xl leading-none py-4 flex items-center">
                  <div class="relative flex flex-col">
                    <div class="text-xs text-gray-600 uppercase font-bold mb-1">Base Price</div>
                    <div>PHP 199.00 +</div>
                  </div>&nbsp;
                  <div class="relative flex flex-col">
                    <div class="text-xs text-gray-600 uppercase font-bold mb-1">Your Profit*</div>
                    <currency-input
                      currency="PHP"
                      placeholder="Your Profit"
                      style="width: 215px"
                      v-model="selectedProductProfit"
                    />
                  </div>
                  <div class="text-primary flex flex-col">
                    <div class="text-xs uppercase font-bold mb-1">Total Price</div>
                    <div>= PHP {{ productTotalPrice }}</div>
                  </div>
                </div>
                <div>
                  <div class="font-bold">Size & Quantity</div>
                  <div class="flex flex-wrap">
                    <div
                      class="px-4 py-2 border mr-2 hover:border-gray-600 rounded font-bold mt-2"
                      v-for="(variant, i) in selectedProduct
                        .variants[selectedVariantKey].sizes"
                      :key="i"
                    >
                      <div class="flex items-center">
                        <div class="text-center mr-2">{{ i }}:</div>
                        <div>
                          <VueNumericInput
                            :min="variant.quantity"
                            align="center"
                            style="width: 90px"
                            class="ml-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="font-bold mt-2">Printing Options</div>
                  <OptionButtons :options="optionButtons" v-model="printingOption" />
                  <div class="mt-2">
                    <textarea
                      name="product_description"
                      id="product_description"
                      cols="30"
                      rows="5"
                      class="w-full border rounded p-4 outine-none resize-none"
                      placeholder="Describe your product (optional)"
                      v-model="selectedProduct.meta.description"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex justify-end p-4 border-t">
              <button
                type="button"
                class="px-8 py-2 font-bold rounded outline-none focus:outline-none border hover:border-gray-600 hover:text-gray-700 mr-4"
                @click="previousProduct"
                v-if="hasPreviousProduct"
              >Previous</button>
              <button
                type="button"
                class="border px-8 py-2 font-bold rounded outline-none focus:outline-none border-white bg-primary text-white hover:bg-primary-lighter"
                @click="validateAndSaveMeta"
              >NEXT</button>
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
                      <div class="px-2 pt-2">
                        <img :src="_placeholderOfFirstVariantOf(product)" />
                      </div>
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
import OptionButtons from '@/components/OptionButtons'
import { mapGetters } from 'vuex'
import VueTailwindModal from '@/components/VueTailwindModal'

export default {
  props: ['products'],
  components: {
    VueTailwindDrawer,
    VueNumericInput,
    OptionButtons,
    VueTailwindModal
  },
  created() {
    this.printingOption = this.optionButtons[0]
    this.selectedProductSizes = this.selectedProduct.variants[
      _.first(_.keys(JSON.parse(JSON.stringify(this.products[0])).variants))
    ]
  },
  data() {
    return {
      selectedProduct: JSON.parse(JSON.stringify(this.products[0])),
      selectedVariantKey: _.first(
        _.keys(JSON.parse(JSON.stringify(this.products[0])).variants)
      ),
      selectedSize: null,
      optionButtons: [
        {
          label: 'Screen Printing',
          value: 'screen_printing'
        },
        {
          label: 'Direct To Garments (DTG)',
          value: 'dtg'
        },
        {
          label: 'Dye Sublimation',
          value: 'dye_sublimation'
        },
        {
          label: 'Heat Press',
          value: 'heat_press'
        },
        {
          label: 'Vinyl Cutting',
          value: 'vinyl_cutting'
        }
      ],
      printingOption: null,
      selectedProductProfit: 0,
      selectedProductSizes: []
    }
  },
  computed: {
    ...mapGetters({
      designMeta: 'designer/designMeta'
    }),
    hasPreviousProduct() {
      return _.findIndex(this.products, { id: this.selectedProduct.id }) > 0
    },
    productTotalPrice(){
      return 
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
      try {
        this.$store.commit('designer/CURRENT_PRODUCT_META', {
          id: this.selectedProduct.id,
          meta: this.selectedProduct.meta
        })
        this.selectedProduct = JSON.parse(JSON.stringify(product))
        const firstKey = _.first(_.keys(this.selectedProduct.variants))
        this.selectedVariantKey = firstKey
      } catch (error) {}
    },
    changeCurrentProductPlan({ value }) {
      let plan = 'buy'
      if (value) plan = 'sell'
      this.$store.commit('designer/DESIGN_PLAN', plan)
    },
    previousProduct() {
      const previousProductIndex =
        _.findIndex(this.products, { id: this.selectedProduct.id }) - 1
      const previousProduct = this.products[previousProductIndex]
      this.selectProduct(previousProduct)
    },
    validateAndSaveMeta() {
      const nextProductIndex =
        _.findIndex(this.products, { id: this.selectedProduct.id }) + 1
      const nextProduct = this.products[nextProductIndex]
      if (!nextProduct) {
        this.$refs.planModal.show()
        return
      }
      this.selectProduct(nextProduct)
    }
  }
}
</script>
