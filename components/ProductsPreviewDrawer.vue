<template>
  <VueTailwindDrawer ref="drawer" width="100%">
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
        <div class="modal-body p-4 text-center">
          {{ meta.plan === 'Sell' ? 'Are you sure you want to publish these products?' : 'Are you sure you want to proceed? This collection will be added to your cart.' }}
          <div
            v-if="meta.plan === 'Sell'"
            class="text-xs text-text-600 bg-gray-300 p-2 mt-2 text-center"
          >The collection will be reviewed first before publishing it into the store, you will receive an email once it's approved.</div>
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
            @click="collectionConfirmed"
          >Yes</button>
        </div>
      </div>
    </VueTailwindModal>
    <VueTailwindToast placement="top-center" ref="productValidationToast">
      <div class="font-bold">Oops! Please fill up the required fields first:</div>
      <ul class="text-sm list-disc">
        <li v-for="(error, i) in productErrors" :key="i">{{ error }}</li>
      </ul>
    </VueTailwindToast>
    <div class="flex h-full w-full text-gray-600 overflow-hidden" v-if="selectedProduct">
      <div class="flex flex-col w-full h-full">
        <div class="flex flex-grow-0 items-center border-b p-4">
          <!-- <div class="flex w-4/12 uppercase flex-col">
            <div class="font-bold">
              <span class="font-bold mr-1">I WANT TO</span>
              <toggle-button
                :value="meta.plan == 'Sell'"
                :labels="{checked: 'SELL', unchecked: 'BUY'}"
                :color="{ checked: '#E1274E', unchecked: '#63b3ed' }"
                :width="60"
                @change="changeCurrentProductPlan"
              />
              <span class="font-bold ml-1">
                {{generatedProducts.length > 1 ? "THESE" : "THIS"}} PRODUCT
                <span
                  v-if="generatedProducts.length > 1"
                >S</span>
              </span>
            </div>
            <div
              class="text-xs mt-1"
            >{{ meta.plan == 'Sell' ? '100% FREE ● NO INVENTORY' : 'BULK DISCOUNTS ● IMMEDIATE FULFILLMENT' }}</div>
          </div>-->
          <div class="flex flex-grow uppercase font-bold justify-start">
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
              <div class="large-thumbnail w-6/12 flex flex-col">
                <img
                  :src="`${_firstFullThumbnailOf(selectedProduct)}`"
                  :key="`full_${selectedProduct._id}_${drawerId}`"
                  :id="`full_${selectedProduct._id}_${drawerId}`"
                />
                <div class="variants flex">
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
                        :key="`variant_${variant._id}_${drawerId}`"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex flex-col mt-5 w-full ml-4" :key="`${selectedProduct._id}-meta`">
                <div class="text-4xl">
                  <input
                    type="text"
                    class="font-bold w-full outline-none border rounded px-4 py-2"
                    placeholder="What's the name of this product?*"
                    v-model="selectedProduct.meta.name"
                  />
                </div>
                <div class="text-3xl leading-none py-4 flex items-start">
                  <div class="relative flex flex-col">
                    <div class="text-xs text-gray-600 uppercase font-bold mb-3">Base Price</div>
                    <div>PHP {{ selectedProductBasePrice }} +&nbsp;</div>
                  </div>
                  <div class="relative flex flex-col">
                    <div class="text-xs text-gray-600 uppercase font-bold mb-1">Your Profit*</div>
                    <div class="flex items-center">
                      <div>PHP&nbsp;</div>
                      <span
                        class="border rounded px-4 py-2"
                        contenteditable="true"
                        @input="setProductProfit"
                      >{{ selectedProductProfit }}</span>&nbsp;=&nbsp;
                    </div>
                  </div>
                  <div class="text-white bg-primary flex flex-col font-bold px-4 py-2 rounded">
                    <div
                      class="text-xs uppercase font-bold mb-1"
                    >{{ meta.plan === 'Sell' ? 'Total Selling Price' : 'Sell it for' }}</div>
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
                  <div class="font-bold"></div>
                  <div class="flex flex-wrap">
                    <div
                      class="px-4 py-2 border mr-2 hover:border-gray-600 rounded font-bold mt-2"
                      v-for="(size, i) in selectedProduct
                        .variants[selectedProductVariantKey].sizes"
                      :key="i"
                    >
                      <div class="flex items-center">
                        <div class="text-center mr-2">{{ size.name }}:</div>
                        <div>
                          <VueNumericInput
                            align="center"
                            style="width: 90px"
                            class="ml-1"
                            :min="1"
                            v-model="size.quantity"
                            @input="calculateProfit(size.name)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- <div class="font-bold mt-2">
                    <span>Printing Options</span>
                    <span title="Quality & Price may vary" v-tippy="{ arrow: true }">
                      <font-awesome-icon :icon="['fas', 'question-circle']" />
                    </span>
                  </div>
                  <OptionButtons
                    :options="printingOptions"
                    v-model="selectedProduct.meta.printing_option"
                  />-->
                  <div class="mt-2">
                    <textarea
                      name="product_description"
                      id="product_description"
                      cols="30"
                      rows="5"
                      class="w-full border rounded p-4 outine-none resize-none"
                      placeholder="Describe this product (optional)"
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
                v-if="hasPreviousProductOrVariant"
              >Previous</button>
              <button
                type="button"
                class="border px-8 py-2 font-bold rounded outline-none focus:outline-none border-white bg-primary text-white hover:bg-primary-lighter"
                @click="nextProduct"
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
                    :key="product._id"
                  >
                    <div
                      class="flex flex-col border rounded w-full cursor-pointer hover:border-gray-500"
                      :class="{
                        'border-gray-500 shadow-xl':
                          selectedProduct._id === product._id
                      }"
                      @click="validateAndSelectProduct(product)"
                    >
                      <div class="px-2 pt-2">
                        <img
                          :src="_placeholderOfFirstVariantOf(product)"
                          :key="`${drawerId}_${product._id}`"
                          :class="`side_thumb_${drawerId}_${product._id}`"
                        />
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
import VueTailwindModal from "@/components/VueTailwindModal";
import VueTailwindDrawer from "@/components/VueTailwindDrawer";
import VueTailwindToast from "@/components/VueTailwindToast";
import VueNumericInput from "@/components/VueNumericInput";
import OptionButtons from "@/components/OptionButtons";
import { mapGetters } from "vuex";

export default {
  props: {
    products: {
      required: true,
      default: () => ([])
    },
    meta: {
      required: true
    }
  },
  components: {
    VueTailwindDrawer,
    VueNumericInput,
    OptionButtons,
    VueTailwindModal,
    VueTailwindToast
  },
  data() {
    return {
      isLoading: false,
      productErrors: [],
      generatedProducts: [],
      selectedProduct: null,
      selectedProductVariantKey: null,
      selectedSize: null,
      drawerId: this.makeId(),
      printingOptions: [
        {
          label: "Screen Printing",
          value: "Screen Printing"
        },
        {
          label: "Direct To Garments (DTG)",
          value: "Direct To Garments (DTG)"
        },
        {
          label: "Heat Press",
          value: "Heat Press"
        }
      ],
      selectedProductProfit: 0,
      selectedProductSizes: [],
      estimatedMinProfit: 0,
      estimatedMaxProfit: 0,
      selectedProductBasePrice: 0,
      calculatorTimeout: null,
      isCalculating: false
    };
  },
  computed: {
    ...mapGetters({
      selectedProducts: "designer/selectedProducts"
    }),
    hasPreviousProductOrVariant() {
      const variationKeys = _.keys(this.selectedProduct.variants);
      const previousVariationKey =
        variationKeys[
          variationKeys.indexOf(this.selectedProductVariantKey) - 1
        ];

      return (
        _.findIndex(this.generatedProducts, { _id: this.selectedProduct._id }) >
          0 || previousVariationKey
      );
    },
    productTotalPrice() {
      return this.selectedProductBasePrice + this.selectedProductProfit;
    },
    selectedVariantIndex() {
      const product = {..._.find(this.selectedProducts, { _id: this.selectedProduct._id })};
      return _.findIndex(product.variants, {
        _id: this.selectedProductVariantKey
      });
    }
  },
  methods: {
    makeId(length = 5) {
      var result = "";
      var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    },
    async collectionConfirmed() {
      if (this.meta.plan === "Sell") {
        this.isLoading = true;
        this.$refs.publishConfirmationModal.hide();
        await this.$store.commit("designer/COLLECTION_STATUS", "pending");
        await this.$store.dispatch("designer/saveData", { shouldGenerateImages: false });
        this.$router.replace("/dashboard/collections");
        return;
      }
    },
    _firstFullThumbnailOf(product){
      return product.variants[this.selectedProductVariantKey].sides[
        this._firstPrintableAreaOf(
          product.variants[this.selectedProductVariantKey].sides
        )
      ].with_placeholder
    },
    _placeholderOfFirstVariantOf(product) {
      const firstKey = _.first(_.keys(product.variants));
      return product.variants[firstKey].sides[
        this._firstPrintableAreaOf(product.variants[firstKey].sides)
      ].with_placeholder;
    },
    _firstPrintableAreaOf(variant) {
      let areas = _.keys(variant);
      return _.includes(areas, "front") ? "front" : _.head(areas);
    },
    show() {
      this.drawerId = this.makeId();
      this.$refs.drawer.show();
    },
    hide() {
      this.$refs.drawer.hide();
    },
    selectProduct(product) {
      this.selectedProduct = JSON.parse(JSON.stringify(product));
    },
    changeCurrentProductPlan({ value }) {
      let plan = "buy";
      if (value) plan = "Sell";
      this.$store.commit("designer/DESIGN_PLAN", plan);
    },
    previousProduct() {
      const previousProductIndex =
        _.findIndex(this.generatedProducts, { _id: this.selectedProduct._id }) -
        1;
      const previousProduct = this.generatedProducts[previousProductIndex];
      const variationKeys = _.keys(this.selectedProduct.variants);

      const previousVariationKey =
        variationKeys[
          variationKeys.indexOf(this.selectedProductVariantKey) - 1
        ];

      if (previousVariationKey) {
        this.selectedProductVariantKey = previousVariationKey;
        return;
      }

      this.selectProduct(previousProduct);
      this.$nextTick(() => {
        this.selectedProductVariantKey = _.last(
          _.keys(previousProduct.variants)
        );
      });
    },
    validateAndSelectProduct(product) {
      const isValidated = this.validateAndSaveMeta();
      if (!isValidated) return;

      this.selectProduct(product);
    },
    validateAndSaveMeta() {
      let isDirty = false;
      this.productErrors = [];

      if (!this.selectedProduct.meta.name.trim()) {
        isDirty = true;
        this.productErrors.push("Product name is required.");
      }

      if (!this.selectedProductProfit && this.meta.plan === "Sell") {
        isDirty = true;
        this.productErrors.push("How much would your profit be?");
      }

      const totalQuantity = _.sum(
        _.map(
          this.selectedProduct.variants[this.selectedProductVariantKey].sizes,
          "quantity"
        )
      );

      if (!totalQuantity) {
        isDirty = true;
        this.productErrors.push(
          `How many of this variant would you like to ${this.meta.plan}?`
        );
      }

      if (totalQuantity < 5) {
        isDirty = true;
        this.productErrors.push(`Must have a minimum quantity of 5`);
      }

      if (isDirty) {
        this.$refs.productValidationToast.show();
        return false;
      }

      this.$store.commit("designer/CURRENT_PRODUCT_META", {
        _id: this.selectedProduct._id,
        meta: this.selectedProduct.meta
      });
      return true;
    },
    nextProduct() {
      const isValidated = this.validateAndSaveMeta();
      if (!isValidated) return;

      const variationKeys = _.keys(this.selectedProduct.variants);
      const nextVariationKey =
        variationKeys[
          variationKeys.indexOf(this.selectedProductVariantKey) + 1
        ];
      if (nextVariationKey) {
        this.selectedProductVariantKey = nextVariationKey;
        return;
      }

      const nextProductIndex =
        _.findIndex(this.generatedProducts, { _id: this.selectedProduct._id }) +
        1;
      const nextProduct = this.generatedProducts[nextProductIndex];

      if (!nextProduct) {
        this.$refs.publishConfirmationModal.show();
        return;
      }

      this.selectProduct(nextProduct);
    },
    setQuantityAndPrice(n, p, v) {
      this.$store.commit("designer/CURRENT_VARIANT_PROPERTIES", {
        path: `sizes.${n}.${p}`,
        value: v
      });
      if (this.meta.plan == "buy") return;
      this._calculateEstProfit();
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
      if (size) {
        this.$store.commit("designer/PRODUCT_PROPERTIES", {
          _id: this.selectedProduct._id,
          props: {
            path: `variants.${this.selectedVariantIndex}.sizes.${size}.quantity`,
            value: this.selectedProductSizes[
              _.findIndex(this.selectedProductSizes, { name: size })
            ].quantity
          }
        });
      }

      this.calculatorTimeout = setTimeout(() => {
        this._calculateEstProfit();
        this.isCalculating = false;
      }, 2000);
    },
    setProductProfit(e) {
      this.selectedProductProfit = parseFloat(e.target.innerHTML);

      _.keys(this.selectedProductSizes).map(
        s => (this.selectedProductSizes[s].price = e)
      );
    }
  },
  watch: {
    products: {
      handler(to, from){
        this.generatedProducts = [...to]
        this.selectedProduct = to[0] || null
        this.selectedProductVariantKey = this.selectedProduct ? _.first(_.keys(this.selectedProduct.variants)) : null
      },
      immediate: true
    },
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

        this.$store.commit("designer/PRODUCT_PROPERTIES", {
          _id: this.selectedProduct._id,
          props: {
            path: `variants.${this.selectedVariantIndex}.sizes`,
            value: this.selectedProductSizes
          }
        });
        this.calculateProfit();
      }
    }
  }
};
</script>
