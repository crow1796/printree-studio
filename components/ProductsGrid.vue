<template>
  <div class="mx-6 grid-cols-1 sm:grid-cols-3" :class="['grid', `md:grid-cols-${grid}`]">
    <nuxt-link
      class="p-2"
      v-for="product in products"
      :key="product._id"
      :to="`${rootUrl}${product._id}`"
      :title="product.meta.name"
    >
      <div
        class="hover:shadow-lg border rounded relative w-full"
      >
        <span
          class="absolute font-bold text-xs top-0 right-0 ml-1 mt-1 rounded-full px-4 py-1 mr-1 uppercase z-10 bg-primary text-white truncate max-w-full" :style="{top: '-10px', right: '-10px'}"
        >{{product.parent_collection.user.shop.name}}</span>
        <div class="relative pt-3 px-8 flex items-center justify-center">
          <progressive-img
            class="relative w-40"
            :src="_firstThumbnailOf(product)"
            style="width: 160px;"
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
import { priceWithVatCeil } from "@/plugins/price-calculator";

export default {
  props: {
    products: {
      default: () => [],
    },
    grid: {
      default: "5",
    },
    rootUrl: {
      default: '/marketplace/products/'
    }
  },
  methods: {
    _startingPriceOf(product) {
      const firstVariant = first(product.variants);
      if (!firstVariant) return 0;
      const firstSize = first(firstVariant.sizes);
      if (!firstSize) return 0;

      const preTotal = firstSize.approvedPrice + firstSize.approvedBaseCost;
      return priceWithVatCeil(preTotal);
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
    gridClass(){
      let cls = 'w-5/5'

      if(this.grid === 4) {
        cls = 'w-3/12'
      }

      if(this.grid === 3) {
        cls = 'w-4/12'
      }
      
      return `sm:${cls}`
    }
  },
};
</script>