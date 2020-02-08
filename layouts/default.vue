<template>
  <div>
    <div class="w-full flex navbar flex-col text-sm border-b">
      <div class="w-full px-32 py-2 flex">
        <div class="flex w-1/2">
          <img src="~/assets/images/logo-nav.png"
            alt="Printree"
            class="w-10">
        </div>
        <div class="flex w-1/2 items-center justify-end">
          <nuxt-link to="/shop"
            class="text-primary mx-4 hover:text-primary-lighter">
            How it works?
          </nuxt-link>
          <nuxt-link to="/shop"
            class="text-primary mx-4 hover:text-primary-lighter">
            Shop
          </nuxt-link>
          <a href="#"
            class="text-primary mx-4 hover:text-primary-lighter"
            @click.prevent="signOut">
            {{ isLoggedIn ? 'Logout' : 'Sign In' }}
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
