<template>
  
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  layout: 'user_dashboard',
  async mounted(){
    this.orders = await this.$store.dispatch('user_dashboard/getOrdersForSeller', this.user)
  },
  data(){
    return {
      orders: []
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/user'
    })
  }
}
</script>