<template>
  <div class="flex flex-grow flex-col">
    <NoMobileModal ref="noMobileModal" />
    <AuthModal ref="authModal" @login-success="$router.replace('/dashboard')" />
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
              <a
                :href="shopifyUrl"
                target="_blank"
                class="text-gray-800 font-semibold hover:text-primary-lighter mr-4"
              >Shop</a>
              <nuxt-link
                :to="dashboardLink"
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
              >Get Started</a>
            </div>

            <div class="sm:hidden cursor-pointer">
              <font-awesome-icon :icon="['fas', 'bars']" />
            </div>
          </div>

          <div class="block sm:hidden bg-white border-t-2 py-2">
            <div class="flex flex-col">
              <nuxt-link
                to="/marketplace"
                class="text-gray-800 font-semibold hover:text-primary-lighter mb-1"
              >Shop</nuxt-link>
              <div class="flex justify-between items-center border-t-2 pt-2">
                <a
                  href="#"
                  class="text-gray-800 font-semibold hover:text-primary-lighter mr-4"
                  @click.prevent="showAuthModal"
                >Get Started</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-grow">
      <div class="container mx-auto">
        <nuxt />
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AuthModal from "@/components/Auth/AuthModal";
import Footer from "@/components/Footer";
import NoMobileModal from "@/components/NoMobileModal";
import { isMobile } from "@/helpers";

export default {
  head: {
    title: "Printree Studio",
  },
  components: {
    Footer,
    AuthModal,
    NoMobileModal
  },
  created() {
    const inviteCode = this.$route.query.invite;
    if (inviteCode) this.$storage.setCookie("invite", inviteCode);
  },
  data() {
    return {
      shopifyUrl: process.env.shopifyUrl,
    };
  },
  computed: {
    ...mapGetters({
      isLoggedIn: "isLoggedIn",
      user: "user",
    }),
    dashboardLink() {
      if (!this.user) return "/dashboard";
      const isAdmin = _.includes(_.map(this.user.roles, "name"), "admin");
      if (isAdmin) return "/admin/collections";
      return "/dashboard";
    },
  },
  methods: {
    showAuthModal(){
      if (isMobile()) {
        this.$refs.noMobileModal.show();
        return;
      }
      this.$refs.authModal.show()
    },
    async signOut() {
      this.$router.replace("/");
      await this.$store.dispatch("user/signOut");
    },
  },
};
</script>
