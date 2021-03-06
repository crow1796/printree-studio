<template>
  <div class="relative flex flex-grow flex-wrap overflow-auto">
    <AreaLoader v-if="isLoading" />
    <div class="flex flex-wrap flex-grow p-4 text-gray-600">
      <Tabs :tabs="categories">
        <template v-for="category in categories" :slot="category.name">
          <div class="flex flex-wrap w-full" :key="category.name">
            <div
              class="flex sm:w-1/3 w-full p-1"
              v-for="product in _productsOf(category.name)"
              :key="product._id"
              @click="toggleProduct(product)"
            >
              <div
                class="select-product flex border flex-grow rounded cursor-pointer select-none"
                :class="{ 'border-primary hover:border-primary-lighter': _hasBeenSelected(product), 'hover:border-gray-500': !_hasBeenSelected(product) }"
              >
                <div class="flex w-1/3 product-thumb p-4 items-center justify-center">
                  <progressive-img :src="_firstVariantPlaceholderOf(product)" class="w-full" />
                </div>
                <div
                  class="flex flex-grow flex-col product-desc p-4 relative"
                  :class="{ 'text-primary hover:text-primary-lighter': _hasBeenSelected(product) }"
                >
                  <div class="font-bold text-lg mb-4">{{ product.name }}</div>
                  <div class="flex flex-col">
                    <div class="flex py-1 items-center">
                      <font-awesome-icon :icon="['fas', 'tag']" />
                      <div class="pl-2">Sizes - {{ _availableSizesOf(product) }}</div>
                    </div>
                    <div class="flex py-1 items-center">
                      <font-awesome-icon :icon="['far', 'circle']" />
                      <div class="pl-2 cursor-help">
                        <tippy arrow>
                          <template v-slot:trigger>
                            <span
                              class="border-b border-dashed hover:border-gray-500"
                            >{{ product.customizableVariants.length }} Variants</span>
                          </template>

                          <div class="flex">
                            <div
                              class="w-5 h-5 rounded-full cursor-pointer mx-1 my-1 border border-gray-300 flex justify-center items-center relative"
                              v-for="(variant, variantIndex) in product.customizableVariants"
                              :key="variantIndex"
                              :style="{ 'background-color': variant.color, }"
                            />
                          </div>
                        </tippy>
                      </div>
                    </div>
                    <div class="flex py-1 items-center" v-if="product.fabricDescription">
                      <font-awesome-icon :icon="['fas', 'tag']" />
                      <div class="pl-2">
                        <span>{{ product.fabricDescription }}</span>
                      </div>
                    </div>
                  </div>
                  <div
                    class="absolute outline-none focus:outline-none bg-white select-icon rounded-full border w-10 flex h-10 items-center justify-center"
                    :class="{ 'border-primary hover:border-primary-lighter hover:text-primary-lighter text-primary': _hasBeenSelected(product) }"
                    style="right: 10px; bottom: 10px;"
                  >
                    <font-awesome-icon
                      :icon="['fas', _hasBeenSelected(product) ? 'check' : 'plus']"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Tabs>
    </div>
  </div>
</template>

<script>
import Tabs from "@/components/Tabs";
import { mapGetters } from "vuex";

export default {
  components: {
    Tabs,
  },
  async mounted() {
    this.isLoading = true;
    await this.$store.dispatch("designer/fetchAvailableProducts");
    this.isLoading = false;
    this.categories = [
      {
        name: "all",
        title: "All",
      },
      ...this.availableCategories,
    ];
  },
  data() {
    return {
      groupedProducts: {},
      categories: [],
      tmpProducts: [],
      isLoading: false,
      isSingle: this.$flags.flagIs("single", "on"),
    };
  },
  computed: {
    ...mapGetters({
      availableProducts: "designer/availableProducts",
      selectedProducts: "designer/selectedProducts",
    }),
    availableCategories() {
      let categories = _.map(this.availableProducts, "category");
      categories = _.uniqBy(categories, "_id");

      return _.map(categories, (cat) => ({ name: cat._id, title: cat.name }));
    },
  },
  methods: {
    toggleProduct(product) {
      if (this._hasBeenSelected(product)) {
        let index = _.findIndex(this.tmpProducts, { _id: product._id });
        this.tmpProducts.splice(index, 1);
        this.$emit("input", this.tmpProducts);
        return;
      }
      if (this.isSingle && this.tmpProducts.length) {
        this.$toast.error("You can only select 1 product.", {
          position: "top",
        });
        return;
      }
      if (this.tmpProducts.length + this.selectedProducts.length >= 10) {
        this.$toast.error(
          "Each collection can only have a maximum of 10 products.",
          {
            position: "top",
          }
        );
        return;
      }
      product = JSON.parse(JSON.stringify(product));
      this.tmpProducts.push(product);
      this.$emit("input", this.tmpProducts);
    },
    _firstVariantPlaceholderOf(product) {
      if (!product.customizableVariants.length) return;
      const areaKeys = _.map(
        product.customizableVariants[0].printableArea,
        "side"
      );
      let firstSide = _.includes(areaKeys, "front") ? "front" : areaKeys[0];
      return _.find(product.customizableVariants[0].printableArea, {
        side: firstSide,
      }).placeholder;
    },
    _availableSizesOf(product) {
      if (!product.customizableVariants.length) return;
      let sizeNames = _.map(product.customizableVariants[0].sizes, "name");
      return sizeNames.join(", ");
    },
    _hasBeenSelected(product) {
      return _.find(this.tmpProducts, { _id: product._id });
    },
    _productsOf(category) {
      if (category === "all") return this.availableProducts;

      return _.filter(
        this.availableProducts,
        (prod) => prod.category._id === category
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.thumbnail:not([lazy="loaded"]) {
  width: 16px;
  height: 16px;
}
</style>
