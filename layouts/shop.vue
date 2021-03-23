<template>
  <div>
    <AuthModal ref="authModal" @login-success="$refs.authModal.hide()" :type="type" />
    <CartDrawer ref="cartDrawer" />
    <div class="fixed z-10 top-0 left-0 w-full" :style="{backgroundColor: navBG, height: '80px'}">
      <div class="flex flex-grow bg-transparent h-full">
        <div class="flex flex-grow">
          <div class="container mx-auto px-4">
            <div class="flex items-center justify-between py-4 relative h-full">
              <div class="flex flex-grow">
                <nuxt-link :to="shopHome" style="max-height: 80px;">
                  <img :src="shopLogo" alt="Printree Studio" class="w-20 absolute top-0 left-0 object-fit center-y" />
                </nuxt-link>
              </div>

              <div class="flex flex-grow hidden sm:flex sm:items-center justify-end">
                <nuxt-link
                  :to="shopHome"
                  class="font-semibold text-inline-hover"
                  :style="{color: shopConfig.navTextColor, '--hover-color': shopConfig.navTextHoverColor}"
                >All Products</nuxt-link>

                <button
                  type="button"
                  class="flex items-center hover:text-primary text-sm outline-none focus:outline-none px-4"
                  @click="openCart"
                >
                  <div class="relative">
                    <font-awesome-icon :icon="['fas', 'shopping-cart']" />
                    <span
                      class="absolute bg-primary rounded-full p-1 px-2 text-white flex justify-center items-center text-xs"
                      style="top: -15px; right: -15px;"
                    >{{ counts.cart }}</span>
                  </div>
                </button>
                <!-- <VueTailwindNotifications/> -->

                <VueTailwindDropdown width="200px" v-if="isLoggedIn && user">
                  <template v-slot:trigger>
                    <div
                      class="hidden md:block md:flex md:items-center ml-2 cursor-pointer text-inline-hover"
                      :style="{color: shopConfig.navTextColor, '--hover-color': shopConfig.navTextHoverColor}"
                    >
                      <span class="mr-1 font-bold">{{ user.name }}</span>
                      <div>
                        <font-awesome-icon :icon="['fas', 'chevron-down']" />
                      </div>
                    </div>
                  </template>
                  <template v-slot:content>
                    <div class="flex flex-col flex-grow">
                      <nuxt-link
                        to="/marketplace/account/settings"
                        class="flex items-center hover:bg-gray-200 px-4 py-2"
                      >
                        <span class="mr-2">
                          <font-awesome-icon :icon="['fas', 'cog']" />
                        </span>
                        <span>Account Settings</span>
                      </nuxt-link>
                    </div>
                    <div class="flex flex-col flex-grow">
                      <nuxt-link
                        to="/marketplace/account/orders"
                        class="flex items-center hover:bg-gray-200 px-4 py-2"
                      >
                        <span class="mr-2">
                          <font-awesome-icon :icon="['fas', 'boxes']" />
                        </span>
                        <span>My Orders</span>
                      </nuxt-link>
                    </div>
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
                <a
                  href="#"
                  class="text-gray-800 text-sm font-semibold border px-4 py-2 text-inline-hover"
                  id="get-started-btn"
                  :style="{color: shopConfig.navTextColor, '--hover-color': shopConfig.navTextHoverColor}"
                  @click.prevent="$refs.authModal.show()"
                  v-else
                >Sign In</a>
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
import AuthModal from "@/components/Auth/AuthModal";
import VueTailwindDropdown from "@/components/VueTailwindDropdown";
import CartDrawer from "@/components/marketplace/CartDrawer";
import { mapGetters } from "vuex";

export default {
  head(){
    return {
      title: `${this.shopConfig?.name || ''} | Printree Studio`
    }
  },
  components: {
    AuthModal,
    Footer,
    VueTailwindDropdown,
    CartDrawer,
  },
  async created(){
    this.$storage.setCookie("shop", this.$route.params.slug)
  },
  async mounted() {
    window.addEventListener("scroll", this.updateScroll);
    const config = await this.$store.dispatch("shop/shopConfig", this.$route.params.slug);
    this.$store.commit("shop/SHOP_CONFIG", config)
    if (this.isLoggedIn && this.user._id)
      await this.$store.dispatch("marketplace/getMPCounts", [
        "toPay",
        "toShip",
        "toReceive",
        "delivered",
        "cart",
      ]);
    this.isLoading = false;
  },
  data() {
    return {
      isLoading: true,
      scrollPosition: null,
      type: "customer",
    };
  },
  computed: {
    ...mapGetters({
      isLoggedIn: "isLoggedIn",
      user: "user",
      counts: "marketplace/counts",
      shopConfig: "shop/shopConfig",
    }),
    shopLogo() {
      return this.shopConfig?.logo || "~/assets/images/logo-nav.png";
    },
    shopHome() {
      return `/marketplace/shop/${this.$route.params.slug}`;
    },
    navBG() {
      let bg = this.shopConfig.colors.navBG;
      return this.scrollPosition > 100 ? bg : "transparent";
    },
  },
  methods: {
    updateScroll() {
      this.scrollPosition = window.scrollY;
    },
    openCart() {
      if (!this.isLoggedIn) {
        this.$refs.authModal.show();
        return;
      }
      this.$refs.cartDrawer.show();
    },
    async signOut() {
      if (this.$route.name !== "marketplace")
        await this.$router.replace("/marketplace");
      setTimeout(() => {
        this.$store.dispatch("user/signOut");
      });
    },
  },
};
</script>