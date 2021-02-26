<template>
  <label class="custom-checkbox block relative cursor-pointer text-xl w-6 h-6" @click.stop>
    <input
      class="absolute opacity-0 left-0 top-0 cursor-pointer"
      type="checkbox"
      name="terms"
      :checked="checked"
      v-validate="'required'"
      :true-value="trueValue"
      @change="handleChange"
    />
    <span class="h-6 w-6 checkmark absolute top-0 left-0 bg-gray-400"></span>
  </label>
</template>

<script>
export default {
  props: {
    value: {
      default: false,
    },
    trueValue: {
      default: true,
    },
    checked: {
      default: false,
    },
  },
  methods: {
    handleChange(e) {
      let val = false;
      if (e.target.checked) val = this.trueValue;
      this.$emit("change", val);
    },
  },
};
</script>