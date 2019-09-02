<template>
  <button :type="type"
    class="border px-8 py-2 font-bold rounded outline-none focus:outline-none"
    :class="btnColor"
    @click="$emit('click', $event)">
    <slot/>
  </button>
</template>

<script>
export default {
  name: 'PTButton',
  props: {
    type: {
      type: String,
      default: 'button'
    },
    color: {
      type: String
    },
    icon: {
      type: Boolean
    }
  },
  computed: {
    btnColor(){
      let btnColor = ''
      switch(this.color){
        case 'primary':
          btnColor = 'border-white bg-primary text-white hover:bg-primary-lighter'
          break
        default:
          btnColor = 'bg-white text-gray-600 border-grey-lightest hover:bg-gray-100'
      }
      return btnColor
    }
  }
}
</script>
