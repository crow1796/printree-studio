<template>
  <VueTailwindDrawer ref="drawer" class="text-sm" width="100%">
    <AreaLoader v-if="isLoading" fullscreen />
    <VueTailwindModal
      ref="publishConfirmationModal"
      width="30%"
      content-class="rounded-none shadow-none text-gray-600"
    >
      <div class="flex flex-col">
        <div class="modal-heading border-b w-full p-4">
          <div class="flex justify-between w-full items-center">
            <div class="flex uppercase justify-center flex-grow">
              <strong>Confirmation</strong>
            </div>
          </div>
        </div>
        <div
          class="modal-body p-4 text-center"
        >
          <div>
            Are you sure you want to {{ confirmationAction === 'approval' ? 'publish' : 'decline' }} this collection?
          </div>
          <div class="mt-4">
            <textarea
              name="notes"
              id="notes"
              cols="30"
              rows="5"
              class="w-full border rounded p-4 outine-none resize-none"
              placeholder="Notes to the designer"
            ></textarea>
          </div>
        </div>
        <div class="flex modal-footer justify-between flex-shrink p-4 border-t items-center">
          <button
            type="button"
            class="justify-center items-center focus:outline-none outline-none border px-3 py-2 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
            @click="() => this.$refs.publishConfirmationModal.hide()"
          >Cancel</button>

          <button
            type="button"
            class="shadow-xl border border-white bg-primary px-8 py-2 font-bold rounded text-white hover:bg-primary-lighter"
            @click="updateCollectionStatus"
          >Yes</button>
        </div>
      </div>
    </VueTailwindModal>
    <div class="flex flex-grow text-gray-600">
      <div class="flex flex-col flex-grow">
        <div class="flex flex-grow-0 items-center border-b p-4">
          <div class="flex flex-grow justify-end">
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
              <div class="large-thumbnail w-4/12 flex flex-col">
                <div class="flex relative justify-center items-center">
                  <button
                    type="button"
                    class="absolute top-0 left-0 border rounded flex justify-center items-center w-8 h-8 hover:text-primary hover:border-primary"
                    @click="switchSides"
                    title="Rotate"
                    v-tippy="{arrow: true}"
                  >
                    <font-awesome-icon :icon="['fas', 'sync-alt']" />
                  </button>

                  <a
                    :href="`/admin/generate/${selectedProductVariantKey}`"
                    class="absolute top-0 right-0 border rounded flex justify-center items-center w-8 h-8 hover:text-primary hover:border-primary"
                    title="View Design"
                    target="_blank"
                    v-tippy="{arrow: true}"
                  >
                    <font-awesome-icon :icon="['fas', 'eye']" />
                  </a>
                  <img
                    :src="selectedProduct.variants[selectedProductVariantKey].sides[selectedProductSide].with_placeholder"
                    class="w-full"
                  />
                </div>
                <div class="variants flex mt-4">
                  <div
                    class="flex w-1/5 cursor-pointer border border-transparent hover:border-gray-500 p-1 rounded mr-1"
                    v-for="(variant, vid) in selectedProduct.variants"
                    :class="{
                      'border-gray-500 shadow-xl': selectedProductVariantKey === vid
                    }"
                    :key="variant._id"
                    @click="() => (selectedProductVariantKey = vid)"
                  >
                    <div class="flex flex-col w-full">
                      <img
                        :src="variant.sides[_firstPrintableAreaOf(variant.sides)]
                            .with_placeholder"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex flex-col mt-5 flex-grow ml-4">
                <div class="text-4xl">
                  <span class="font-bold w-full outline-none">{{selectedProduct.meta.name}}</span>
                </div>
                <div class="text-3xl leading-none py-4 flex items-center">
                  <div class="relative flex flex-col">
                    <div class="text-xs text-gray-600 uppercase font-bold mb-1">Base Price</div>
                    <div>PHP {{ selectedProductBasePrice }} +&nbsp;</div>
                  </div>
                  <div class="relative flex flex-col">
                    <div class="text-xs text-gray-600 uppercase font-bold mb-1">Profit*</div>
                    <div class="flex">
                      <div>PHP&nbsp;</div>
                      <div>{{ selectedProductProfit }}</div>&nbsp;=&nbsp;
                    </div>
                  </div>
                  <div class="text-white bg-primary flex flex-col font-bold px-4 py-2 rounded">
                    <div
                      class="text-xs uppercase font-bold mb-1"
                    >{{ meta.plan === 'sell' ? 'Total Selling Price' : 'Sell it for' }}</div>
                    <div>PHP {{ productTotalPrice }}</div>
                  </div>
                  <div
                    class="text-white bg-primary flex flex-col font-bold px-4 py-2 rounded ml-2"
                    v-if="meta.plan === 'buy'"
                  >
                    <div class="text-xs uppercase font-bold mb-1">Pay Only</div>
                    <div>PHP {{ selectedProductBasePrice }}</div>
                  </div>
                </div>
                <div>
                  <div class="mt-2" v-if="selectedProduct.meta.description">
                    <div
                      class="w-full border rounded p-4 outine-none resize-none"
                    >{{selectedProduct.meta.description}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex border-l w-3/12">
            <div class="flex flex-col w-full">
              <div class="flex p-4 uppercase border-b">
                <strong>OTHER PRODUCTS</strong>
              </div>
              <div class="overflow-auto h-full">
                <div class="flex p-4 flex-wrap">
                  <div
                    class="flex w-6/12 p-1"
                    v-for="product in generatedProducts"
                    :key="product._id"
                  >
                    <div
                      class="flex flex-col border rounded w-full cursor-pointer hover:border-gray-500"
                      :class="{
                        'border-gray-500 shadow-xl':
                          selectedProduct._id === product._id
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
        <div
          class="flex p-4 items-center border-t"
          :class="{'justify-end': meta.status === 'declined', 'justify-between': ['pending', 'reviewing'].includes(meta.status)}"
        >
          <PTButton @click="confirmAction('decline')" v-if="['pending', 'reviewing'].includes(meta.status)">DECLINE</PTButton>
          <PTButton
            color="primary"
            v-if="meta.status !== 'approved'"
            @click="confirmAction('approval')"
          >PUBLISH</PTButton>
        </div>
      </div>
    </div>
  </VueTailwindDrawer>
</template>

<script>
import VueTailwindModal from '@/components/VueTailwindModal'
import VueTailwindDrawer from '@/components/VueTailwindDrawer'

export default {
  props: {
    products: {
      required: true
    },
    meta: {
      required: true
    }
  },
  components: {
    VueTailwindDrawer,
    VueTailwindModal
  },
  data() {
    return {
      selectedProductSide: null,
      confirmationAction: null,
      isLoading: false,
      generatedProducts: JSON.parse(JSON.stringify(this.products)),
      selectedProduct: this.products.length
        ? JSON.parse(JSON.stringify(this.products[0]))
        : null,
      selectedProductVariantKey: this.products.length
        ? _.first(_.keys(JSON.parse(JSON.stringify(this.products[0])).variants))
        : null,
      selectedSize: null,
      selectedProductProfit: 0,
      selectedProductSizes: [],
      estimatedMinProfit: 0,
      estimatedMaxProfit: 0,
      selectedProductBasePrice: 0,
      calculatorTimeout: null,
      isCalculating: false
    }
  },
  methods: {
    async markAsFeatured(){
      this.isLoading = true
      const res = await this.$store.dispatch('admin/markAsFeatured', {
        type: 'product',
        obj: this.selectedProduct,
        is_marked: this.selectedProduct.featured_at ? true : false
      })
      this.selectedProduct = res.data
      this.isLoading = false
      this.$toast.success(this.selectedProduct.featured_at ? 'Product is now featured!' : 'Product has been unfeatured!', {
        position: 'top'
      })
    },
    switchSides() {
      const sides = _.keys(
        this.selectedProduct.variants[this.selectedProductVariantKey].sides
      )
      const sideIndex = sides.indexOf(this.selectedProductSide)
      const nextSide = sides[sideIndex + 1]
      if (nextSide) {
        this.selectedProductSide = nextSide
        return
      }
      this.selectedProductSide = _.first(sides)
    },
    downloadDesign() {
      const fileName = `${this.selectedProduct.meta.name}-${this.selectedProduct._id}`
      const fileType = 'image/svg+xml'
      let content = this.selectedProduct.variants[
        this.selectedProductVariantKey
      ].sides[this.selectedProductSide].design

      let a = document.createElement('a')
      a.target = '_blank';
      a.download = `(${this.selectedProductSide.toUpperCase()})${fileName}.svg`
      a.href = content
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(function() {
        URL.revokeObjectURL(a.href)
      }, 1500)
    },
    async updateCollectionStatus() {
      this.isLoading = true
      this.$refs.publishConfirmationModal.hide()
      let status = 'approved'
      if(this.confirmationAction === 'decline') status = 'declined'
      await this.$store.dispatch('admin/updateCollectionStatus', {
        _id: this.meta._id,
        status
      })
      this.isLoading = false
      this.$toast.success('Collection status has been updated successfully!', {
        position: 'top'
      })
    },
    selectProduct(product) {
      this.selectedProduct = JSON.parse(JSON.stringify(product))
    },
    _placeholderOfFirstVariantOf(product) {
      const firstKey = _.first(_.keys(product.variants))
      return product.variants[firstKey].sides[
        this._firstPrintableAreaOf(product.variants[firstKey].sides)
      ].with_placeholder
    },
    _firstPrintableAreaOf(variant) {
      let areas = _.keys(variant)
      return _.includes(areas, 'front') ? 'front' : _.head(areas)
    },
    show() {
      this.$refs.drawer.show()
      this.calculateProfit()
    },
    hide() {
      this.$refs.drawer.hide()
    },
    _calculateEstProfit() {
      let totalProfit = 0;
      _.map(this.generatedProducts, product => {
        _.map(product.variants, variant => {
          _.map(variant.sizes, (size, k) => {
            let availableSize = _.find(
              variant.available_sizes,
              s => s.name === size.name
            );
            if (!availableSize) return;
            let baseCost = availableSize.baseCost;
            let totalForPrintree = baseCost * size.quantity;
            let totalWithCustomerPrice =
              (baseCost + size.price) * size.quantity;
            let net = totalWithCustomerPrice - totalForPrintree;
            totalProfit += net;
          });
        });
      });
      let minProfit = totalProfit - totalProfit * 0.05;
      let maxProfit = totalProfit + totalProfit * 0.05;
      this.estimatedMinProfit = minProfit;
      this.estimatedMaxProfit = maxProfit;
      this.$nextTick(() => {
        if (this.$refs.estMinProfit) this.$refs.estMinProfit.play();
        if (this.$refs.estMaxProfit) this.$refs.estMaxProfit.play();
      });
    },
    calculateProfit(size) {
      clearTimeout(this.calculatorTimeout);
      this.isCalculating = true;

      this.calculatorTimeout = setTimeout(() => {
        this._calculateEstProfit();
        this.isCalculating = false;
      }, 2000);
    },
    confirmAction(action) {
      this.confirmationAction = action
      this.$refs.publishConfirmationModal.show()
    }
  },
  computed: {
    productTotalPrice() {
      return this.selectedProductBasePrice + this.selectedProductProfit
    },
    hasPreviousProductOrVariant() {
      const variationKeys = _.keys(this.selectedProduct.variants)
      const previousVariationKey =
        variationKeys[variationKeys.indexOf(this.selectedProductVariantKey) - 1]

      return (
        _.findIndex(this.generatedProducts, { id: this.selectedProduct._id }) >
          0 || previousVariationKey
      )
    }
  },
  watch: {
    selectedProduct: {
      immediate: true,
      handler(to, from) {
        if(!to) return;
        const firstVariantKey = _.first(_.keys(to.variants));
        this.selectedProductSizes = JSON.parse(
          JSON.stringify(to.variants[firstVariantKey].sizes)
        );
        this.selectedProductVariantKey = firstVariantKey;
        this.selectedProductBasePrice = _.first(
          to.variants[firstVariantKey].available_sizes
        ).baseCost;
        
        this.selectedProductSide = this._firstPrintableAreaOf(
          to.variants[this.selectedProductVariantKey].sides
        )

        this.selectedProductProfit =
          to.variants[firstVariantKey].sizes[0].price;

        _.keys(this.selectedProductSizes).map(
          s => (this.selectedProductSizes[s].price = this.selectedProductProfit)
        );

        this.selectedProduct.variants[
          this.selectedProductVariantKey
        ].sizes = this.selectedProductSizes;

        this._calculateEstProfit();
      }
    },
    selectedProductVariantKey: {
      immediate: true,
      handler(to) {
        if(!this.selectedProduct) return;
        this.selectedProductSizes = this.selectedProduct.variants[to].sizes;

        this.generatedProducts[
          _.findIndex(this.generatedProducts, { _id: this.selectedProduct._id })
        ].variants[to].sizes = this.selectedProductSizes;
      }
    },
    selectedProductProfit: {
      immediate: true,
      handler(to) {
        if(!this.selectedProduct) return;
        const firstVariantKey = _.first(_.keys(this.selectedProduct.variants));
        this.selectedProductSizes = this.selectedProduct.variants[
          firstVariantKey
        ].sizes;

        _.keys(this.selectedProductSizes).map(
          s => (this.selectedProductSizes[s].price = to)
        );

        this.generatedProducts[
          _.findIndex(this.generatedProducts, { _id: this.selectedProduct._id })
        ].variants[
          this.selectedProductVariantKey
        ].sizes = this.selectedProductSizes;
        
        this.calculateProfit();
      }
    }
  }
}
</script>