<template>
  <div
    class="shop-banner"
    :style="{backgroundImage: `url(${src})`, backgroundColor: shopConfig.bannerBGColor}"
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