<template>
  <div class="font-body">
    <div class="w-full flex navbar flex-col text-sm border-b">
      <div class="w-full px-32 py-2 flex">
        <div class="flex w-1/2">
          <img src="~/assets/images/logo-nav.png"
            alt="Printree"
            class="w-10">
        </div>
        <div class="flex w-1/2 items-center justify-end">
          <a href="#"
            class="text-blue-400 mx-4 hover:text-blue-600">
            SHOP
          </a>
          <a href="#"
            class="text-blue-400 mx-4 hover:text-blue-600"
            @click.prevent="signOut">
            {{ isLoggedIn ? 'LOGOUT' : 'LOGIN' }}
          </a>
          <div class="w-4"></div>
        </div>
      </div>
    </div>
    <div class="flex">
      <nuxt/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  head: {
    title: 'Printree'
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'user/isLoggedIn',
      user: 'user/user'
    })
  },
  methods: {
    signOut(){
      this.$store.dispatch('user/signOut')
    }
  }
}
</script>
