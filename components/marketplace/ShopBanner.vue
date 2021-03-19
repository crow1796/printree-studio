<template>
  <div class="shop-banner h-shop-banner w-full bg-center bg-no-repeat bg-contain" :style="{backgroundImage: `url(${src})`}"></div>
</template>

<script>
export default {
  props: {
    src: {
      required: true,
    },
  },
};
</script>