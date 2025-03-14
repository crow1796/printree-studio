<template>
  <div
    class="flex h-full w-full"
    v-intro="'Welcome to the studio, this is where you can add designs to the products that you\'ve selected...'"
    v-intro-disable-interaction="true"
  >
    <AreaLoader v-if="isLoading" fullscreen />
    <div class="flex flex-grow w-full relative" v-else>
      <VueTailwindDrawer ref="availableProductsModal" width="70%" :closeOnBackdropClicked="false">
        <AreaLoader v-if="isAvailableProductsLoading" />
        <div class="flex flex-col flex-grow">
          <div class="modal-heading border-b w-full p-4 text-gray-600">
            <div class="flex justify-between w-full items-center">
              <div class="flex uppercase flex-col">
                <div>
                  <strong>Select Products</strong>
                </div>
                <div
                  class="text-xs normal-case"
                >Each collection can only have a maximum of 10 products.</div>
              </div>
              <div class="flex text-right">
                <div
                  class="select-none cursor-pointer w-8 h-8 border rounded-full flex justify-center items-center hover:border-gray-600 hover:text-gray-700"
                  @click="hideAvailableProducts"
                >
                  <font-awesome-icon :icon="['fas', 'times']" class="text-xs" />
                </div>
              </div>
            </div>
          </div>
          <div class="flex modal-body flex-grow">
            <AvailableProducts v-model="tmpProducts" />
          </div>
          <div class="flex modal-footer justify-between p-4 border-t items-center">
            <a
              href="#"
              class="text-blue-400 cursor-help border-dashed border-b hover:border-blue-400"
            >{{ tmpProducts.length }} Products Selected</a>
            <button
              type="button"
              class="border border-white bg-primary px-8 py-2 font-bold rounded text-white hover:bg-primary-lighter"
              @click="manageProducts"
            >CONTINUE</button>
          </div>
        </div>
      </VueTailwindDrawer>

      <VueTailwindModal
        ref="productDeletionModal"
        width="30%"
        content-class="rounded-none shadow-none text-gray-600"
        :backdrop="false"
      >
        <AreaLoader v-if="isProductDeleteLoading" />
        <div class="flex flex-col">
          <div class="modal-heading border-b w-full p-4">
            <div class="flex justify-between w-full items-center">
              <div class="flex uppercase justify-center flex-grow">
                <strong>Confirmation</strong>
              </div>
            </div>
          </div>
          <div class="modal-body p-4 text-center">Are you sure you want to delete this product?</div>
          <div class="flex modal-footer justify-between flex-shrink p-4 border-t items-center">
            <button
              type="button"
              class="justify-center items-center focus:outline-none outline-none border px-3 py-2 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
              @click="hideDeleteCollectionConfirmation"
            >No</button>

            <button
              type="button"
              class="shadow-xl border border-white bg-primary px-8 py-2 font-bold rounded text-white hover:bg-primary-lighter"
              @click="productDeleteConfirm"
            >Yes</button>
          </div>
        </div>
      </VueTailwindModal>

      <div class="flex w-1/5 border-r flex-grow flex-col" v-if="!isSingle">
        <div class="flex overflow-hidden w-full flex-grow flex-col overflow-auto flex-grow">
          <div
            class="h-20 cursor-pointer flex items-center justify-center m-4 border border-dashed border-gray-500 hover:border-gray-700 hover:bg-gray-100"
            @click="showAvailableProducts"
            v-if="selectedProducts.length < 10"
            v-intro="'And if you want to add more products, just click on this button... (Note: You can add the same products multiple times)'"
            v-intro-step="5"
            v-intro-disable-interaction="true"
          >
            <font-awesome-icon :icon="['fas', 'cubes']" class="mr-2 text-lg" />
            <span class="font-bold">ADD MORE PRODUCTS</span>
          </div>
          <div class="flex flex-wrap flex overflow-auto border-t">
            <div class="w-full" v-for="(product, index) in selectedProducts" :key="index">
              <div
                class="p-1 relative cursor-pointer hover:bg-gray-100 select-none text-gray-600 w-auto justify-center items-center flex border-b relative"
                :class="{ 'bg-gray-100': index == currentProductIndex }"
                @click="selectProduct(index)"
              >
                <div class="absolute right-0 top-0" v-if="selectedProducts.length > 1">
                  <button
                    type="button"
                    class="cursor-pointer rounded hover:bg-gray-200 w-8 h-8 flex justify-center items-center"
                    v-tippy="{arrow: true}"
                    title="Delete this product"
                    @click.stop="showProductDeletionModal(index)"
                  >
                    <font-awesome-icon :icon="['fas', 'trash']" class="text-xs" />
                  </button>
                </div>
                <div class="flex w-full items-center">
                  <img :src="_firstVariantPlaceholderOf(product)" style="height: 70px" />
                  <div class="flex flex-col pt-2 flex-grow">
                    <div>
                      <div
                        class="font-bold text-xs rounded-full ml-2 uppercase inline-block px-2 py-1"
                        :class="{
                    'bg-green-600 text-white': product.status === 'approved',
                    'bg-red-600 text-white': product.status === 'declined',
                    'bg-blue-600 text-white': product.status === 'pending',
                    'bg-gray-600 text-white': !['approved', 'declined', 'pending'].includes(product.status),
                  }"
                      >{{product.status}}</div>
                    </div>
                    <div
                      class="font-bold text-gray-600 px-2 truncate w-full"
                    >{{ product.meta.name }}</div>
                    <div class="flex ml-2 mt-3 flex-col mb-2">
                      <span class="mr-1 text-xs">Variants</span>
                      <div class="flex mt-1 flex-wrap">
                        <div
                          class="rounded-full border border-white mr-1"
                          v-for="(variant, variantIndex) in product.variants"
                          :key="variantIndex"
                        >
                          <div
                            class="flex justify-center items-center rounded-full cursor-pointer w-3 h-3 border border-gray-600"
                            :style="{ 'background-color': variant.customizableVariant.color }"
                          ></div>
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

      <div class="flex flex-grow h-full flex-col w-3/4">
        <transition name="fade">
          <div
            class="auto-save uppercase font-bold absolute rounded top-0 right-0 w-24 py-1 mt-4 mr-4 text-gray-600 text-xs border bg-white"
            v-if="autoSaving"
            style="animation-duration: .3s;"
          >{{ autoSavingText }}</div>
        </transition>
        <RightActions
          v-if="currentProduct"
          :isExpandable="currentProduct.customizableProduct.customizableVariants.length > 2"
        >
          <div
            class="w-8 h-8 rounded-full cursor-pointer mx-2 my-1 border border-gray-300 flex justify-center items-center relative"
            v-for="(variant, variantIndex) in currentProduct.customizableProduct.customizableVariants"
            :key="variantIndex"
            :class="{
                      'border-gray-300 bg-white': _colorIsInVariantsOf(
                        currentProduct,
                        variant.color
                      ),
                    }"
            @click="() => _colorIsInVariantsOf(
                      currentProduct,
                      variant.color
                    ) ? selectVariant(_variantIndexOf(variant), currentProductIndex) : addVariant(variant)"
            :style="{
                    'background-color': variant.color,
                  }"
          >
            <div
              class="absolute rounded-full bg-white border border-gray-400 flex justify-center text-red-700 items-center w-4 h-4 remove-variant-btn"
              v-if="_colorIsInVariantsOf(
                      currentProduct,
                      variant.color
                    )
                  "
              @click.stop="addVariant(variant)"
            >
              <font-awesome-icon :icon="['fas', 'times']" class="text-xs text-red" />
            </div>
            <font-awesome-icon
              :icon="['fas', 'check']"
              :style="{
                        color: getCorrectColor(variant.color),
                        fontSize: '.8em',
                      }"
              v-if="currentVariantIndex === _variantIndexOf(variant)
                  "
            />
            <font-awesome-icon
              :icon="['fas', 'plus']"
              :style="{
                        color: getCorrectColor(variant.color),
                        fontSize: '.8em',
                      }"
              v-if="!_colorIsInVariantsOf(
                      selectedProducts[currentProductIndex],
                      variant.color
                    )
                  "
            />
          </div>
        </RightActions>

        <Preview
          :key="`preview-${currentProduct._id}-${currentProductIndex}-${currentVariantIndex}-${currentSide}`"
          :scale="0.4"
          :variant="currentProduct.variants[currentVariantIndex]"
          :content="currentVariantContent"
          :resizable="true"
          class="designer-preview"
          @main-thumb-changed="updateMainThumb"
        />

        <Canvas
          v-intro="'This is the canvas, this is where you can resize and position your designs...'"
          v-intro-step="2"
          v-intro-disable-interaction="true"
          :key="`canvas-${currentProduct._id}-${currentProductIndex}-${currentVariantIndex}-${currentSide}`"
          v-model="currentVariantContent.objects"
          :width="currentVariantContent.bounds.width * 4"
          :height="currentVariantContent.bounds.height * 4"
          :backgroundColor="currentProduct.variants[currentVariantIndex].customizableVariant.color"
        >
          <BottomActions
            :items="currentVariantSides"
            @change="(val) => $store.dispatch('designer/switchSideTo', val)"
          />
        </Canvas>
      </div>

      <VueTailwindDrawer
        position="right"
        ref="productMetaDrawer"
        @hidden="rightDrawerHidden"
        v-if="designMeta.plan == 'sell'"
      >
        <div class="flex flex-grow flex-col text-gray-600">
          <div class="flex border-b w-full p-4">
            <div class="flex justify-between w-full items-center">
              <div class="flex uppercase">
                <strong>Product Metadata</strong>
              </div>
              <div class="flex text-right">
                <div
                  class="select-none cursor-pointer w-8 h-8 border rounded-full flex justify-center items-center hover:border-gray-600 hover:text-gray-700"
                  @click="toggleDrawer('productMetaDrawer')"
                >
                  <font-awesome-icon :icon="['fas', 'times']" class="text-xs" />
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-grow flex-wrap p-4">
            <div class="w-full">
              <div class="mb-3">
                <label for="product_name" class="font-bold">Product Name</label>
                <div class="mt-2">
                  <input
                    name="product_name"
                    class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                    type="text"
                    :class="{
                      'border-red-400': errors.has('product_name'),
                      'focus:border-gray-600': !errors.has('name'),
                    }"
                    placeholder="Product Name"
                    data-vv-as="Product Name"
                    v-validate="'required'"
                    v-model="tmpProductMetadata.name"
                  />
                </div>
                <span
                  class="text-red-700 text-xs pt-1 font-bold inline-block"
                  v-if="errors.has('product_name')"
                >{{ errors.first("product_name") }}</span>
              </div>
              <div>
                <label for="product_description" class="font-bold">Product Description</label>
                <div>
                  <WrappedEditor v-model="tmpProductMetadata.description" />
                </div>
                <span
                  class="text-red-700 text-xs pt-1 font-bold inline-block"
                  v-if="errors.has('product_description')"
                >{{ errors.first("product_description") }}</span>
              </div>
            </div>
          </div>
          <div class="flex p-4 justify-end border-t">
            <PTButton color="primary" @click="saveProductMetadata">SAVE</PTButton>
          </div>
        </div>
      </VueTailwindDrawer>
    </div>
  </div>
</template>

<script>
import VueTailwindModal from "@/components/VueTailwindModal";
import Select from "@/components/Select";
import ColorRegulator from "~/plugins/color-regulator.js";
import { mapGetters } from "vuex";
import AvailableProducts from "@/components/Designer/AvailableProducts";
import VueTailwindDrawer from "@/components/VueTailwindDrawer";
import VueTailwindAccordion from "@/components/VueTailwindAccordion";
import WrappedEditor from "@/components/WrappedEditor";
import draggable from "vuedraggable";
import Konva from "@/components/Designer/Canvas/Konva";
import BottomActions from "@/components/Designer/Canvas/Actions/Bottom";
import {
  Canvas,
  Output,
  Preview,
} from "@/components/Designer/Canvas/Default/index.js";
import RightActions from "@/components/Designer/Canvas/Actions/Right";

let WebFontLoader = null;
if (process.client) {
  WebFontLoader = require("webfontloader");
}

export default {
  layout: "designer",
  components: {
    Select,
    BottomActions,
    AvailableProducts,
    WrappedEditor,
    VueTailwindDrawer,
    VueTailwindAccordion,
    draggable,
    Konva,
    Canvas,
    Output,
    Preview,
    VueTailwindModal,
    RightActions,
  },
  created() {
    if (this.$device.isMobile) return this.$router.replace("/no-mobile");
  },
  async mounted() {
    if (!this.$storage.getLocalStorage("designer_tour")) {
      const intro = this.$intro();
      intro.start();
      intro.onexit(() => {
        this.$storage.setLocalStorage("designer_tour", "1");
      });
    }
    WebFontLoader.load({
      google: {
        families: _.map(this.webfonts, "value"),
      },
    });

    this.currentProduct = JSON.parse(JSON.stringify(this.selectedProducts[0]));
    this.currentVariant = this.currentProduct.variants[0];
    this.$store.commit("designer/CURRENT_VARIANT_INDEX", 0);
    this.isLoading = false;
  },
  data() {
    return {
      isSingle: this.$flags.flagIs("single", "on"),
      isProductDeleteLoading: false,
      autoSavingTimeout: null,
      autoSaving: false,
      autoSavingText: "Saving...",
      isAvailableProductsLoading: false,
      isLayersCollapsed: false,
      productDescriptionEditor: null,
      fontSizeTimeout: null,
      isLoading: false,
      tmpProducts: [],
      isPrintableAreaHovered: false,
      selectedFont: null,
      currentProduct: null,
      currentVariant: null,
      isMoving: false,
      highlightRuler: {
        vertical: false,
        horizontal: false,
      },
      printableAreaZ: 2,
      tmpProductMetadata: {
        name: "",
        description: "",
        tags: "",
      },
      productToDeleteIndex: -1,
    };
  },
  computed: {
    ...mapGetters({
      webfonts: "designer/webfonts",
      selectedProducts: "designer/selectedProducts",
      currentProductIndex: "designer/currentProductIndex",
      currentVariantIndex: "designer/currentVariantIndex",
      currentSide: "designer/currentSide",
      currentDesignId: "designer/currentDesignId",
      designMeta: "designer/designMeta",
    }),
    currentVariantSides() {
      return _.map(_.map(this.currentVariant.contents, "side"), (area) => ({
        label: _.find(this.currentVariant.contents, { side: area }).placeholder,
        value: area,
        color: this.currentProduct.variants[this.currentVariantIndex]
          .customizableVariant.color,
      }));
    },
    currentVariantContent() {
      return (
        _.find(this.currentVariant.contents, { side: this.currentSide }) ||
        _.find(this.currentVariant.contents, { side: "front" }) ||
        _.first(this.currentVariant.contents)
      );
    },
  },
  methods: {
    updateMainThumb(contents) {
      _.map(this.currentVariant.contents, (content, k) => {
        content.isMainThumb = _.find(contents, {
          _id: content._id,
        })?.isMainThumb;
      });
    },
    _variantIndexOf(variant) {
      const selectedProduct = this.selectedProducts[this.currentProductIndex];
      return _.findIndex(
        selectedProduct.variants,
        (v) => v.customizableVariant._id === variant._id
      );
    },
    hideDeleteCollectionConfirmation() {
      this.productToDeleteIndex = -1;
      this.$refs.productDeletionModal.hide();
    },
    async productDeleteConfirm() {
      if (this.productToDeleteIndex === -1) return;
      this.isProductDeleteLoading = true;
      try {
        const prod = this.selectedProducts[this.productToDeleteIndex];
        if (prod._id) {
          await this.$store.dispatch("designer/removeProduct", prod);
        }
        this.$store.commit(
          "designer/REMOVE_PRODUCT_BY_INDEX",
          this.productToDeleteIndex
        );
      } catch (e) {
        this.$refs.productDeletionModal.show();
        this.$toast.error(`Something went wrong: ${e}`, {
          position: "top",
        });
        console.error(e);
      }
      this.$refs.productDeletionModal.hide();
      this.isProductDeleteLoading = false;
    },
    showProductDeletionModal(index) {
      this.productToDeleteIndex = index;
      this.$refs.productDeletionModal.show();
    },
    _firstVariantPlaceholderOf(product) {
      return _.find(product.variants[0].contents, {
        side: this._firstPrintableArea(product.variants[0]),
      }).placeholder;
    },
    startEditingMetadata() {
      this.toggleDrawer("productMetaDrawer");
      this.tmpProductMetadata = JSON.parse(
        JSON.stringify(this.selectedProducts[this.currentProductIndex].meta)
      );
    },
    _reverseObjects(objects) {
      return JSON.parse(JSON.stringify(objects)).reverse();
    },
    layerDragged(e) {
      this.$store.commit(
        "designer/CURRENT_VARIANT_PROPERTIES",
        this.currentVariantContent.objects
      );
      this.$nextTick(() => {
        this.activated(this.currentVariantContent.objects[e.newIndex]);
      });
    },
    rightDrawerHidden() {
      this.$nextTick(() => {
        this.tmpProductMetadata = {
          name: "",
          description: "",
          tags: "",
        };
      });
    },
    async saveProductMetadata() {
      let res = await this.$validator.validate();
      if (!res) return;
      this.$store.commit(
        "designer/CURRENT_PRODUCT_META",
        this.tmpProductMetadata
      );
      this.$refs.productMetaDrawer.hide();
    },
    toggleDrawer(drawer) {
      if (this.$refs[drawer].isShown) {
        this.$refs[drawer].hide();
        return;
      }
      this.$refs[drawer].show();
    },
    changeCurrentProductPlan({ value }) {
      let plan = "buy";
      if (value) plan = "sell";
      this.$store.commit("designer/DESIGN_PLAN", plan);
    },
    togglePlanSection() {
      this.isMarketPlanCollapsed = !this.isMarketPlanCollapsed;
      this.$storage.setLocalStorage(
        "is_plan_collapsed",
        this.isMarketPlanCollapsed
      );
    },
    _firstPrintableArea(variant) {
      let areas = _.map(variant.contents, "side");
      return _.includes(areas, "front") ? "front" : _.head(areas);
    },
    async manageProducts() {
      this.isAvailableProductsLoading = true;
      if (!this.tmpProducts.length) {
        this.isAvailableProductsLoading = false;
        this.$refs.availableProductsModal.hide();
        return;
      }
      const tmpProducts = _.map(this.tmpProducts, (product) => ({
        customizableProduct: product,
        meta: {
          name: product.name,
          description: "",
          tags: [],
        },
        variants: [
          {
            customizableVariant: product.customizableVariants[0],
            sizes: _.map(product.customizableVariants[0].sizes, (size) => ({
              name: size.name,
              quantity: 0,
              price: 0,
            })),
            contents: _.map(
              product.customizableVariants[0].printableArea,
              (side) => ({
                printableArea: side.side,
                objects: [],
              })
            ),
          },
        ],
      }));
      const updatedCollection = await this.$store.dispatch(
        "designer/saveProducts",
        [...this.selectedProducts, ...tmpProducts]
      );

      let productIndex = this.currentProductIndex;
      if (!this.selectedProducts[productIndex]) productIndex = 0;
      this.currentProduct = JSON.parse(
        JSON.stringify(this.selectedProducts[productIndex])
      );
      this.currentVariant = this.currentProduct.variants[0];
      this.tmpProducts = [];
      this.isAvailableProductsLoading = false;
      this.$refs.availableProductsModal.hide();
    },
    showAvailableProducts() {
      if (this.selectedProducts.length >= 10) return;
      this.$refs.availableProductsModal.show();
    },
    hideAvailableProducts() {
      this.$refs.availableProductsModal.hide();
    },
    async addVariant(variant) {
      if (this._colorIsInVariantsOf(this.currentProduct, variant.color)) {
        if (this.currentProduct.variants.length === 1) return;
        let variantIndex = await this.$store.dispatch(
          "designer/removeVariant",
          variant
        );
        this.currentProduct.variants.splice(variantIndex, 1);
        this.selectVariant(
          variantIndex ? variantIndex - 1 : variantIndex,
          this.currentProductIndex
        );
        return;
      }
      let newVariant = await this.$store.dispatch("designer/addVariant", {
        ..._.omit(this.currentVariant, "_id"),
        sizes: _.map(variant.sizes, (s) => {
          const existingSize = _.find(this.currentVariant.sizes, {
            name: s.name,
          });
          if (!existingSize)
            return {
              name: s.name,
              price: 0,
              quantity: 0,
            };
          return existingSize;
        }),
        customizableVariant: variant,
      });
      this.currentProduct.variants.push({ ...newVariant });
      this.selectVariant(
        this.currentProduct.variants.length - 1,
        this.currentProductIndex
      );
    },
    _colorIsInVariantsOf(product, color) {
      return _.find(
        product.variants,
        (variant) =>
          variant.customizableVariant.color.toLowerCase() == color.toLowerCase()
      );
    },
    selectProduct(index) {
      if (index == this.currentProductIndex) return;
      this.$store.commit("designer/CURRENT_PRODUCT_INDEX", index);
      this.$store.commit("designer/CURRENT_VARIANT_INDEX", 0);
    },
    selectVariant(index, productIndex) {
      if (productIndex != this.currentProductIndex) {
        this.selectProduct(productIndex);
        index = 0;
      }
      this.$store.commit("designer/CURRENT_VARIANT_INDEX", index);
    },
    getCorrectColor(hex) {
      if (!hex) return;
      return ColorRegulator.getContrastOf(hex);
    },
  },
  watch: {
    currentProduct: {
      immediate: true,
      handler(to) {
        if (!to || (to && !to.meta)) return;
        this.tmpProductMetadata = JSON.parse(JSON.stringify(to.meta));
        const firstVariant = _.first(to.variants);
        const frontOrFirstContent =
          _.find(firstVariant.contents, { side: "front" }) ||
          _.first(firstVariant.contents);
        const side = frontOrFirstContent.side;
        this.$store.commit("designer/CURRENT_SIDE", side);
      },
    },
    currentProductIndex: {
      immediate: true,
      handler(to) {
        if (!this.selectedProducts.length) return;
        this.currentProduct = JSON.parse(
          JSON.stringify(this.selectedProducts[to])
        );
        this.currentVariant = this.currentProduct.variants[0];
        if (this.$refs.canvas) this.$refs.canvas.deactivated();
      },
    },
    currentVariantIndex: {
      immediate: true,
      handler(to) {
        if (!this.selectedProducts.length) return;
        this.currentVariant = JSON.parse(
          JSON.stringify(
            this.selectedProducts[this.currentProductIndex].variants[to]
          )
        );
        if (this.$refs.canvas) this.$refs.canvas.deactivated();
      },
    },
  },
};
</script>
