<template>
  <VueTailwindDrawer ref="drawer" width="100%">
    <VueTailwindModal ref="planModal">
      <div class="flex flex-grow flex-col text-gray-600">
        <div class="font-bold">
          <div class="text-center text-2xl uppercase font-bold mb-4 font-normal">I want to...</div>
          <div class="flex">
            <div
              class="border rounded w-6/12 flex cursor-pointer hover:border-gray-600 items-center justify-center mr-2 relative"
              @click="changeCurrentProductPlan('sell')"
              :class="{'border-white hover:border-white text-white bg-primary': designMeta.plan === 'sell'}"
            >
              <div class="mx-4 my-6 flex flex-col items-center justify-center">
                <div class="flex items-center justify-center">
                  <div class="rounded-full bg-white">
                    <img src="~/assets/images/sell.svg" class="w-10/12" style="width: 200px;" />
                  </div>
                </div>
                <div
                  class="text-4xl flex-justify-center mt-4"
                  :class="{'text-white': designMeta.plan === 'sell', 'text-primary': designMeta.plan !== 'sell'}"
                >SELL</div>
                <div class="flex flex-grow font-normal">100% FREE ● NO INVENTORY</div>
              </div>
            </div>
            <div
              class="border rounded w-6/12 flex cursor-pointer hover:border-gray-600 items-center justify-center ml-2 relative"
              @click="changeCurrentProductPlan('buy')"
              :class="{'border-white hover:border-white text-white bg-primary': designMeta.plan === 'buy'}"
            >
              <div class="mx-4 my-6 flex flex-col items-center justify-center">
                <div class="flex items-center justify-center">
                  <div class="rounded-full bg-white">
                    <img src="~/assets/images/buy.svg" class="w-10/12" style="width: 280px;" />
                  </div>
                </div>
                <div
                  class="text-4xl flex-justify-center mt-4"
                  :class="{'text-white': designMeta.plan === 'buy', 'text-primary': designMeta.plan !== 'buy'}"
                >BUY</div>
                <div class="flex flex-grow font-normal">BULK DISCOUNTS ● FOR YOUR ORGANIZATION</div>
              </div>
            </div>
          </div>
          <div class="flex justify-between pt-4 mt-4 border-t">
            <button
              type="button"
              class="px-8 py-2 font-bold rounded outline-none focus:outline-none border hover:border-gray-600 hover:text-gray-700 mr-4"
              @click="$refs.planModal.hide()"
            >
              <span class="mr-2">
                <font-awesome-icon :icon="['fas', 'arrow-left']" />
              </span>BACK
            </button>
            <button
              type="button"
              class="border px-8 py-2 font-bold rounded outline-none focus:outline-none border-white bg-primary text-white hover:bg-primary-lighter"
            >
              <span>PROCEED</span>
              <span class="ml-2">
                <font-awesome-icon :icon="['fas', 'arrow-right']" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </VueTailwindModal>
    <div class="flex h-full w-full text-gray-600 overflow-hidden">
      <div class="flex flex-col w-full h-full">
        <div class="flex flex-grow items-center border-b p-4">
          <div class="flex w-4/12 uppercase font-bold">COLLECTION PREVIEW</div>
          <div class="flex w-4/12 uppercase font-bold justify-center">
            <div class="flex flex-col items-center">
              <div>TOTAL ESTIMATED PROFIT</div>
              <div class="text-primary">
                <font-awesome-icon v-if="isCalculating" :icon="['fas', 'spinner']" spin />
                <number
                  v-if="estimatedMinProfit"
                  animationPaused
                  ref="estMinProfit"
                  :to="estimatedMinProfit"
                  :format="(num) => num.formatMoney('₱ ')"
                  :duration=".4"
                />
                <font-awesome-icon v-if="estimatedMinProfit" :icon="['fas', 'minus']" />
                <number
                  animationPaused
                  ref="estMaxProfit"
                  :to="estimatedMaxProfit"
                  :format="(num) => num.formatMoney('₱ ')"
                  :duration=".4"
                />
              </div>
            </div>
          </div>
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
                    :src="selectedProduct.variants[selectedProductVariantKey][
                      _firstPrintableAreaOf(
                        selectedProduct.variants[selectedProductVariantKey]
                      )
                    ].with_placeholder"
                  />
                </div>
                <div class="variants flex">
                  <div
                    class="flex w-1/5 cursor-pointer border border-transparent hover:border-gray-500 p-1 rounded mr-1"
                    v-for="(variant, vid) in selectedProduct.variants"
                    :class="{
                      'border-gray-500 shadow-xl': selectedProductVariantKey === vid
                    }"
                    :key="variant.id"
                    @click="() => (selectedProductVariantKey = vid)"
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
                    <div>PHP {{ selectedProductBasePrice }} +</div>
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
                  <div class="text-primary flex flex-col font-bold">
                    <div class="text-xs uppercase font-bold mb-1">= Total Price</div>
                    <div>= PHP {{ productTotalPrice }}</div>
                  </div>
                </div>
                <div>
                  <div class="font-bold"></div>
                  <div class="flex flex-wrap">
                    <div
                      class="px-4 py-2 border mr-2 hover:border-gray-600 rounded font-bold mt-2"
                      v-for="(variant, i) in selectedProduct
                        .variants[selectedProductVariantKey].sizes"
                      :key="i"
                    >
                      <div class="flex items-center">
                        <div class="text-center mr-2">{{ i }}:</div>
                        <div>
                          <VueNumericInput
                            align="center"
                            style="width: 90px"
                            class="ml-1"
                            v-model="selectedProductSizes[i].quantity"
                            @input="calculateProfit"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="font-bold mt-2">Printing Options</div>
                  <OptionButtons
                    :options="printingOptions"
                    v-model="selectedProduct.meta.printing_option"
                  />
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
                  <div
                    class="flex w-6/12 p-1"
                    v-for="product in generatedProducts"
                    :key="product.id"
                  >
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
  data() {
    return {
      generatedProducts: JSON.parse(JSON.stringify(this.products)),
      selectedProduct: JSON.parse(JSON.stringify(this.products[0])),
      selectedProductVariantKey: _.first(
        _.keys(JSON.parse(JSON.stringify(this.products[0])).variants)
      ),
      selectedSize: null,
      printingOptions: [
        {
          label: 'Screen Printing',
          value: 'Screen Printing'
        },
        {
          label: 'Direct To Garments (DTG)',
          value: 'Direct To Garments (DTG)'
        },
        {
          label: 'Dye Sublimation',
          value: 'Dye Sublimation'
        },
        {
          label: 'Heat Press',
          value: 'Heat Press'
        },
        {
          label: 'Vinyl Cutting',
          value: 'Vinyl Cutting'
        }
      ],
      selectedProductProfit: 0,
      selectedProductSizes: [],
      estimatedMinProfit: 0,
      estimatedMaxProfit: 0,
      selectedProductBasePrice: 0,
      calculatorTimeout: null,
      isCalculating: false
    }
  },
  computed: {
    ...mapGetters({
      designMeta: 'designer/designMeta'
    }),
    hasPreviousProduct() {
      return (
        _.findIndex(this.generatedProducts, { id: this.selectedProduct.id }) > 0
      )
    },
    productTotalPrice() {
      return this.selectedProductBasePrice + this.selectedProductProfit
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
      this.selectedProduct = JSON.parse(JSON.stringify(product))
    },
    changeCurrentProductPlan(plan) {
      this.$store.commit('designer/DESIGN_PLAN', plan)
    },
    previousProduct() {
      const previousProductIndex =
        _.findIndex(this.generatedProducts, { id: this.selectedProduct.id }) - 1
      const previousProduct = this.generatedProducts[previousProductIndex]
      this.selectProduct(previousProduct)
    },
    validateAndSaveMeta() {
      const nextProductIndex =
        _.findIndex(this.generatedProducts, { id: this.selectedProduct.id }) + 1
      const nextProduct = this.generatedProducts[nextProductIndex]
      if (!nextProduct) {
        this.$refs.planModal.show()
        return
      }
      this.selectProduct(nextProduct)
    },
    setQuantityAndPrice(n, p, v) {
      this.$store.commit('designer/CURRENT_VARIANT_PROPERTIES', {
        path: `sizes.${n}.${p}`,
        value: v
      })
      if (this.designMeta.plan == 'buy') return
      this._calculateEstProfit()
    },
    _calculateEstProfit() {
      let totalProfit = 0
      _.map(this.generatedProducts, product => {
        _.map(product.variants, variant => {
          _.map(variant.sizes, (size, k) => {
            let availableSize = _.find(
              variant.available_sizes,
              s => s.name == k
            )
            if (!availableSize) return
            let baseCost = availableSize.base_cost
            let totalForPrintree = baseCost * size.quantity
            let totalWithCustomerPrice = (baseCost + size.price) * size.quantity
            let net = totalWithCustomerPrice - totalForPrintree
            totalProfit += net
          })
        })
      })
      let minProfit = totalProfit - totalProfit * 0.05
      let maxProfit = totalProfit + totalProfit * 0.05
      this.estimatedMinProfit = minProfit
      this.estimatedMaxProfit = maxProfit
      this.$nextTick(() => {
        if (this.$refs.estMinProfit) this.$refs.estMinProfit.play()
        if (this.$refs.estMaxProfit) this.$refs.estMaxProfit.play()
      })
    },
    calculateProfit() {
      clearTimeout(this.calculatorTimeout)
      this.isCalculating = true

      this.calculatorTimeout = setTimeout(() => {
        this._calculateEstProfit()
        this.isCalculating = false
      }, 1000)
    }
  },
  watch: {
    selectedProduct: {
      immediate: true,
      handler(to, from) {
        if (from) {
          this.$store.commit('designer/CURRENT_PRODUCT_META', {
            id: from.id,
            meta: from.meta
          })
        }

        const firstVariantKey = _.first(_.keys(to.variants))
        this.selectedProductSizes = to.variants[firstVariantKey].sizes
        this.selectedProductVariantKey = firstVariantKey
        const firstSizeKey = _.first(_.keys(this.selectedProductSizes))
        this.selectedProductBasePrice = _.first(
          to.variants[firstVariantKey].available_sizes
        ).base_cost

        this.selectedProductProfit =
          to.variants[firstVariantKey].sizes[firstSizeKey].price

        _.keys(this.selectedProductSizes).map(
          s => (this.selectedProductSizes[s].price = this.selectedProductProfit)
        )

        this.generatedProducts[
          _.findIndex(this.generatedProducts, { id: this.selectedProduct.id })
        ].variants[
          this.selectedProductVariantKey
        ].sizes = this.selectedProductSizes

        this._calculateEstProfit()
      }
    },
    selectedProductProfit: {
      immediate: true,
      handler(to) {
        const firstVariantKey = _.first(_.keys(this.selectedProduct.variants))
        this.selectedProductSizes = this.selectedProduct.variants[
          firstVariantKey
        ].sizes
        const firstSizeKey = _.first(_.keys(this.selectedProductSizes))

        _.keys(this.selectedProductSizes).map(
          s => (this.selectedProductSizes[s].price = to)
        )

        console.log(this.selectedProductSizes)

        this.generatedProducts[
          _.findIndex(this.generatedProducts, { id: this.selectedProduct.id })
        ].variants[
          this.selectedProductVariantKey
        ].sizes = this.selectedProductSizes

        this.$store.commit('designer/PRODUCT_PROPERTIES', {
          props: {
            path: `variants.${this.selectedProductVariantKey}.sizes`,
            value: this.selectedProductSizes
          }
        })
        this.calculateProfit()
      }
    }
  }
}
</script>
