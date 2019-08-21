<template>
  <div class="toggle">
    <div class="flex">
      <button type="button"
        class="justify-center items-center focus:outline-none outline-none flex flex-grow border px-3 py-2 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
        :class="{ 'rounded-r-none': index > 0 && (index < (options.length - 1)), 'rounded-l-none': index == (options.length - 1), 'border-r-0': index < (options.length - 1), 'bg-gray-200': value == option[valueKey] || value == option }"
        v-for="(option, index) in options"
        :key="index"
        @click="toggle(option)">
          {{ option[labelKey] }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      default: () => []
    },
    labelKey: {
      default: 'label'
    },
    valueKey: {
      default: 'value'
    },
    value: {
      default: null
    }
  },
  methods: {
    toggle(option){
      this.$emit('change', option)
    }
  }
}
</script>
