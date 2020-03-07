<template>
  <div class="flex flex-grow text-gray-800">
    <AuthModal ref="authModal" @login-success="$refs.authModal.hide()" />
    <div class="flex flex-col flex-grow">
      <div class="bg-white shadow font-sans w-full m-0">
        <div class="bg-white">
          <div class="container mx-auto px-4">
            <div class="flex items-center justify-between py-4">
              <div class="w-4/12">
                <nuxt-link to="/marketplace">
                  <img src="~/assets/images/logo.png" alt="Printree" class="w-24" />
                </nuxt-link>
              </div>

              <div class="w-4/12 hidden sm:flex sm:items-center">
                <div class="mr-3">
                  <VueTailwindDropdown>
                    <template v-slot:trigger>
                      <a href="#" class="hover:text-primary text-sm flex items-center">
                        <font-awesome-icon :icon="['fas', 'bars']" class="mr-2" />
                        <span>Category</span>
                      </a>
                    </template>
                    <template v-slot:content>
                      <div class="p-4"></div>
                    </template>
                  </VueTailwindDropdown>
                </div>
                <div class="relative w-full">
                  <span
                    class="absolute text-primary"
                    style="top: 50%; transform: translateY(-50%); left: 14px;"
                  >
                    <font-awesome-icon :icon="['fas', 'search']" />
                  </span>
                  <input
                    name="name"
                    class="w-full py-2 px-3 pl-10 text-sm border rounded-full bg-gray-100 focus:outline-none outline-none"
                    autocomplete="off"
                    type="text"
                    placeholder="Search for product(s)..."
                  />
                </div>
                <div class="ml-3">
                  <button
                    type="button"
                    class="flex items-center hover:text-primary text-sm outline-none focus:outline-none"
                    @click="openCart"
                  >
                    <div class="relative">
                      <font-awesome-icon :icon="['fas', 'shopping-cart']" />
                    </div>
                    <span class="ml-2">Cart</span>
                  </button>
                </div>
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
                >Products</a>
                <a
                  href="#"
                  class="text-gray-800 text-sm font-semibold hover:text-primary-lighter mb-1"
                >Marketplace</a>
                <a
                  href="#"
                  class="text-gray-800 text-sm font-semibold hover:text-primary-lighter mb-1"
                >Partners</a>
                <a
                  href="#"
                  class="text-gray-800 text-sm font-semibold hover:text-primary-lighter mb-1"
                >Pricing</a>
                <div class="flex justify-between items-center border-t-2 pt-2">
                  <a
                    href="#"
                    class="text-gray-800 text-sm font-semibold hover:text-primary-lighter mr-4"
                  >Sign in</a>
                  <a
                    href="#"
                    class="text-gray-800 text-sm font-semibold border px-4 py-1 rounded-lg hover:text-primary-lighter hover:border-primary-lighter"
                  >Sign up</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-grow flex-col">
        <nuxt />
      </div>
      <Footer />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AuthModal from '@/components/Auth/AuthModal'
import Footer from '@/components/Footer'
import VueTailwindDropdown from '@/components/VueTailwindDropdown'

export default {
  head: {
    title: 'Printree'
  },
  components: {
    AuthModal,
    Footer,
    VueTailwindDropdown
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'user/isLoggedIn',
      user: 'user/user'
    })
  },
  methods: {
    openCart(){
      if(!this.isLoggedIn){
        this.$refs.authModal.show()
        return
      }
      this.$router.replace('/marketplace/cart')
    }
  }
}
</script>