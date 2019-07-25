<template>
  <div class="tabs flex flex-col h-full">
    <div class="tabs-head flex text-gray-400">
      <div class="flex w-1/2 py-2 hover:text-white cursor-pointer text-xs items-center"
        :class="{ 'bg-gray-900': _isActive(tab) }"
        v-for="tab in tabs"
        :key="`title${tab.name}`"
        @click="switchTabTo(tab)">
        <div class="w-full text-center">{{ tab.title }}</div>
      </div>
    </div>
    <div v-for="tab in tabs" :key="`content${tab.name}`">
      <div class="tabs-content flex w-full h-full text-white text-xs p-2"
        :class="{ 'bg-gray-900': _isActive(tab) }"
        v-if="_isActive(tab)">
        <slot :name="tab.slot"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['tabs'],
  data(){
    return {
      activeTab: this.tabs[0]
    }
  },
  methods: {
    _isActive(tab){
      return this.activeTab && this.activeTab.name == tab.name
    },
    switchTabTo(tab){
      this.activeTab = tab
    }
  }
}
</script>
