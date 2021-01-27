<template>
  <VueTailwindDrawer ref="drawer" width="100%">
    <AreaLoader v-if="isLoading" fullscreen />
    <VueTailwindModal
      ref="collectionRenameModal"
      width="30%"
      :backdrop="false"
      content-class="rounded-none shadow-none text-gray-600"
    >
      <div class="flex flex-col">
        <div class="modal-heading border-b w-full p-4">
          <div class="flex justify-between w-full items-center">
            <div class="flex uppercase justify-center flex-grow">
              <strong>Collection Name</strong>
            </div>
          </div>
        </div>
        <div class="modal-body p-4">
          <div>
            <label for="newCollectionName" class="font-bold mb-3 block">Collection Name</label>
            <input
              type="text"
              name="newCollectionName"
              class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
              :class="{ 'border-red-400': errors.has('newCollectionName'), 'focus:border-gray-600': !errors.has('newCollectionName') }"
              :placeholder="currentDesignName"
              v-validate="'required'"
              data-vv-as="Collection Name"
              v-model="newCollectionName"
              @keyup.enter="renameCollection"
            />
            <span
              class="text-red-700 text-xs pt-1 font-bold inline-block"
              v-if="errors.has('newCollectionName')"
            >{{ errors.first('newCollectionName') }}</span>
          </div>
        </div>
        <div class="flex modal-footer justify-between flex-shrink p-4 border-t items-center">
          <button
            type="button"
            class="justify-center items-center focus:outline-none outline-none border px-3 py-2 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
            @click="hideCollectionRenameModal"
          >Cancel</button>

          <button
            type="button"
            class="shadow-xl border border-white bg-primary px-8 py-2 font-bold rounded text-white hover:bg-primary-lighter"
            @click="renameCollection"
          >Save</button>
        </div>
      </div>
    </VueTailwindModal>
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
          {{ meta.plan === 'Sell' ? 'Are you sure you want to publish this collection?' : 'Are you sure you want to proceed?' }}
          <div
            class="text-xs text-text-600 bg-gray-300 p-2 mt-2 text-center"
          >The collection will be reviewed first before {{ meta.plan === "Sell" ? "publishing it into the store" : "we start printing it" }}, you will receive an email once it's approved.</div>
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
    <div class="flex h-full w-full text-gray-600" v-if="selectedProduct">
      <div class="flex flex-col w-full h-full">
        <div class="flex flex-grow-0 items-center border-b p-4">
          <!-- TODO: Add when ready <div class="flex w-4/12 uppercase flex-col" v-if="userTypeIs('seller')">
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
                THIS COLLECTION
                <span v-if="generatedProducts.length > 1">S</span>
              </span>
            </div>
            <div
              class="text-xs mt-1"
            >{{ meta.plan == 'Sell' ? '100% FREE + NO INVENTORY' : 'YOU CAN IMMEDIATELY FULFILL YOUR CUSTOMERS ORDERS' }}</div>
          </div>-->
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

                  <img
                    :src="`${_firstFullThumbnailOf(selectedProduct)}`"
                    :key="`full_${selectedProduct._id}_${drawerId}`"
                    :id="`full_${selectedProduct._id}_${drawerId}`"
                  />
                </div>
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
                    @keyup="updateProductMeta"
                  />
                </div>
                <div class="text-3xl leading-none py-4 flex items-start">
                  <div class="relative flex flex-col" v-if="meta.plan ==='Sell'">
                    <div class="text-xs text-gray-600 uppercase font-bold mb-4">Base Cost</div>
                    <div>
                      PHP {{ selectedProductBasePrice }}
                      <span>+</span>&nbsp;
                    </div>
                  </div>
                  <div class="relative flex flex-col" v-if="meta.plan ==='Sell'">
                    <div class="text-xs text-gray-600 uppercase font-bold mb-1">Your Desired Profit*</div>
                    <div class="flex items-center">
                      <div>PHP&nbsp;</div>
                      <autosize-input
                        input-class="border rounded px-4 py-2 text-center"
                        placeholder="0.00"
                        @change="setQuantityAndProfit"
                        :minWidth="60"
                        :value="selectedProductProfit"
                      />&nbsp;=&nbsp;
                    </div>
                  </div>
                  <div
                    class="text-white bg-primary flex flex-col font-bold px-4 py-2 rounded h-full justify-center"
                  >
                    <div
                      class="text-xs uppercase font-bold mb-1"
                    >{{ meta.plan === 'Sell' ? 'Total Selling Price' : 'Price' }}</div>
                    <div>PHP {{ productTotalPrice }}</div>
                    <div
                      class="text-xs uppercase font-bold mt-1 text-right"
                    >VAT Included</div>
                  </div>
                </div>
                <div class="pt-4" v-if="meta.plan ==='Sell'">
                  <div class="text-xs text-gray-600 uppercase font-bold mb-2">Tags</div>
                  <vue-tags-input
                    v-model="tag"
                    :max-tags="5"
                    :tags="selectedProductTags"
                    @tags-changed="setProductTags"
                    class="custom-tags-input"
                    placeholder="Add Tag (Up to 5 tags only)"
                  />
                </div>
                <div>
                  <div class="my-2" v-if="meta.plan ==='Sell'">
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

                  <div
                    class="bg-gray-200 rounded p-4 shadow"
                    :class="{'mt-2': meta.plan === 'Sell'}"
                  >
                    <div
                      class="font-bold uppercase"
                    >{{ meta.plan ==='Sell' ? 'Profit Calculator' : 'Quantity' }}</div>
                    <div class="flex flex-wrap">
                      <div
                        class="px-4 py-2 border mr-2 hover:border-gray-600 rounded font-bold mt-4 bg-white"
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
                              :min="0"
                              v-model="size.quantity"
                              @input="setQuantityAndProfit(size.quantity, 'quantity', size.name)"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="flex justify-between mt-4 font-bold bg-gray-700 rounded text-white p-4"
                    >
                      <div>{{ meta.plan ==='Sell' ? 'TOTAL ESTIMATED PROFIT' : 'TOTAL' }}</div>
                      <div>
                        <font-awesome-icon v-if="isCalculating" :icon="['fas', 'spinner']" spin />
                        <number
                          animationPaused
                          ref="estMinProfit"
                          :to="estimatedMinProfit"
                          :format="(num) => num.formatMoney('₱ ')"
                          :duration=".4"
                        />
                        <span class="ml-2" v-if="meta.plan ==='Sell'">
                          <span v-tippy="{arrow: true}" title="-12% service fee">
                            <font-awesome-icon
                              v-if="estimatedMinProfit"
                              :icon="['fas', 'question-circle']"
                            />
                          </span>
                        </span>
                      </div>
                    </div>
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
import AutosizeInput from "@/components/AutosizeInput";
import { mapGetters } from "vuex";
import UserTypeCheckerMixin from "@/components/Mixins/UserTypeChecker";

const SERVICE_FEE = 0.12;
const VAT = .12;

export default {
  props: {
    products: {
      required: true,
      default: () => [],
    },
    meta: {
      required: true,
    },
  },
  components: {
    VueTailwindDrawer,
    VueNumericInput,
    OptionButtons,
    VueTailwindModal,
    VueTailwindToast,
    AutosizeInput,
  },
  mixins: [UserTypeCheckerMixin],
  data() {
    return {
      selectedProductSide: "front",
      isLoading: false,
      productErrors: [],
      generatedProducts: [],
      selectedProduct: null,
      selectedProductVariantKey: null,
      selectedSize: null,
      tag: "",
      selectedProductTags: [],
      drawerId: this.makeId(),
      printingOptions: [
        {
          label: "Screen Printing",
          value: "Screen Printing",
        },
        {
          label: "Direct To Garments (DTG)",
          value: "Direct To Garments (DTG)",
        },
        {
          label: "Heat Press",
          value: "Heat Press",
        },
      ],
      selectedProductProfit: 0,
      selectedProductSizes: [],
      estimatedMinProfit: 0,
      selectedProductBasePrice: 0,
      calculatorTimeout: null,
      isCalculating: false,
      newCollectionName: this.currentDesignName,
    };
  },
  computed: {
    ...mapGetters({
      selectedProducts: "designer/selectedProducts",
      currentDesignName: "designer/currentDesignName",
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
      let total = (this.selectedProductBasePrice)

      if (this.meta.plan === "Sell") total = (this.selectedProductBasePrice + this.selectedProductProfit)
      
      return Math.ceil(total + (total * VAT));
    },
    selectedVariantIndex() {
      const product = {
        ..._.find(this.selectedProducts, { _id: this.selectedProduct._id }),
      };
      return _.findIndex(product.variants, {
        _id: this.selectedProductVariantKey,
      });
    },
  },
  methods: {
    switchSides() {
      const sides = _.keys(
        this.selectedProduct.variants[this.selectedProductVariantKey].sides
      );
      const sideIndex = sides.indexOf(this.selectedProductSide);
      const nextSide = sides[sideIndex + 1];
      if (nextSide) {
        this.selectedProductSide = nextSide;
        return;
      }
      this.selectedProductSide = _.first(sides);
    },
    async collectionConfirmed() {
      this.isLoading = true;
      this.$refs.publishConfirmationModal.hide();
      await this.$store.commit("designer/COLLECTION_STATUS", "pending");
      await this.$store.dispatch("designer/saveData", {
        shouldGenerateImages: false,
        isFinal: true,
      });
      this.$router.replace("/dashboard/collections");
    },
    _firstFullThumbnailOf(product) {
      return product.variants[this.selectedProductVariantKey].sides[
        this.selectedProductSide
      ]?.with_placeholder;
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
      let plan = "Buy";
      if (value) plan = "Sell";
      this.$store.commit("designer/DESIGN_PLAN", plan);
      this.calculateProfit();
    },
    previousProduct() {
      const isValidated = this.validateAndSaveMeta();
      if (!isValidated) return;

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
    updateProductMeta() {
      this.generatedProducts[
        _.findIndex(this.generatedProducts, { _id: this.selectedProduct._id })
      ].meta = this.selectedProduct.meta;

      this.$store.commit("designer/PRODUCT_PROPERTIES", {
        _id: this.selectedProduct._id,
        props: {
          path: `meta`,
          value: this.selectedProduct.meta,
        },
      });
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

      if (isDirty) {
        this.$refs.productValidationToast.show();
        return false;
      }

      return true;
    },
    nextProduct() {
      const isValidated = this.validateAndSaveMeta();
      if (!isValidated) return;

      const currentProductIndex = _.findIndex(this.generatedProducts, {
        _id: this.selectedProduct._id,
      });

      const nextProductIndex = currentProductIndex + 1;
      const nextProduct = this.generatedProducts[nextProductIndex];

      const variantKeys = Object.keys(
        this.generatedProducts[currentProductIndex].variants
      );
      const currentVariantKeyIndex = variantKeys.indexOf(
        this.selectedProductVariantKey
      );
      const nextVariantKey = variantKeys[currentVariantKeyIndex + 1];

      if (nextVariantKey)
        return (this.selectedProductVariantKey = nextVariantKey);

      if (!nextProduct) {
        if (
          this.currentDesignName === "Untitled Collection" ||
          !this.currentDesignName
        )
          return this.showCollectionRenameModal();
        this.$refs.publishConfirmationModal.show();
        return;
      }

      this.selectProduct(nextProduct);
    },
    _calculateEstProfit() {
      let totalProfit = 0;
      let printreeNet = 0;
      _.map(this.generatedProducts, (product) => {
        _.map(product.variants, (variant) => {
          _.map(variant.sizes, (size, k) => {
            let availableSize = _.find(
              variant.available_sizes,
              (s) => s.name === size.name
            );
            if (!availableSize) return;

            let baseCost = size.calculatedCost;
            let totalForPrintree = baseCost * size.quantity;
            let totalWithCustomerPrice =
              (baseCost + size.price) * size.quantity;
            let net = totalWithCustomerPrice - totalForPrintree;
            printreeNet += totalForPrintree;
            totalProfit += net;
          });
        });
      });
      let minProfit =
        totalProfit -
        totalProfit * (this.meta.plan === "Sell" ? SERVICE_FEE : 1);
      this.estimatedMinProfit =
        this.meta.plan === "Sell" ? minProfit : printreeNet;
      this.$nextTick(() => {
        if (this.$refs.estMinProfit) this.$refs.estMinProfit.play();
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
    setProductTags(newTags) {
      this.selectedProductTags = newTags;

      this.$store.commit("designer/PRODUCT_PROPERTIES", {
        _id: this.selectedProduct._id,
        props: {
          path: `meta.tags`,
          value: _.map(this.selectedProductTags, "text"),
        },
      });
    },
    setQuantityAndProfit(e, type = "profit", name) {
      if (type === "profit") {
        this.selectedProductProfit = e.target.value
          ? parseFloat(e.target.value)
          : 0;
      }

      _.keys(this.selectedProductSizes).map((s) => {
        this.selectedProductSizes[s].price = this.selectedProductProfit;
      });

      if (type === "quantity") {
        const sizeIndex = _.findIndex(this.selectedProductSizes, {
          name,
        });
        this.selectedProductSizes[sizeIndex].quantity = e;
      }

      const productIndex = _.findIndex(this.selectedProducts, {
        _id: this.selectedProduct._id,
      });

      _.map(this.selectedProduct.variants, (v, vi) => {
        const variantIndex = _.findIndex(
          this.selectedProducts[productIndex].variants,
          { _id: vi }
        );
        if (type === "quantity" && variantIndex !== this.selectedVariantIndex)
          return;

        this.$store.commit("designer/PRODUCT_PROPERTIES", {
          _id: this.selectedProduct._id,
          props: {
            path: `variants[${variantIndex}].sizes`,
            value: _.map(
              this.selectedProducts[productIndex].variants[variantIndex].sizes,
              (s) => {
                const currentSize = _.find(this.selectedProductSizes, {
                  name: s.name,
                });

                return {
                  ...s,
                  price: currentSize?.price,
                  quantity:
                    this.meta.plan === "Sell" ? 0 : currentSize?.quantity,
                };
              }
            ),
          },
        });
      });

      this.calculateProfit();
    },
    showCollectionRenameModal() {
      this.$refs.collectionRenameModal.show();
    },
    async renameCollection() {
      let validationResponse = await this.$validator.validateAll({
        newCollectionName: this.newCollectionName,
      });
      if (!validationResponse || this.isRenameLoading) return;
      if (this.currentDesignName === this.newCollectionName) return;

      this.$store.commit("designer/DESIGN_NAME", this.newCollectionName);

      this.$validator.reset();
      this.hideCollectionRenameModal();
      this.$refs.publishConfirmationModal.show();
    },
    hideCollectionRenameModal() {
      this.$refs.collectionRenameModal.hide();
    },
  },
  watch: {
    products: {
      handler(to, from) {
        this.generatedProducts = [...to];
        this.selectedProduct = to[0] || null;
        this.selectedProductVariantKey = this.selectedProduct
          ? _.first(_.keys(this.selectedProduct.variants))
          : null;
      },
      immediate: true,
    },
    selectedProduct: {
      immediate: true,
      handler(to, from) {
        if (!to) return;
        const firstVariantKey = _.first(_.keys(to.variants));
        this.selectedProductSizes = JSON.parse(
          JSON.stringify(to.variants[firstVariantKey].sizes)
        );
        this.selectedProductVariantKey = firstVariantKey;
        this.selectedProductBasePrice = _.first(
          this.selectedProductSizes
        ).calculatedCost;

        this.selectedProductTags = _.map(to.meta.tags, (text) => ({
          text,
          tiClasses: ["ti-valid"],
        }));

        this.selectedProductProfit =
          to.variants[firstVariantKey].sizes[0].price;

        _.keys(this.selectedProductSizes).map(
          (s) =>
            (this.selectedProductSizes[s].price = this.selectedProductProfit)
        );

        this.selectedProduct.variants[
          this.selectedProductVariantKey
        ].sizes = this.selectedProductSizes;

        const initialSide = this._firstPrintableAreaOf(
          to.variants[this.selectedProductVariantKey].sides
        );
        this.selectedProductSide = initialSide;

        this._calculateEstProfit();
      },
    },
    selectedProductVariantKey: {
      immediate: true,
      handler(to) {
        if (!this.selectedProduct) return;
        this.selectedProductSizes = this.selectedProduct.variants[to].sizes;

        this.generatedProducts[
          _.findIndex(this.generatedProducts, { _id: this.selectedProduct._id })
        ].variants[to].sizes = this.selectedProductSizes;
      },
    },
  },
};
</script>
