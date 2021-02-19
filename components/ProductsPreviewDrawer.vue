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
            class="text-text-600 bg-red-800 p-2 mt-2 text-center text-white rounded"
          >The collection will be reviewed first before {{ meta.plan === "Sell" ? "publishing it into the store" : "we start the printing process" }}, you will receive an email for the payment process once it's approved.</div>
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
      <div class="font-bold">Oops! Please fill up the required fields:</div>
      <ul class="text-sm list-disc">
        <li v-for="(error, i) in productErrors" :key="i">{{ error }}</li>
      </ul>
    </VueTailwindToast>
    <VueTailwindToast placement="top-center" ref="nextProductToast">
      <div class="font-bold">Please wait...</div>
      <div class="text-sm">We're still generating your product(s), please bear with us.</div>
    </VueTailwindToast>
    <div class="flex h-full w-full text-gray-600">
      <div class="flex flex-col w-full h-full">
        <div class="flex flex-grow-0 items-center border-b p-4 justify-between">
          <div class="flex w-2/6 uppercase flex-col" v-if="userTypeIs('seller')">
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
          </div>
          <div
            class="flex h-8 items-center font-bold"
            :class="{ 'w-3/6': userTypeIs('buyer'), 'w-2/6 justify-center': userTypeIs('seller') }"
          >Set Collection Details</div>
          <div
            class="flex justify-end"
            :class="{ 'w-3/6': userTypeIs('buyer'), 'w-2/6': userTypeIs('seller') }"
          >
            <div
              class="select-none cursor-pointer w-8 h-8 border rounded-full flex justify-center items-center hover:border-gray-600 hover:text-gray-700"
              @click="hide"
              v-if="!isGenerating"
            >
              <font-awesome-icon :icon="['fas', 'times']" class="text-xs" />
            </div>
          </div>
        </div>
        <div class="flex flex-grow pb-16">
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
                    v-if="selectedProduct"
                  >
                    <font-awesome-icon :icon="['fas', 'sync-alt']" />
                  </button>

                  <ContentLoader
                    :width="476"
                    :height="500"
                    :speed="2"
                    primaryColor="#f3f3f3"
                    secondaryColor="#ecebeb"
                    v-if="!selectedProduct"
                  >
                    <rect x="0" y="25" rx="0" ry="0" width="476" height="475" />
                  </ContentLoader>
                  <img
                    :src="`${_firstFullThumbnailOf(selectedProduct)}`"
                    :key="`full_${selectedProduct._id}_${drawerId}`"
                    :id="`full_${selectedProduct._id}_${drawerId}`"
                    v-if="selectedProduct"
                  />
                </div>
                <div class="variants flex" v-if="selectedProduct">
                  <div
                    class="flex w-1/5 cursor-pointer border border-transparent hover:border-gray-500 p-1 rounded mr-1"
                    v-for="(variant, vid) in selectedProduct.variants"
                    :class="{
                      'border-gray-500 shadow-xl': selectedProductVariantKey === vid
                    }"
                    :key="`${vid}_${variant._id}_${drawerId}`"
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
              <div class="flex flex-col mt-5 w-full ml-4 w-6/12">
                <div class="text-4xl">
                  <span
                    v-if="meta.plan === 'Buy' && selectedProduct"
                    class="font-bold w-full outline-none"
                  >{{selectedProduct.meta.name}}</span>

                  <input
                    v-if="selectedProduct && meta.plan === 'Sell'"
                    type="text"
                    class="font-bold w-full outline-none border rounded px-4 py-2"
                    placeholder="What's the name of this product?*"
                    v-model="selectedProduct.meta.name"
                    @keyup="updateProductMeta"
                  />

                  <ContentLoader
                    :width="476"
                    :height="50"
                    :speed="2"
                    primaryColor="#f3f3f3"
                    secondaryColor="#ecebeb"
                    v-if="!selectedProduct"
                  >
                    <rect x="0" y="0" rx="0" ry="0" width="476" height="50" />
                  </ContentLoader>
                </div>
                <div
                  class="text-3xl leading-none py-4 flex items-start"
                  v-if="meta.plan ==='Sell' && selectedProduct"
                >
                  <div class="relative flex flex-col">
                    <div class="text-xs text-gray-600 uppercase font-bold mb-1">Profit per item*</div>
                    <div class="flex items-center">
                      <div>PHP&nbsp;</div>
                      <autosize-input
                        input-class="border rounded px-4 py-2 text-center"
                        placeholder="0.00"
                        @change="setQuantityAndProfit"
                        :minWidth="60"
                        :value="selectedProductProfit"
                      />
                    </div>
                  </div>
                  <ContentLoader
                    :width="476"
                    :height="56"
                    :speed="2"
                    primaryColor="#f3f3f3"
                    secondaryColor="#ecebeb"
                    v-if="!selectedProduct"
                  >
                    <rect x="0" y="0" rx="0" ry="0" width="128" height="56" />
                    <rect x="149" y="0" rx="0" ry="0" width="128" height="56" />
                    <rect x="296" y="0" rx="0" ry="0" width="128" height="56" />
                  </ContentLoader>
                </div>
                <div :class="{'my-4': meta.plan === 'Buy'}">
                  <table v-if="selectedProduct" class="table-fixed w-full border">
                    <thead class="justify-between">
                      <tr class="bg-gray-300">
                        <th class="w-2/12 text-center py-4 border-r border-white">
                          <span>Size</span>
                        </th>
                        <th class="w-5/12 text-center py-4 border-r border-white">
                          <span>Base Cost</span>
                        </th>
                        <th class="w-5/12 text-center py-4 border-r border-white">
                          <span>{{ meta.plan === "Buy" ? "Quantity" : "If I sell..." }}</span>
                        </th>
                        <th class="w-5/12 text-center py-4">
                          <span>Total Selling Price</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        class="bg-white"
                        :key="i"
                        v-for="(size, i) in selectedProduct
                          .variants[selectedProductVariantKey].sizes"
                      >
                        <td class="text-center py-4 border-r">
                          <span class="text-center font-semibold">{{size.name}}</span>
                        </td>
                        <td class="text-center py-4 border-r">
                          <span>PHP {{size.calculatedCost}}</span>
                        </td>
                        <td class="text-center py-4 border-r">
                          <VueNumericInput
                            :key="`${selectedProductVariantKey}_${size.name}`"
                            align="center"
                            style="width: 90px"
                            class="ml-1"
                            :min="0"
                            v-model="size.quantity"
                            @input="setQuantityAndProfit(size.quantity, 'quantity', size.name)"
                          />
                        </td>
                        <td class="text-right p-4 font-bold">
                          <div class="text-primary">
                            <number
                              :to="(_totalPriceFor(size) || 0)"
                              :format="(num) => num.formatMoney('₱ ')"
                              :duration=".4"
                            />
                          </div>
                          <div class="text-xs font-normal">VAT Included</div>
                        </td>
                      </tr>
                      <tr class="bg-primary border border-top text-white">
                        <td
                          colspan="3"
                          class="p-4 font-bold text-right"
                        >{{ meta.plan ==='Sell' ? 'TOTAL ESTIMATED PROFIT' : 'TOTAL' }}</td>
                        <td colspan="4" class="text-right p-4 font-bold border border-left">
                          <div>
                            <font-awesome-icon
                              v-if="isCalculating"
                              :icon="['fas', 'spinner']"
                              spin
                            />
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
                        </td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                  <ContentLoader
                    :width="476"
                    :height="56"
                    :speed="2"
                    primaryColor="#f3f3f3"
                    secondaryColor="#ecebeb"
                    v-if="!selectedProduct"
                  >
                    <rect x="0" y="0" rx="0" ry="0" width="128" height="56" />
                    <rect x="149" y="0" rx="0" ry="0" width="128" height="56" />
                    <rect x="296" y="0" rx="0" ry="0" width="128" height="56" />
                  </ContentLoader>
                </div>
                <div class="pt-4" v-if="meta.plan ==='Sell'">
                  <div v-if="selectedProduct">
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
                  <ContentLoader
                    :width="476"
                    :height="16"
                    :speed="2"
                    primaryColor="#f3f3f3"
                    secondaryColor="#ecebeb"
                    v-if="!selectedProduct"
                  >
                    <rect x="0" y="0" rx="5" ry="5" width="476" height="16" />
                  </ContentLoader>
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
                      v-if="selectedProduct"
                    ></textarea>
                    <ContentLoader
                      :width="476"
                      :height="100"
                      :speed="2"
                      primaryColor="#f3f3f3"
                      secondaryColor="#ecebeb"
                      v-if="!selectedProduct"
                    >
                      <rect x="0" y="0" rx="5" ry="5" width="476" height="100" />
                    </ContentLoader>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex justify-end p-4 border-t fixed bottom-0 w-full bg-white">
              <div class="flex">
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
          </div>
          <div class="flex border-l w-3/12">
            <div class="flex flex-col w-full">
              <div class="flex p-4 uppercase border-b">
                <strong>My Products</strong>
              </div>
              <div class="overflow-auto h-full">
                <div class="flex p-4 flex-wrap">
                  <div class="flex w-6/12 p-1" v-if="!selectedProduct">
                    <ContentLoader
                      :width="175"
                      :height="195"
                      :speed="2"
                      primaryColor="#f3f3f3"
                      secondaryColor="#ecebeb"
                    >
                      <rect x="0" y="0" rx="0" ry="0" width="175" height="195" />
                    </ContentLoader>
                  </div>
                  <div
                    class="flex w-6/12 p-1"
                    v-for="product in generatedProducts"
                    :key="product ? product._id : makeId()"
                  >
                    <ContentLoader
                      :width="175"
                      :height="195"
                      :speed="2"
                      primaryColor="#f3f3f3"
                      secondaryColor="#ecebeb"
                      v-if="!product"
                    >
                      <rect x="0" y="0" rx="0" ry="0" width="175" height="195" />
                    </ContentLoader>
                    <div
                      class="flex flex-col border-2 rounded w-full cursor-pointer hover:border-primary"
                      :class="{
                        'border-primary':
                          selectedProduct._id === product._id
                      }"
                      @click="validateAndSelectProduct(product)"
                      v-if="product"
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
import { ContentLoader } from "vue-content-loader";

const SERVICE_FEE = 0.12;
const VAT = 0.12;

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
    ContentLoader,
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
      if (!this.selectedProduct) return;
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
      if (!this.selectedProduct) return;
      let total = this.selectedProductBasePrice;

      if (this.meta.plan === "Sell")
        total = this.selectedProductBasePrice + this.selectedProductProfit;

      return this.meta.plan === "Sell" ? Math.ceil(total + total * VAT) : total;
    },
    selectedVariantIndex() {
      if (!this.selectedProduct) return -1;
      const product = {
        ..._.find(this.selectedProducts, { _id: this.selectedProduct._id }),
      };
      return _.findIndex(product.variants, {
        _id: this.selectedProductVariantKey,
      });
    },
    isGenerating() {
      return (
        this.generatedProducts.filter((e) => e).length !==
        this.generatedProducts.length
      );
    },
  },
  methods: {
    _totalPriceFor(size) {
      let preTotal = size.calculatedCost;

      if (this.meta.plan === "Sell")
        preTotal = this.selectedProductProfit + size.calculatedCost;

      const total = preTotal + preTotal * VAT;

      return this.meta.plan === "Sell" ? Math.ceil(total) : total;
    },
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
        this.productErrors.push("How much is your desired profit?");
      }

      const selectedVariantQuantity = _.sum(
        _.map(
          this.selectedProduct.variants[this.selectedProductVariantKey].sizes,
          (s) => s.quantity
        )
      );
      if (!selectedVariantQuantity && this.meta.plan === "Buy") {
        isDirty = true;
        this.productErrors.push(
          "Please set at least 1 quantity for each product."
        );
      }

      if (isDirty) {
        this.$refs.productValidationToast.show();
        return false;
      }

      return true;
    },
    nextProduct() {
      if (!this.selectedProduct) {
        this.$refs.nextProductToast.show();
        return;
      }
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
        if (this.isGenerating) {
          this.$refs.nextProductToast.show();
          return;
        }
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
        if (!product) return;
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
        this.meta.plan === "Sell" ? minProfit : printreeNet + printreeNet * VAT;
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
        if (!to[0]) return;
        this.generatedProducts = [...to];
        this.selectedProduct = to[0];
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
