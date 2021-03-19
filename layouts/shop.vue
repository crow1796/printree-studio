<template>
  <div>
    <div class="fixed top-0 left-0 w-full">
      <div class="flex flex-grow bg-transparent z-10">
        <div class="flex flex-grow">
          <div class="container mx-auto px-4">
            <div class="flex items-center justify-between py-4">
              <div class="flex flex-grow">
                <nuxt-link to="/">
                  <img
                    src="~/assets/images/logo-nav.png"
                    alt="Printree Studio"
                    class="w-28 object-fit"
                  />
                </nuxt-link>
              </div>

              <div class="flex flex-grow hidden sm:flex sm:items-center justify-end">
                <nuxt-link
                  to="/marketplace"
                  class="text-gray-800 font-semibold hover:text-primary-lighter mr-4"
                >All Products</nuxt-link>
                <nuxt-link
                  to="/account/orders"
                  class="text-gray-800 text-sm font-semibold border px-4 py-2 rounded hover:text-primary-lighter hover:border-primary-lighter bg-white"
                  v-if="isLoggedIn && user"
                >
                  <span>
                    <span>{{ user.shopName ? `${user.shopName}'s` : user.email }}</span>
                    <span class="ml-3">
                      <font-awesome-icon :icon="['fas', 'arrow-right']" />
                    </span>
                  </span>
                </nuxt-link>
                <a
                  href="#"
                  class="text-gray-800 text-sm font-semibold border px-4 py-2 rounded hover:text-primary-lighter hover:border-primary-lighter bg-white"
                  @click.prevent="showAuthModal"
                  v-else
                >Login</a>
              </div>

              <div class="sm:hidden cursor-pointer">
                <font-awesome-icon :icon="['fas', 'bars']" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <nuxt />
    <Footer />
  </div>
</template>

<script>
import Footer from "@/components/Footer";
import { mapGetters } from "vuex";

export default {
  head: {
    title: "Printree Studio"
  },
  components: {
    Footer
  },
  data(){
    return {
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      isLoggedIn: "isLoggedIn",
      user: "user",
    }),
  },
};
</script>