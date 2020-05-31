<template>
  <div class="flex h-full w-full">
    <AreaLoader v-if="isLoading" fullscreen />
    <div class="flex flex-grow w-full relative" v-else>
      <VueTailwindDrawer ref="availableProductsModal" width="70%">
        <div class="flex flex-col flex-grow">
          <div class="modal-heading border-b w-full p-4 text-gray-600">
            <div class="flex justify-between w-full items-center">
              <div class="flex uppercase">
                <strong>Select Products</strong>
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

      <div class="flex w-1/4 border-r flex-grow flex-col">
        <div class="flex overflow-hidden w-full flex-grow flex-col overflow-auto flex-grow">
          <!-- <div
            class="mx-4 mt-4 px-4 h-24 flex-shrink-0 cursor-pointer hover:bg-gray-100 select-none text-gray-600 w-auto justify-center items-center flex border rounded border-dashed"
            @click="showAvailableProducts"
          >
            <font-awesome-icon :icon="['fas', 'cubes']" class="mr-2 text-lg" />
            <span class="font-bold">MANAGE PRODUCTS</span>
          </div>-->
          <div class="flex flex-wrap flex mt-4 overflow-auto px-4 pb-4">
            <div class="p-1 w-6/12">
              <div
                class="px-2 relative cursor-pointer hover:bg-gray-100 select-none text-gray-600 w-auto justify-center items-center flex border rounded border-dashed"
                style="height: 176.8px"
                @click="showAvailableProducts"
              >
                <div class="flex flex-col items-center justify-center">
                  <font-awesome-icon :icon="['fas', 'plus-circle']" class="text-5xl" />
                  <span class="font-bold mt-2 block">ADD PRODUCTS</span>
                </div>
              </div>
            </div>
            <div class="p-1 w-6/12" v-for="(product, index) in selectedProducts" :key="index">
              <div
                class="p-2 relative cursor-pointer hover:bg-gray-100 select-none text-gray-600 w-auto justify-center items-center flex border rounded"
                :class="{ 'bg-gray-100': index == currentProductIndex }"
                @click="selectProduct(index)"
              >
                <div class="flex w-full flex-col justify-center items-center">
                  <div class="flex justify-center items-center w-full">
                    <img
                      :src="
                        _firstVariantPlaceholderOf(product)
                      "
                      style="height: 100px;"
                    />
                  </div>
                  <div class="flex-grow flex flex-col pt-2">
                    <div class="font-bold text-gray-600">{{ product.meta.name }}</div>
                    <div class="flex">
                      <v-popover class="flex" placement="right">
                        <div
                          class="rounded-full p-1 border border-white m-1 bg-white border-gray-300 hover:border-gray-400 hover:text-gray-700"
                          v-if="product.customizableProduct.customizableVariants.length > 1"
                        >
                          <div
                            class="flex justify-center items-center rounded-full cursor-pointer w-3 h-3 bg-white"
                          >
                            <font-awesome-icon
                              :icon="['fas', 'plus']"
                              class="text-xs"
                              :style="{fontSize: '.6em'}"
                            />
                          </div>
                        </div>
                        <template slot="popover">
                          <div class="bg-white w-64 border rounded shadow-xl">
                            <div class="flex flex-col w-full">
                              <div class="font-bold text-gray-600 p-2 border-b">Choose a color</div>
                              <div class="flex p-2">
                                <div
                                  class="rounded-full p-1 border border-white m-1 hover:border-gray-300"
                                  v-for="(variant,
                                  variantIndex) in currentProduct.customizableProduct.customizableVariants"
                                  :key="variantIndex"
                                  :class="{
                                    'border-gray-300 bg-white': _colorIsInVariantsOf(
                                      currentProduct,
                                      variant.color
                                    )
                                  }"
                                  @click="addVariant(variant)"
                                >
                                  <div
                                    class="flex justify-center items-center rounded-full cursor-pointer w-3 h-3 border border-gray-200"
                                    :style="{
                                      'background-color': variant.color
                                    }"
                                  >
                                    <font-awesome-icon
                                      :icon="['fas', 'check']"
                                      :style="{
                                        color: getCorrectColor(variant.color),
                                        fontSize: '.4em'
                                      }"
                                      v-if="
                                        _colorIsInVariantsOf(
                                          currentProduct,
                                          variant.color
                                        )
                                      "
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </template>
                      </v-popover>
                      <div
                        class="rounded-full p-1 border border-white m-1 hover:border-gray-300"
                        v-for="(variant, variantIndex) in product.variants"
                        :key="variantIndex"
                        @click.stop="selectVariant(variantIndex, index)"
                        :class="{
                          'border-gray-300 bg-white':
                            index == currentProductIndex &&
                            variantIndex == currentVariantIndex
                        }"
                      >
                        <div
                          class="flex justify-center items-center rounded-full cursor-pointer w-3 h-3 border border-gray-200"
                          :style="{ 'background-color': variant.color }"
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

      <div class="flex flex-grow h-full flex-col w-3/4">
        <DesignerTabs v-model="selectedTab" />

        <div
          class="flex flex-grow w-full h-full justify-center overflow-hidden"
          v-if="selectedTab === 'preview'"
        >
          <div class="outline-none select-none relative w-full h-full text-center">
            <div class="bottom-actions absolute z-10 flex flex-shrink justify-center">
              <div class="flex bg-white mt-4 rounded border">
                <div class="flex p-4">
                  <ToggleSwitch
                    :options="currentVariantSides"
                    class="mx-1"
                    :value="currentSide"
                    @change="
                      option =>
                        $store.dispatch('designer/switchSideTo', option.value)
                    "
                  >
                    <template v-slot:default="{ option }">
                      <div class="flex flex-col">
                        <img :src="option.label" width="50" />
                        <div class="text-center mt-1 text-xs">{{ option.value.toUpperCase() }}</div>
                      </div>
                    </template>
                  </ToggleSwitch>
                </div>
              </div>
            </div>

            <div class="inline-block product-section outline-none relative w-auto h-auto">
              <div class="relative w-auto h-full">
                <div
                  class="inline-block relative w-auto h-auto"
                  :style="{ 'background-color': currentVariant.color }"
                >
                  <img
                    draggable="false"
                    class="relative"
                    style="z-index: 2"
                    :src="
                      currentVariantContent.placeholder
                    "
                  />
                </div>
                <div
                  class="printable-area-surface absolute"
                  :style="{
                    left: `${currentVariantContent.bounds.left}px`,
                    top: `${currentVariantContent.bounds.top}px`,
                    width: `${currentVariantContent.bounds.width}px`,
                    height: `${currentVariantContent.bounds.height}px`,
                    zIndex: 2
                  }"
                  @mouseenter="printableAreaZ = 3"
                ></div>
                <div
                  class="printable-area absolute"
                  id="printable-area"
                  :style="{
                    left: `${currentVariantContent.bounds.left}px`,
                    top: `${currentVariantContent.bounds.top}px`,
                    width: `${currentVariantContent.bounds.width}px`,
                    height: `${currentVariantContent.bounds.height}px`,
                    zIndex: printableAreaZ,
                    outlineColor: getCorrectColor(currentVariant.color)
                  }"
                  :class="{
                    '-has-outline': isPrintableAreaHovered || isMoving
                  }"
                  @mouseenter="isPrintableAreaHovered = true"
                  @mouseleave="
                    printableAreaZ = 1
                    isPrintableAreaHovered = false
                  "
                >
                  <Output
                    :objects="currentVariantContent.objects"
                    :width="currentVariantContent.bounds.width"
                    :height="currentVariantContent.bounds.height"
                  />
                </div>
                <div
                  class="printable-area-label"
                  v-if="isPrintableAreaHovered"
                  :style="{
                    top: `${currentVariantContent.bounds.top +
                      currentVariantContent.bounds.height +
                      5}px`,
                    color: getCorrectColor(currentVariant.color)
                  }"
                >Printable Area</div>
              </div>
            </div>
          </div>
        </div>

        <Canvas
          v-model="currentVariantContent.objects"
          :width="currentVariantContent.bounds.width * 4"
          :height="currentVariantContent.bounds.height * 4"
          :backgroundColor="currentVariant.color"
          v-if="selectedTab === 'designer'"
        />
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
                      'focus:border-gray-600': !errors.has('name')
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
                >{{ errors.first('product_name') }}</span>
              </div>
              <div>
                <label for="product_description" class="font-bold">Product Description</label>
                <div>
                  <WrappedEditor v-model="tmpProductMetadata.description" />
                </div>
                <span
                  class="text-red-700 text-xs pt-1 font-bold inline-block"
                  v-if="errors.has('product_description')"
                >{{ errors.first('product_description') }}</span>
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
import Tabs from "@/components/Tabs";
import Select from "@/components/Select";
import ToggleSwitch from "@/components/ToggleSwitch";
import ColorRegulator from "~/plugins/color-regulator.js";
import { mapGetters } from "vuex";
import AvailableProducts from "@/components/Designer/AvailableProducts";
import VueTailwindDrawer from "@/components/VueTailwindDrawer";
import VueTailwindAccordion from "@/components/VueTailwindAccordion";
import WrappedEditor from "@/components/WrappedEditor";
import DesignerTabs from "@/components/Designer/DesignerTabs";
import draggable from "vuedraggable";
import Konva from "@/components/Designer/Canvas/Konva";
import { Canvas, Output } from "@/components/Designer/Canvas/Default/index.js";

let WebFontLoader = null;
if (process.client) {
  WebFontLoader = require("webfontloader");
}

export default {
  layout: "designer",
  components: {
    Tabs,
    Select,
    ToggleSwitch,
    AvailableProducts,
    WrappedEditor,
    VueTailwindDrawer,
    VueTailwindAccordion,
    draggable,
    DesignerTabs,
    Konva,
    Canvas,
    Output
  },
  async mounted() {
    WebFontLoader.load({
      google: {
        families: _.map(this.webfonts, "value")
      }
    });
    this.currentProduct = JSON.parse(JSON.stringify(this.selectedProducts[0]));
    this.currentVariant = this.currentProduct.variants[0];
    this.isLoading = false;
  },
  data() {
    return {
      selectedTab: "preview",
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
        horizontal: false
      },
      printableAreaZ: 2,
      tmpProductMetadata: {
        name: "",
        description: "",
        tags: ""
      }
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
      designMeta: "designer/designMeta"
    }),
    currentVariantSides() {
      return _.map(
        _.map(this.currentVariant.contents, "side"),
        (area) => ({
          label: _.find(this.currentVariant.contents, { side: area }).placeholder,
          value: area
        })
      );
    },
    currentVariantContent() {
      return _.find(this.currentVariant.contents, { side: this.currentSide });
    }
  },
  methods: {
    _firstVariantPlaceholderOf(product) {
      return _.find(product.variants[0].contents, {
        side: this._firstPrintableArea(product.variants[0])
      }).placeholder;
    },
    _reverseObjects(objects) {
      return JSON.parse(JSON.stringify(objects)).reverse();
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
          tags: ""
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
    manageProducts() {
      let selectedProductIds = _.map(this.selectedProducts, "id");
      this.tmpProducts = _.map(this.tmpProducts, product => {
        if (!product.parent_id) {
          const ref = fireDb.collection("user_products").doc();
          product.parent_id = product._id;
          product._id = ref.id;
          product.is_new = true;
        }
        if (!product.meta)
          product.meta = {
            name: "",
            description: "",
            tags: "",
            printing_option: ""
          };
        return product;
      });
      this.$store.dispatch("designer/setSelectedProducts", [
        ...this.selectedProducts,
        ...this.tmpProducts
      ]);
      let productIndex = this.currentProductIndex;
      if (!this.selectedProducts[productIndex]) productIndex = 0;
      this.currentProduct = JSON.parse(
        JSON.stringify(this.selectedProducts[productIndex])
      );
      this.currentVariant = this.currentProduct.variants[0];
      this.tmpProducts = [];
      this.$refs.availableProductsModal.hide();
    },
    showAvailableProducts() {
      this.$refs.availableProductsModal.show();
    },
    hideAvailableProducts() {
      this.$refs.availableProductsModal.hide();
    },
    async addVariant(variant) {
      if (
        _.find(this.currentProduct.variants, { color: variant.color }) &&
        this.currentProduct.variants.length == 1
      )
        return;
      if (_.find(this.currentProduct.variants, { color: variant.color })) {
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
        ...variant,
        ...{
          id: null,
          parent_id: variant._id
        }
      });
      this.currentProduct.variants.push(JSON.parse(JSON.stringify(newVariant)));
      this.selectVariant(
        this.currentProduct.variants.length - 1,
        this.currentProductIndex
      );
    },
    _colorIsInVariantsOf(product, color) {
      return _.find(
        product.customizableProduct.customizableVariants,
        variant => variant.color.toLowerCase() == color.toLowerCase()
      );
    },
    selectProduct(index) {
      if (index == this.currentProductIndex) return;
      this.selectedTab = "preview";
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
    }
  },
  watch: {
    currentProduct: {
      immediate: true,
      handler(to) {
        if (!to || (to && !to.meta)) return;
        this.tmpProductMetadata = JSON.parse(JSON.stringify(to.meta));
      }
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
      }
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
      }
    },
    selectedProducts: {
      deep: true,
      handler(to) {
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(async () => {
          this.autoSaving = true;
          this.autoSavingText = "Saving...";
          await this.$store.dispatch("designer/saveData", {
            shouldGenerateImages: false
          });
          this.autoSavingText = "Saved!";
          setTimeout(() => {
            this.autoSaving = false;
          }, 1000);
        }, 3000);
      }
    }
  }
};
</script>
