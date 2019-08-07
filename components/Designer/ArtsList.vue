<template>
  <div class="flex w-full flex-wrap h-full overflow-hidden">
    <div class="flex flex-col w-1/4 m-1 h-32 art rounded border cursor-pointer hover:border-gray-500"
      v-for="(art, index) in arts"
      :key="index"
      @click="$emit('selected', art)">
      <div class="text-center mt-2 text-gray-600">
        {{ art.label }}
      </div>
      <div class="flex w-full h-full px-4 pb-4 pt-2 items-center justify-center"
        v-html="art.value"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      arts: 'designer/arts'
    })
  }
}
</script>
