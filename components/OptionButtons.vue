<template>
  <div class="flex" :class="{'flex-wrap': !equalWidth, 'flex-wrap sm:flex-no-wrap': equalWidth}">
    <div
      class="px-4 py-2 border mr-2 cursor-pointer hover:border-gray-600 rounded font-bold mt-2 relative"
      v-for="(opt, i) in options"
      :key="i"
      :class="{'bg-primary text-white border-white hover:border-white': ((!isMultiple && opt.value === selected) || (isMultiple && _isSelected(opt))), 'text-gray-400': opt.disabled, 'flex-grow-0 sm:flex-grow flex-shrink-0': equalWidth}"
      @click="() => opt.disabled ? false : toggle(opt)"
    >
      <span
        class="absolute top-0 right-0 mr-2 mt-1"
        v-if="((!isMultiple && opt.value === selected) || (isMultiple && _isSelected(opt))) && checkIcon"
      >
        <font-awesome-icon :icon="['fas', 'check-circle']" />
      </span>
      <slot v-bind:option="opt">{{ opt.label }}</slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    value: {
      required: false,
    },
    isMultiple: {
      type: Boolean,
      default: false,
    },
    checkIcon: {
      type: Boolean,
      default: false,
    },
    equalWidth: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selected: this.value,
    };
  },
  methods: {
    toggle(opt) {
      if (this.isMultiple) {
        if (_.includes(this.selected, opt))
          return this.selected.splice(
            _.findIndex(this.selected, { value: opt.value }),
            1
          );
        this.selected.push(opt);
        return;
      }
      this.selected = opt.value;
      this.$emit("input", opt.value);
    },
    _isSelected(opt) {
      return _.includes(this.selected, opt);
    },
  },
  watch: {
    value(to) {
      this.selected = to;
    },
  },
};
</script>