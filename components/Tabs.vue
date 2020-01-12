<template>
  <div class="tabs flex flex-col h-full w-full">
    <div class="tabs-head flex text-gray-400 flex-wrap">
      <button type="button" class="outline-none focus:outline-none border m-1 px-8 py-2 font-bold rounded"
        :class="[{ 'bg-gray-900 shadow-xl bg-primary border-white text-white hover:bg-primary-lighter': _isActive(tab), 'text-gray-600 border-grey-lightest hover:bg-gray-100': !_isActive(tab) }/*, `w-1/${tabs.length}`*/]"
        v-for="tab in tabs"
        :key="`title${tab.name}`"
        @click="switchTabTo(tab)">
        <div class="w-full text-center uppercase">{{ tab.title }}</div>
      </button>
    </div>
    <div v-for="tab in tabs" :key="`content${tab.name}`">
      <div class="tabs-content flex w-full h-full py-4"
        v-if="_isActive(tab)">
        <slot :name="tab.name"/>
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
  },
  watch: {
    tabs(to){
      this.switchTabTo(to[0])
    }
  }
}
</script>
