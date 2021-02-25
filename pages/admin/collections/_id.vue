<template>
  <div>
    <button
      type="button"
      href="#"
      @click.prevent="goBack"
      class="text-xs text-blue-500 hover:text-blue-700"
    >
      <font-awesome-icon :icon="['fas', 'arrow-left']" />
      <span class="ml-1">Back</span>
    </button>
    <AreaLoader v-if="isLoading" fullscreen/>
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
          <div>Are you sure you want to {{ confirmationAction === 'approval' ? 'publish' : 'decline' }} this collection?</div>
          <div class="mt-4">
            <textarea
              name="notes"
              id="notes"
              cols="30"
              rows="5"
              class="w-full border rounded p-4 outine-none resize-none"
              placeholder="Notes to the designer"
              v-model="notes"
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
    <div class="flex flex-grow text-gray-600 pb-10" v-if="selectedProduct">
      <div class="flex flex-col flex-grow">
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

                  <button
                    type="button"
                    class="absolute top-0 left-0 border rounded flex justify-center items-center w-8 h-8 ml-10 hover:text-primary hover:border-primary"
                    :class="{'text-primary border-primary': selectedProduct.variants[selectedProductVariantKey].sides[selectedProductSide].is_main_thumb}"
                    @click="setAsMainImage"
                    title="Set as main image"
                    v-tippy="{arrow: true}"
                  >
                    <font-awesome-icon :icon="['fas', 'image']" />
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
                    :src="_firstFullThumbnailOf(selectedProduct)"
                    :key="`full_${selectedProduct._id}_${drawerId}`"
                    :id="`full_${selectedProduct._id}_${drawerId}`"
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
                        :key="`variant_${variant._id}_${drawerId}`"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="flex flex-col mt-5 flex-grow ml-4 w-6/12"
                :key="`${selectedProduct._id}-meta`"
              >
                <div class="text-4xl">
                  <span class="font-bold w-full outline-none">{{selectedProduct.meta.name}}</span>

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
                      {{ selectedProductProfit }}
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
                        <th
                          class="w-5/12 text-center py-4 border-r border-white"
                          v-if="meta.plan === 'Sell'"
                        >
                          <span>Base Cost</span>
                        </th>
                        <th class="w-5/12 text-center py-4 border-r border-white" v-if="meta.plan === 'Buy'">
                          <span>Quantity</span>
                        </th>
                        <th class="w-5/12 text-center py-4">
                          <span>Total price per item</span>
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
                        <td class="text-center py-4 border-r" v-if="meta.plan === 'Sell'">
                          <span>PHP {{size.calculatedCost}}</span>
                        </td>
                        <td class="text-center py-4 border-r" v-if="meta.plan === 'Buy'">{{size.quantity}}</td>
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
                      <tr class="bg-primary border border-top text-white" v-if="meta.plan === 'Buy'">
                        <td
                          :colspan="meta.plan ==='Sell' ? 3 : 2"
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
                  <div class="text-xs text-gray-600 uppercase font-bold mb-2">Tags</div>
                  <div class="flex">
                    <span
                      v-for="(tag, i) in selectedProduct.meta.tags"
                      :key="i"
                      class="mr-2 px-2 py-1 bg-blue-600 rounded text-white text-xs"
                    >{{ tag }}</span>
                  </div>
                </div>

                <div>
                  <div class="my-2" v-if="meta.plan ==='Sell'">
                    <div class="text-xs text-gray-600 uppercase font-bold mb-2">Description</div>
                    <div
                      class="w-full border rounded p-4 outine-none resize-none h-40"
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
                      class="flex flex-col border rounded w-full cursor-pointer hover:border-gray-500"
                      :class="{
                        'border-gray-500 shadow-xl':
                          selectedProduct._id === product._id
                      }"
                      @click="selectProduct(product)"
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
        <div
          class="flex p-4 items-center border-t fixed bottom-0 w-full bg-white left-0"
          :class="{'justify-end': ['declined', 'approved'].includes(meta.status), 'justify-between': ['pending', 'reviewing'].includes(meta.status)}"
        >
          <PTButton
            @click="confirmAction('decline')"
            v-if="['pending', 'reviewing'].includes(meta.status)"
          >DECLINE</PTButton>
          <PTButton
            color="primary"
            v-if="['pending', 'declined', 'reviewing', 'approved'].includes(meta.status)"
            @click="confirmAction('approval')"
          >{{ meta.status === 'approved' ? 'UPDATE' : "PUBLISH" }}</PTButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueTailwindModal from "@/components/VueTailwindModal";
import VueTailwindDrawer from "@/components/VueTailwindDrawer";
import VueNumericInput from "@/components/VueNumericInput";
import UserTypeCheckerMixin from "@/components/Mixins/UserTypeChecker";
import { ContentLoader } from "vue-content-loader";

const SERVICE_FEE = 0.12;
const VAT = 0.12;

export default {
  layout: "admin_dashboard",
  components: {
    VueTailwindDrawer,
    VueTailwindModal,
    VueNumericInput,
    ContentLoader,
  },
  mixins: [UserTypeCheckerMixin],
  async mounted() {
    const { id } = this.$route.params;
    this.isLoading = true;
    const collectionData = await this.$store.dispatch(
      "designer/fetchDesignData",
      id
    );

    this.generatedProducts = _.map(collectionData.products, () => null);

    _.map(collectionData.products, () => null);
    await collectionData.products.reduce(async (promise, product, i) => {
      await promise;

      const res = await this.$axios.post("/create-images", {
        products: [product],
      });

      this.$set(this.generatedProducts, i, _.first(res.data))

      if (i === 0) {
        this.loadingText = "";
        this.isLoading = false;

        this.selectedProductVariantKey = _.first(
          _.keys(JSON.parse(JSON.stringify(res.data[0])).variants)
        );
        this.meta = _.omit(collectionData, ["products"]);
        this.selectedProduct = res.data[0] || null;
        this.selectedProductVariantKey = _.first(
          _.keys(this.selectedProduct.variants)
        );
      }

      this.calculateProfit();
    }, Promise.resolve());

    if (collectionData.status === "pending")
      await this.$store.dispatch("admin/updateCollectionStatus", {
        _id: id,
        status: "reviewing",
      });
  },
  data() {
    return {
      meta: {},
      selectedProductSide: null,
      confirmationAction: null,
      drawerId: this.makeId(),
      isLoading: false,
      generatedProducts: [],
      selectedProduct: null,
      selectedProductVariantKey: null,
      selectedSize: null,
      selectedProductProfit: 0,
      selectedProductSizes: [],
      estimatedMinProfit: 0,
      estimatedMaxProfit: 0,
      selectedProductBasePrice: 0,
      calculatorTimeout: null,
      isCalculating: false,
      notes: null,
    };
  },
  methods: {
    _totalPriceFor(size) {
      let preTotal = size.calculatedCost;

      if (this.meta.plan === "Sell")
        preTotal = this.selectedProductProfit + size.calculatedCost;

      const total = preTotal + preTotal * VAT;

      return this.meta.plan === "Sell" ? Math.ceil(total) : total;
    },
    goBack() {
      this.$router.back();
    },
    _firstFullThumbnailOf(product) {
      return product.variants[this.selectedProductVariantKey].sides[
        this.selectedProductSide
      ]?.with_placeholder;
    },
    _toggleMainThumb() {
      _.map(this.selectedProduct.variants, (variant, vk) => {
        _.map(variant.sides, (s, k) => {
          if (k === this.selectedProductSide) {
            variant.sides[k].is_main_thumb = !s.is_main_thumb;
            return;
          }
          variant.sides[k].is_main_thumb = false;
        });
      });
    },
    async setAsMainImage() {
      try {
        const res = this.$store.dispatch(
          "user_dashboard/setVariantMainThumbnail",
          {
            _id: this.selectedProductVariantKey,
            side: this.selectedProductSide,
          }
        );

        this._toggleMainThumb();

        this.$toast.success("Saved!", {
          position: "top",
        });
      } catch (error) {
        console.log(error);
        this.$toast.error("Unable to set main image. Please try again.", {
          position: "top",
        });
      }
    },
    async markAsFeatured() {
      this.isLoading = true;
      const res = await this.$store.dispatch("admin/markAsFeatured", {
        type: "product",
        obj: this.selectedProduct,
        is_marked: this.selectedProduct.featured_at ? true : false,
      });
      this.selectedProduct = res.data;
      this.isLoading = false;
      this.$toast.success(
        this.selectedProduct.featured_at
          ? "Product is now featured!"
          : "Product has been unfeatured!",
        {
          position: "top",
        }
      );
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
    downloadDesign() {
      const fileName = `${this.selectedProduct.meta.name}-${this.selectedProduct._id}`;
      const fileType = "image/svg+xml";
      let content = this.selectedProduct.variants[
        this.selectedProductVariantKey
      ].sides[this.selectedProductSide].design;

      let a = document.createElement("a");
      a.target = "_blank";
      a.download = `(${this.selectedProductSide.toUpperCase()})${fileName}.svg`;
      a.href = content;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () {
        URL.revokeObjectURL(a.href);
      }, 1500);
    },
    async updateCollectionStatus() {
      this.isLoading = true;
      this.$refs.publishConfirmationModal.hide();
      let status = "approved";
      if (this.confirmationAction === "decline") status = "declined";
      if (this.confirmationAction === "approval" && this.meta.plan === "Buy")
        status = "to pay";

      await this.setAsMainImage();

      await this.$store.dispatch("admin/updateCollectionStatus", {
        _id: this.meta._id,
        status,
        notes: this.notes,
      });
      this.meta.status = status
      this.isLoading = false;
      this.$toast.success("Collection status has been updated successfully!", {
        position: "top",
      });
    },
    selectProduct(product) {
      this.selectedProduct = JSON.parse(JSON.stringify(product));
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
    confirmAction(action) {
      this.confirmationAction = action;
      this.$refs.publishConfirmationModal.show();
    },
  },
  computed: {
    productTotalPrice() {
      let total = this.selectedProductBasePrice;

      if (this.meta.plan === "Sell")
        total = this.selectedProductBasePrice + this.selectedProductProfit;

      return this.meta.plan === "Sell" ? Math.ceil(total + total * VAT) : total;
    },
    hasPreviousProductOrVariant() {
      const variationKeys = _.keys(this.selectedProduct.variants);
      const previousVariationKey =
        variationKeys[
          variationKeys.indexOf(this.selectedProductVariantKey) - 1
        ];

      return (
        _.findIndex(this.generatedProducts, { id: this.selectedProduct._id }) >
          0 || previousVariationKey
      );
    },
  },
  watch: {
    selectedProduct: {
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

        this._toggleMainThumb();

        this._calculateEstProfit();
      },
    },
    selectedProductVariantKey: {
      handler(to) {
        if (!this.selectedProduct) return;
        this.selectedProductSizes = this.selectedProduct.variants[to].sizes;

        this.generatedProducts[
          _.findIndex(this.generatedProducts, { _id: this.selectedProduct._id })
        ].variants[to].sizes = this.selectedProductSizes;

        this._toggleMainThumb();
      },
    },
    selectedProductProfit: {
      handler(to) {
        if (!this.selectedProduct) return;
        const firstVariantKey = _.first(_.keys(this.selectedProduct.variants));
        this.selectedProductSizes = this.selectedProduct.variants[
          firstVariantKey
        ].sizes;

        _.keys(this.selectedProductSizes).map(
          (s) => (this.selectedProductSizes[s].price = to)
        );

        this.generatedProducts[
          _.findIndex(this.generatedProducts, { _id: this.selectedProduct._id })
        ].variants[
          this.selectedProductVariantKey
        ].sizes = this.selectedProductSizes;

        this.calculateProfit();
      },
    },
  },
};
</script>