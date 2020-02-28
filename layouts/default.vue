<template>
  <div class="flex flex-grow flex-col">
    <AuthModal ref="authModal" @login-success="$router.replace('/dashboard')" />
    <div class="fixed w-full z-10">
      <div class="flex flex-grow">
        <div class="container mx-auto px-4">
          <div class="flex items-center justify-between py-4">
            <div class="w-4/12">
              <img src="~/assets/images/logo-nav.png" alt="Printree" class="w-24" />
            </div>

            <div class="w-4/12 hidden sm:flex sm:items-center justify-center">
              <nuxt-link
                to="/marketplace"
                class="text-gray-800 text-sm font-semibold hover:text-primary-lighter mr-4"
              >Marketplace</nuxt-link>
              <a
                href="#"
                class="text-gray-800 text-sm font-semibold hover:text-primary-lighter mr-4"
              >How it Works?</a>
            </div>

            <div class="w-4/12 hidden sm:flex sm:items-center justify-end">
              <nuxt-link
                to="/dashboard"
                class="text-gray-800 text-sm font-semibold border px-4 py-2 rounded-lg hover:text-primary-lighter hover:border-primary-lighter bg-white"
                v-if="isLoggedIn"
              >
                <span>{{ user.email }}</span>
                <span class="ml-3">
                  <font-awesome-icon :icon="['fas', 'arrow-right']" />
                </span>
              </nuxt-link>
              <a
                href="#"
                class="text-gray-800 text-sm font-semibold border px-4 py-2 rounded-lg hover:text-primary-lighter hover:border-primary-lighter bg-white"
                @click.prevent="$refs.authModal.show()"
                v-else
              >Get Started</a>
            </div>

            <div class="sm:hidden cursor-pointer">
              <font-awesome-icon :icon="['fas', 'bars']" />
            </div>
          </div>

          <div class="block sm:hidden bg-white border-t-2 py-2">
            <div class="flex flex-col">
              <a
                href="#"
                class="text-gray-800 text-sm font-semibold hover:text-primary-lighter mb-1"
              >Marketplace</a>
              <div class="flex justify-between items-center border-t-2 pt-2">
                <a
                  href="#"
                  class="text-gray-800 text-sm font-semibold hover:text-primary-lighter mr-4"
                  @click.prevent="$refs.authModal.show()"
                >Get Started</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-grow">
      <nuxt />
    </div>
    <Footer />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AuthModal from '@/components/Auth/AuthModal'
import Footer from '@/components/Footer'

export default {
  head: {
    title: 'Printree'
  },
  components: {
    Footer,
    AuthModal
  },
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
