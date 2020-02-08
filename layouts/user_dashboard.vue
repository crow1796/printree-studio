<template>
  <div class="text-gray-800 flex flex-col min-h-screen w-full">
    <div>
      <div class="border-b">
        <div class="container mx-auto px-4">
          <div class="flex items-center md:justify-between py-4">
            <div class="w-1/4 md:hidden">
              <svg
                class="fill-current h-8 w-8"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  d="M16.4 9H3.6c-.552 0-.6.447-.6 1 0 .553.048 1 .6 1h12.8c.552 0 .6-.447.6-1 0-.553-.048-1-.6-1zm0 4H3.6c-.552 0-.6.447-.6 1 0 .553.048 1 .6 1h12.8c.552 0 .6-.447.6-1 0-.553-.048-1-.6-1zM3.6 7h12.8c.552 0 .6-.447.6-1 0-.553-.048-1-.6-1H3.6c-.552 0-.6.447-.6 1 0 .553.048 1 .6 1z"
                />
              </svg>
            </div>
            <div class="w-1/2 md:w-auto text-center">
              <img src="~/assets/images/logo-nav.png" alt="Printree" class="w-10" />
            </div>
            <div class="w-1/4 md:w-auto md:flex text-right">
              <div>
                <img
                  class="inline-block h-8 w-8 rounded-full"
                  src="https://avatars0.githubusercontent.com/u/4323180?s=460&v=4"
                  alt
                />
              </div>
              <div class="hidden md:block md:flex md:items-center ml-2">
                <span class="text-sm mr-1">test@gmail.com</span>
                <div>
                  <svg
                    class="fill-current h-4 w-4 block opacity-50"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M4.516 7.548c.436-.446 1.043-.481 1.576 0L10 11.295l3.908-3.747c.533-.481 1.141-.446 1.574 0 .436.445.408 1.197 0 1.615-.406.418-4.695 4.502-4.695 4.502a1.095 1.095 0 0 1-1.576 0S4.924 9.581 4.516 9.163c-.409-.418-.436-1.17 0-1.615z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="hidden bg-blue-dark md:block md:bg-white md:border-b">
        <div class="container mx-auto px-4">
          <div class="md:flex justify-between items-center">
            <div class="flex">
              <!-- <div class="flex -mb-px mr-8">
                <nuxt-link
                  to="/dashboard"
                  class="no-underline md:text-blue-dark flex items-center py-4 border-b border-blue-dark"
                >
                  <span class="h-6 w-6 fill-current mr-2">
                    <font-awesome-icon :icon="['fas', 'th-large']" />
                  </span> Dashboard
                </nuxt-link>
              </div> -->
              <div class="flex -mb-px mr-8">
                <nuxt-link
                  to="/dashboard/collections"
                  class="no-underline opacity-50 md:text-grey-dark md:opacity-100 flex items-center py-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark"
                >
                  <span class="h-6 w-6 fill-current mr-2">
                    <font-awesome-icon :icon="['fas', 'boxes']" />
                  </span> My Collections
                </nuxt-link>
              </div>
              <div class="flex -mb-px">
                <nuxt-link
                  to="/dashboard/settings"
                  class="no-underline opacity-50 md:text-grey-dark md:opacity-100 flex items-center py-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark"
                >
                  <span class="h-6 w-6 fill-current mr-2">
                    <font-awesome-icon :icon="['fas', 'cog']" />
                  </span> Settings
                </nuxt-link>
              </div>
            </div>
            <div class="flex">
              <a
                  href="#"
                  class="no-underline md:text-blue-dark flex items-center bg-primary rounded-full h-8 px-6 text-white"
                >
                  <span class="h-6 w-6 fill-current mr-2 font-bold">
                    PHP
                  </span>&nbsp;<span>15,254.25</span>
                </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-grow container mx-auto sm:px-4 pt-6 pb-8">
      <nuxt/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  head: {
    title: 'Dashboard'
  },
  middleware: ['authenticated'],
  computed: {
    ...mapGetters({
      isLoggedIn: 'user/isLoggedIn',
      user: 'user/user'
    })
  },
  methods: {
    signOut() {
      this.$store.dispatch('user/signOut')
    }
  }
}
</script>
