<template>
  <div class="relative">
    <span @click="isOpen = !isOpen">
      <slot name="trigger"/>
    </span>
    <div class="absolute bg-white shadow-xl rounded" :class="isOpen ? 'block' : 'hidden'">
      <slot name="content"/>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      isOpen: false
    }
  }
}
</script>