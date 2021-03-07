<template>
  <div class="flex flex-wrap items-center px-6">
    <nuxt-link
      class="p-2 w-3/12"
      v-for="product in products"
      :key="product.id"
      :to="`/marketplace/products/${product._id}`"
      :title="product.meta.name"
    >
      <div
        class="flex-grow sm:flex-grow-0 relative overflow-hidden hover:shadow-lg border rounded-lg relative"
      >
        <div class="relative pt-3 px-8 flex items-center justify-center">
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

export default {
  props: ["products"],
  methods: {
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
};
</script>