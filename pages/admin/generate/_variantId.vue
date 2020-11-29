<template>
  <div>
    <AreaLoader v-if="isLoading" fullscreen/>
  </div>
</template>

<script>
import AreaLoader from '@/components/AreaLoader'

export default {
  layout: "admin_dashboard",
  async mounted(){
    console.log(this.$route.params.variantId)
    this.isLoading = false
  },
  data (){
    return {
      isLoading: true
    }
  }
}
</script>