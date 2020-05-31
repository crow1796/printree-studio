<template>
  <div class="w-full top-0 left-0 h-full bg-white z-50 items-center justify-center flex"
    :class="{ 'absolute': !fullscreen, 'fixed': fullscreen }">
    <div class="flex flex-col justify-center items-center">
      <img src="~/assets/images/loader.svg"/>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    fullscreen: {
      type: Boolean
    }
  }
}
</script>
