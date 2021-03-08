<template>
  <div class="flex flex-wrap items-center px-6">
    <nuxt-link
      class="p-2 w-5/5"
      v-for="product in products"
      :key="product.id"
      :to="`/marketplace/products/${product._id}`"
      :title="product.meta.name"
    >
      <div
        class="flex-grow sm:flex-grow-0 relative overflow-hidden hover:shadow-lg border rounded relative"
      >
        <div class="relative pt-3 px-8 flex items-center justify-center">
          <div
            class="absolute w-full h-full left-0 top-0 flex justify-center items-center flex-col z-10 bg-white opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out"
          >
            <div class="w-full sm:w-10/12">
              <PTButton
                color="primary"
                class="mb-2 w-full"
                @click.prevent.stop="addToCart"
              >Add to Cart</PTButton>
            </div>
          </div>
          <progressive-img
            class="relative w-40"
            :src="_firstThumbnailOf(product)"
            style="width: 160px"
          />
        </div>
        <div class="relative text-grey-600 px-3 pb-3">
          <span
            class="block opacity-75 w-full truncate text-xs leading-none"
          >{{product.parent_collection.name}}</span>
          <div class="flex items-center justify-between">
            <span class="font-black truncate">{{product.meta.name}}</span>
          </div>
          <div
            class="text-primary mb-1 text-xs font-black leading-none flex items-center"
          >From {{_startingPriceOf(product).formatMoney('₱ ')}}</div>
          <!-- <star-rating
            :increment="0.01"
            :fixed-points="2"
            v-model="product.rating"
            :read-only="true"
            :show-rating="false"
            :star-size="15"
          ></star-rating>-->
        </div>
      </div>
    </nuxt-link>
  </div>
</template>

<script>
import first from "lodash/first";
import find from "lodash/find";
import { mapGetters } from "vuex";

export default {
  props: ["products"],
  methods: {
    addToCart() {
      if (!this.isLoggedIn) {
        // Find parent with authmodal
        let parent = this.$parent;
        while (!parent.$refs.authModal) {
          parent = parent.$parent;
        }
        parent.$refs.authModal.show();
        return;
      }
    },
    _startingPriceOf(product) {
      const firstVariant = first(product.variants);
      if (!firstVariant) return 0;
      const firstSize = first(firstVariant.sizes);
      if (!firstSize) return 0;
      return firstSize.calculatedCost + firstSize.price;
    },
    _firstThumbnailOf(product) {
      const firstVariant = first(product.variants);
      if (!firstVariant) return "";
      const firstContent =
        find(firstVariant.contents, { isMainThumb: true }) ||
        first(firstVariant.contents);
      if (!firstContent) return "";
      return firstContent.fullThumb;
    },
  },
  computed: {
    ...mapGetters({
      isLoggedIn: "isLoggedIn",
      user: "user",
    }),
  },
};
</script>