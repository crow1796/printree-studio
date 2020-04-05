<template>
  <div class="w-full mx-auto">
    <div class="tab w-full overflow-hidden border-t"
      v-for="(tab, i) in tabs"
      :key="i">
      <input class="absolute opacity-0"
        :id="tab.template"
        type="checkbox"
        :name="tab.template"
        :checked="tab.isOpened">
      <label class="block px-4 py-6 leading-normal cursor-pointer uppercase hover:text-gray-700 hover:bg-gray-100"
        :for="tab.template">
        <strong>{{ tab.title }}</strong>
      </label>
      <div class="tab-content overflow-hidden leading-normal border-t border-b">
        <slot :name="tab.template"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tabs: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
/* Tab content - closed */
.tab-content {
  max-height: 0;
  -webkit-transition: max-height .35s;
  -o-transition: max-height .35s;
  transition: max-height .35s;
}
/* :checked - resize to full height */
.tab input:checked ~ .tab-content {
  max-height: 100%;
}

/* Icon */
.tab label::after {
  float:right;
  right: 0;
  top: 0;
  display: block;
  transition: all .2s;
}
/* Icon formatting - closed */
.tab input[type=checkbox] + label::after {
content: "\f0d7";
  font-family: 'FontAwesome'
}
/* Icon formatting - open */
.tab input[type=checkbox]:checked + label::after {
  transform: rotateZ(315deg);
}
.tab input[type=checkbox]:checked + label::after {
  transform: rotateZ(180deg);
}
</style>
