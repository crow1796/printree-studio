<template>
  <div class="tabs flex flex-col h-full w-full">
    <div class="tabs-head flex text-gray-400">
      <button type="button" class="focus:outline-none outline-none mx-1 flex-grow border px-8 py-3 font-bold rounded cursor-pointer"
        :class="[{ 'bg-gray-900 shadow-xl bg-primary border-white text-white hover:bg-primary-lighter': _isActive(tab), 'text-gray-600 border-grey-lightest hover:bg-gray-100': !_isActive(tab) }, `w-1/${tabs.length}`]"
        v-for="tab in tabs"
        :key="`title${tab.name}`"
        @click="switchTabTo(tab)">
        <div class="w-full text-center uppercase">{{ tab.title }}</div>
      </button>
    </div>
    <div v-for="tab in tabs" :key="`content${tab.name}`">
      <div class="tabs-content flex w-full h-full"
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
