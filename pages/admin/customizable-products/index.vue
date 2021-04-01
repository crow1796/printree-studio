<template>
  <div class="relative sm:px-8 min-h-area-loader">
    <AreaLoader v-if="isLoading" />
    <div class="my-2 flex sm:flex-row justify-between items-center">
      <h2 class="text-2xl font-semibold leading-tight">Customizable Products</h2>
    </div>
    <div class="flex flex-wrap flex-grow py-4 text-gray-600">
      <Tabs :tabs="categories">
        <template v-for="category in categories" :slot="category.name">
          <div class="grid grid-cols-3 w-full" :key="category.name">
            <nuxt-link
              class="p-1 relative"
              v-for="product in _productsOf(category.name)"
              :key="product._id"
              :to="`/admin/customizable-products/${product._id}`"
            >
              <span
                class="absolute font-bold text-xs top-0 right-0 ml-1 mt-1 rounded-full px-4 py-1 mr-1 uppercase z-10 truncate max-w-full"
                :style="{top: '-10px', right: '-10px'}"
                :class="{
                  'bg-primary text-white': product.status === 'active',
                  'bg-gray-600 text-white': product.status === 'inactive'
                }"
              >{{product.status}}</span>
              <div
                class="select-product flex border flex-grow rounded cursor-pointer select-none hover:border-gray-500"
              >
                <div class="flex w-1/3 product-thumb p-4 items-center justify-center">
                  <progressive-img :src="_firstVariantPlaceholderOf(product)" class="w-full" />
                </div>
                <div class="flex flex-grow flex-col product-desc p-4 relative">
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
                </div>
              </div>
            </nuxt-link>
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
  layout: "admin_dashboard",
  components: {
    Tabs,
  },
  async mounted() {
    this.isLoading = true;
    await this.$store.dispatch("designer/fetchAvailableProducts", this.query);
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
      query: {
        status: ["active", "inactive"],
      },
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