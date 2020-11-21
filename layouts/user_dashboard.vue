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
              <nuxt-link to="/">
                <img
                  src="~/assets/images/logo-nav.png"
                  alt="Printree"
                  class="w-24"
                />
              </nuxt-link>
            </div>
            <div class="w-1/4 md:w-auto md:flex text-right">
              <VueTailwindDropdown>
                <template v-slot:trigger>
                  <div
                    class="hidden md:block md:flex md:items-center ml-2 cursor-pointer hover:text-primary"
                  >
                    <span class="text-sm mr-1">{{ user.email }}</span>
                    <div>
                      <font-awesome-icon :icon="['fas', 'chevron-down']" />
                    </div>
                  </div>
                </template>
                <template v-slot:content>
                  <div class="flex flex-col flex-grow">
                    <a
                      href="#"
                      class="flex items-center hover:bg-gray-200 px-4 py-2"
                      @click.prevent="signOut"
                    >
                      <span class="mr-2">
                        <font-awesome-icon :icon="['fas', 'sign-out-alt']" />
                      </span>
                      <span>Logout</span>
                    </a>
                  </div>
                </template>
              </VueTailwindDropdown>
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
              </div>-->
              <div class="flex -mb-px mr-8">
                <nuxt-link
                  to="/dashboard/collections"
                  class="no-underline flex items-center py-4 border-b border-transparent md:hover:border-grey-dark uppercase font-bold text-sm"
                  active-class="text-primary"
                >
                  <span class="h-6 w-6 fill-current mr-2">
                    <font-awesome-icon :icon="['fas', 'boxes']" />
                  </span>
                  My Collections
                </nuxt-link>
              </div>
              <!-- <div class="flex -mb-px mr-8">
                <nuxt-link
                  to="/dashboard/my-orders"
                  class="no-underline flex items-center py-4 border-b border-transparent md:hover:border-grey-dark uppercase font-bold text-sm"
                  active-class="text-primary"
                >
                  <span class="h-6 w-6 fill-current mr-2">
                    <font-awesome-icon :icon="['fas', 'box']" />
                  </span> My Orders
                </nuxt-link>
              </div> -->
              <div class="flex -mb-px">
                <nuxt-link
                  to="/dashboard/account-settings"
                  class="no-underline flex items-center py-4 border-b border-transparent md:hover:border-grey-dark uppercase font-bold text-sm"
                  active-class="text-primary"
                >
                  <span class="h-6 w-6 fill-current mr-2">
                    <font-awesome-icon :icon="['fas', 'cog']" />
                  </span>
                  Account Settings
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-grow container mx-auto sm:px-4 pt-6 pb-8">
      <nuxt />
    </div>
  </div>
</template>

<script>
import TotalProfitCounter from "@/components/TotalProfitCounter";
import VueTailwindDropdown from "@/components/VueTailwindDropdown";
import { mapGetters } from "vuex";

export default {
  head: {
    title: "Dashboard",
  },
  middleware: ["auth"],
  components: {
    VueTailwindDropdown,
    TotalProfitCounter,
  },
  computed: {
    ...mapGetters({
      isLoggedIn: "isLoggedIn",
      user: "user",
    }),
  },
  methods: {
    async signOut() {
      await this.$router.replace("/");
      await this.$store.dispatch("user/signOut");
    },
  },
};
</script>
