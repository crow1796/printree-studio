<template>
  <div class="flex flex-wrap">
    <div
      class="px-4 py-2 border mr-2 cursor-pointer hover:border-gray-600 rounded font-bold mt-2"
      v-for="(opt, i) in options"
      :key="i"
      :class="{'bg-primary text-white border-white hover:border-white': ((!isMultiple && opt.value === selected) || (isMultiple && _isSelected(opt)))}"
      @click="toggle(opt)"
    >{{ opt.label }}</div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      default: () => []
    },
    value: {
      required: false
    },
    isMultiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selected: this.value
    }
  },
  methods: {
    toggle(opt) {
      if (this.isMultiple) {
        if(_.includes(this.selected, opt)) return this.selected.splice(_.findIndex(this.selected, {value: opt.value}), 1)
        this.selected.push(opt)
        return
      }
      this.selected = opt.value
      this.$emit('input', opt.value)
    },
    _isSelected(opt){
      return _.includes(this.selected, opt)
    }
  },
  watch: {
    value(to){
      console.log(to)
      this.selected = to
    }
  }
}
</script>