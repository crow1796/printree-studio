<template>
  <div class="w-full h-full flex justify-center items-center" :style="{height}">
    <font-awesome-icon :icon="['fas', 'sync-alt']" spin />
  </div>
</template>

<script>
export default {
  props: {
    height: {
      default: '100%'
    }
  }
};
</script>