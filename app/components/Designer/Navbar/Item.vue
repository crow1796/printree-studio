<template>
  <div class="flex relative" v-click-outside="() => { isShown = false }">
    <span class="cursor-pointer relative outline-none items-center p-2 w-16 text-center">
      <div class="text-gray-400 hover:text-white">
        <span :title="title" v-tippy="{arrow: true}"
          @click="$emit('trigger-click')"
          class="outline-none">
          <font-awesome-icon :icon="selected ? selected.icon : icon"/>
        </span>
        <font-awesome-icon v-if="items.length"
          :icon="['fas', 'chevron-down']"
          style="font-size: 10px"
          class="inline-block align-middle ml-1 hover:pt-1"
          @click="isShown = !isShown"/>
      </div>
    </span>
    <div class="absolute bg-primary-blue0 w-32 shadow rounded top-full" v-if="isShown">
      <div class="cursor-pointer text-gray-400 hover:text-white px-4 py-2 text-left"
        v-for="(item, index) in items"
        :key="index"
        @click="select(item)">
        <font-awesome-icon :icon="item.icon" class="inline-block mr-2 align-middle"/>
        <span class="text-xs align-middle">{{ item.title }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      default: ''
    },
    icon: {
      default: ''
    },
    items: {
      default: () => []
    }
  },
  data(){
    return {
      isShown: false,
      selected: null
    }
  },
  methods: {
    select(item){
      this.selected = item
      this.isShown = false
      this.$emit('item-click', item)
    }
  }
}
</script>
