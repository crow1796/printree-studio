<template>
  <div
    class="absolute right-0 mr-4 top-0 mt-4 bg-white rounded-full material-color-pallete py-1 transition-all flex flex-col justify-between z-10"
    ref="palleteContainer"
    :style="{height}"
    v-intro="'You can also add or remove product variants here...'"
    v-intro-step="4"
    v-intro-disable-interaction="true"
  >
    <div>
      <slot />
    </div>
    <div
      class="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full cursor-pointer mx-2 my-1 border border-gray-300 flex justify-center items-center select-none"
      @click="expand"
      v-if="isExpandable"
    >
      <font-awesome-icon :icon="['fas', `chevron-${isExpanded ? 'up' : 'down'}`]" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    colors: {
      type: Array,
      default: () => [],
    },
    isExpandable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isExpanded: false,
      expandableHeight: this.isExpandable ? "120px" : "82px",
      height: this.isExpandable ? "120px" : "82px",
      selectedColors: [],
    };
  },
  methods: {
    expand() {
      this.isExpanded = !this.isExpanded;
      this.height = this.isExpanded ? "300px" : this.expandableHeight;
    },
  },
};
</script>