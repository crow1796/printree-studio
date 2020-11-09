<template>
  <div class="flex w-full flex-wrap h-full overflow-hidden">
    <div class="flex w-1/4 h-32 p-1" v-for="(art, index) in arts" :key="index">
      <div
        class="art rounded border cursor-pointer hover:border-gray-500"
        @click="$emit('selected', art)"
      >
        <div class="flex w-full h-full items-center justify-center overflow-hidden">
          <img :src="art.location" class="object-contain w-full h-full" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      arts: "designer/arts"
    })
  }
};
</script>
