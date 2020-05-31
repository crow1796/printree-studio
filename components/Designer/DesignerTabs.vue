<template>
  <div class="flex w-full border-b bg-white">
    <div
      class="flex w-1/2 justify-center cursor-pointer text-sm p-1 font-bold text-gray-600 hover:bg-gray-100 border-r"
      :class="{ 'bg-gray-100': selectedTab === 'preview' }"
      @click="select('preview')"
    >
      Preview
    </div>
    <div
      class="flex w-1/2 justify-center cursor-pointer text-sm p-1 font-bold text-gray-600 hover:bg-gray-100"
      :class="{ 'bg-gray-100': selectedTab === 'designer' }"
      @click="select('designer')"
    >
      Designer
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      default: 'preview'
    }
  },
  data() {
    return {
      selectedTab: this.value
    }
  },
  methods: {
    select(tab) {
      this.selectedTab = tab
      this.$emit('input', tab)
    }
  }
}
</script>
