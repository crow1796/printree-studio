<template>
  <div
    class="shop-banner h-shop-banner w-full bg-center bg-no-repeat lg:bg-contain bg-cover"
    :style="{backgroundImage: `url(${src})`, backgroundColor: shopConfig.bannerBGColor, backgroundSize: shopConfig.bannerBGSize}"
  ></div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    src: {
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      shopConfig: "shop/shopConfig",
    }),
  },
};
</script>