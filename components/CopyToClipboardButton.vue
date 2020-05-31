<template>
  <a
    href="#"
    title="Copy link to clipboard"
    v-tippy="{ arrow: true }"
    class="cursor-pointer hover:text-primary mx-1"
  >
    <font-awesome-icon :icon="['fas', 'clipboard']" />
  </a>
</template>

<script>
export default {
  
}
</script>