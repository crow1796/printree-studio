<template>
  <div class="flex flex-grow text-gray-800">
    <AuthModal ref="authModal" @login-success="$refs.authModal.hide()" :type="type" />
    <CartDrawer ref="cartDrawer" />
    <div class="flex flex-col flex-grow">
      <div class="bg-white font-sans w-full m-0">
        <div class="bg-white relative">
          <div class="container mx-auto px-4">
            <div class="flex items-center justify-between py-4">
              <div class="w-4/12">
                <nuxt-link to="/marketplace">
                  <img
                    src="~/assets/images/logo-nav.png"
                    alt="Printree Studio"
                    class="w-28 object-fit"
                  />
                </nuxt-link>
              </div>

              <!-- <div class="w-4/12 hidden sm:flex sm:items-center">
                <div class="mr-3" v-if="categories.length">
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
              </div>-->

              <div class="w-4/12 hidden sm:flex sm:items-center justify-end">
                <nuxt-link
                  to="/marketplace/"
                  class="text-gray-800 font-semibold hover:text-primary-lighter mr-4"
                >All Shops</nuxt-link>
                <nuxt-link
                  to="/marketplace/products"
                  class="text-gray-800 font-semibold hover:text-primary-lighter"
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

                <VueTailwindDropdown width="200px" v-if="isLoggedIn && user._id">
                  <template v-slot:trigger>
                    <div
                      class="hidden md:block md:flex md:items-center ml-2 cursor-pointer hover:text-primary"
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
                  class="text-gray-800 text-sm font-semibold border px-4 py-2 hover:text-primary-lighter hover:border-primary-lighter bg-white"
                  id="get-started-btn"
                  @click.prevent="$refs.authModal.show()"
                  v-else
                >Sign In</a>
              </div>

              <div class="sm:hidden cursor-pointer flex items-center">
                <button
                  type="button"
                  class="flex items-center hover:text-primary text-sm outline-none focus:outline-none pr-6"
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

                <font-awesome-icon :icon="['fas', 'bars']" @click="isNavOpened = !isNavOpened" />
              </div>

              <div
                class="sm:hidden absolute w-full top-full z-10 bg-white shadow-xl left-0"
                v-if="isNavOpened"
                v-click-outside="() => isNavOpened = false"
              >
                <div>
                  <nuxt-link
                    to="/marketplace/"
                    class="flex items-center hover:bg-gray-200 px-4 py-2"
                  >
                    <span class="mr-2">
                      <font-awesome-icon :icon="['fas', 'store']" />
                    </span>
                    <span>All Shops</span>
                  </nuxt-link>
                </div>
                <div>
                  <nuxt-link
                    to="/marketplace/products"
                    class="flex items-center hover:bg-gray-200 px-4 py-2"
                  >
                    <span class="mr-2">
                      <font-awesome-icon :icon="['fas', 'tags']" />
                    </span>
                    <span>All Products</span>
                  </nuxt-link>
                </div>
                <div v-if="isLoggedIn && user._id">
                  <div>
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
                  <div>
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
                  <div>
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
                </div>
                <div v-else>
                  <a
                    href="#"
                    class="flex items-center hover:bg-gray-200 px-4 py-2"
                    id="get-started-btn"
                    @click.prevent="$refs.authModal.show()"
                  >
                    <span class="mr-2">
                      <font-awesome-icon :icon="['fas', 'sign-out-alt']" />
                    </span>
                    <span>Sign In</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-grow flex-col min-h-area-loader">
        <nuxt />
      </div>
      <Footer />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AuthModal from "@/components/Auth/AuthModal";
import Footer from "@/components/Footer";
import VueTailwindDropdown from "@/components/VueTailwindDropdown";
import VueTailwindNotifications from "@/components/VueTailwindNotifications";
import CartDrawer from "@/components/marketplace/CartDrawer";

export default {
  head: {
    title: "Printree Studio",
  },
  components: {
    AuthModal,
    Footer,
    VueTailwindDropdown,
    CartDrawer,
    VueTailwindNotifications,
  },
  async mounted() {
    if (this.isLoggedIn && this.user._id)
      await this.$store.dispatch("marketplace/getMPCounts", [
        "toPay",
        "toShip",
        "toReceive",
        "delivered",
        "cart",
      ]);
  },
  computed: {
    ...mapGetters({
      isLoggedIn: "isLoggedIn",
      user: "user",
      counts: "marketplace/counts",
    }),
  },
  data() {
    return {
      categories: [],
      type: "customer",
      isNavOpened: false,
    };
  },
  methods: {
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