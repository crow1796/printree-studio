<template>
  <div class="container mx-auto">
    <div class="font-bold text-2xl mt-6 mb-2 px-8">All Products</div>
    <div class="relative min-h-area-loader">
      <AreaLoader v-if="isLoading" />
    </div>
  </div>
</template>

<script>
export default {
  layout: "marketplace_dashboard",
  data(){
    return {
      isLoading: false
    }
  }
};
</script>