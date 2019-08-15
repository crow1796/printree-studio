<template>
  <div class="select select-none relative">
    <div class="justify-between h-full items-center focus:outline-none mx-1 outline-none flex flex-grow border px-3 py-2 font-bold rounded cursor-pointer text-gray-600 border-grey-lightest hover:bg-gray-100"
      @click="show">
      <span>{{ selectedText }}</span>
      <span class="inline-block ml-2">
        <font-awesome-icon :icon="['fas', 'sort']"/>
      </span>
      <div class="options bg-white shadow-lg focus:outline-none"
        v-if="isCollapsed"
        v-click-outside="hide"
        @keyup.38="onArrowUp"
        @keyup.40="onArrowDown"
        focusable
        ref="options"
        :style="{ width: listWidth }">
        <div v-if="filterable" class="option cursor-default border-b p-4 flex items-center">
          <font-awesome-icon :icon="['fas', 'search']" class="mr-2"/>
          <input v-model="query" type="text" class="focus:outline-none w-full" placeholder="Search an item...">
        </div>
        <simplebar class="list"
          :style="{ maxHeight: listHeight }">
          <RecycleScroller
            :items="filteredOptions"
            key-field="value"
            :item-size="54"
            v-slot="{ item, index }">
            <div class="option hover:bg-gray-200 p-4 flex justify-between"
              :class="{ 'border-b': index != (options.length - 1) }"
              @click.stop="select(item)">
              <div v-if="!$slots.default">
                <span>{{ item.label }}</span>
              </div>
              <slot v-else :item="item"></slot>
              <font-awesome-icon v-if="model && item.value == model.value" :icon="['fas', 'check']"/>
            </div>
          </RecycleScroller>
        </simplebar>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      required: true
    },
    value: {
      default: null
    },
    placeholder: {
      default: 'Choose an item'
    },
    filterable: {
      type: Boolean
    },
    flexible: {
      type: Boolean
    },
    listHeight: {
      type: String,
      default: '200px'
    },
    listWidth: {
      type: String,
      default: '100%'
    }
  },
  data(){
    return {
      model: this.value,
      isCollapsed: false,
      query: ''
    }
  },
  computed: {
    selectedText(){
      return this.model ? this.model.label : (this.placeholder ? this.placeholder : (this.options.length ? this.options[0].label : '&nbsp;'))
    },
    filteredOptions(){
      return this.filterable ? _.filter(this.options, (option) => _.includes(option.label.toLowerCase(), this.query.toLowerCase()) || _.includes(option.value.toLowerCase(), this.query.toLowerCase())) : this.options
    }
  },
  methods: {
    select(option){
      this.model = option
      this.isCollapsed = false
      this.$emit('change', option)
    },
    show(){
      this.isCollapsed = true
      this.$nextTick(() => {
        this.$refs.options.focus()
      })
    },
    hide(){
      if(this.isCollapsed) this.isCollapsed = false
    },
    onArrowDown(ev) {
      ev.preventDefault()
      if (this.arrowCounter < this.options.length - 1) {
          this.arrowCounter = this.arrowCounter + 1
          this.fixScrolling()
      }
    },
    onArrowUp(ev) {
      ev.preventDefault()
      if (this.arrowCounter > 0) {
          this.arrowCounter = this.arrowCounter - 1
          this.fixScrolling()
      }
    },
    fixScrolling(){
      const liH = this.$refs.options[this.arrowCounter].clientHeight
      this.$refs.scrollContainer.scrollTop = liH * this.arrowCounter
    }
  }
}
</script>

<style lang="scss" scoped>
  .options{
    position: absolute;
    border: 1px solid rgba(0, 0, 0, .1);
    top: 100%;
    left: 0;
  }

  .list{
    overflow: auto;
  }
</style>

