<template>
  <div class="mx-auto lp-container">
    <NoMobileModal ref="noMobileModal" />
    <AreaLoader v-if="isLoading" fullscreen />
    <VueTailwindModal
      ref="availableProductsModal"
      width="100%"
      content-class="rounded-none h-full shadow-none text-gray-600"
    >
      <div class="flex flex-col flex-grow">
        <div class="modal-heading border-b flex-grow p-4">
          <div class="flex justify-between flex-grow items-center">
            <div class="flex uppercase flex-col">
              <div>
                <strong>Select Products</strong>
              </div>
              <div
                class="text-xs normal-case"
              >Each collection can only have a maximum of 10 products.</div>
            </div>
            <div class="flex text-right">
              <div
                class="select-none cursor-pointer w-8 h-8 border rounded-full flex justify-center items-center hover:border-gray-600 hover:text-gray-700"
                @click="$refs.availableProductsModal.hide()"
              >
                <font-awesome-icon :icon="['fas', 'times']" class="text-xs" />
              </div>
            </div>
          </div>
        </div>
        <div class="flex modal-body flex-grow h-full">
          <AvailableProducts v-model="tmpSelectedProducts" />
        </div>
        <div class="flex modal-footer justify-between flex-shrink p-4 border-t items-center">
          <a
            href="#"
            class="text-blue-400 cursor-help border-dashed border-b hover:border-blue-400"
          >{{ tmpSelectedProducts.length || 'No' }} Products Selected</a>
          <button
            type="button"
            class="shadow-xl border border-white bg-primary px-8 py-2 font-bold rounded text-white hover:bg-primary-lighter"
            @click="createNewDesign"
          >CONTINUE</button>
        </div>
      </div>
    </VueTailwindModal>
    <AuthModal ref="authModal" @login-success="handleLoginSuccess" type="buyer" :form="form" />

    <div class="h-screen w-full">
      <div class="md:w-4/12 flex flex-col mx-auto justify-center">
        <img class="mx-auto mb-12 mt-6 w-5/12" src="~/assets/images/logo-nav.png" />
        <div class="sm:relative static sm:mt-0 mt-20">
          <img class="mx-auto" src="~/assets/images/custom-print-shirt.png" />
          <div class="text-center mt-8 absolute bottom-0 w-full mb-10 sm:mb-0">
            <button
              type="button"
              class="shadow-xl bg-primary px-8 py-6 font-bold rounded text-white hover:bg-primary-lighter"
              @click="handleStartClicked"
            >
              START DESIGNING
              <font-awesome-icon class="text-lg" :icon="['fas', 'arrow-circle-right']" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueTailwindModal from "@/components/VueTailwindModal";
import AvailableProducts from "@/components/Designer/AvailableProducts";
import AuthModal from "@/components/Auth/AuthModal";
import NoMobileModal from "@/components/NoMobileModal";
import { mapGetters } from "vuex";
import { isMobile } from "@/helpers";

export default {
  layout: "empty",
  head: {
    title: "Printree Studio | Landing Page",
    bodyAttrs: {
      class: "no-scroll",
    },
  },
  components: {
    VueTailwindModal,
    AvailableProducts,
    AuthModal,
    NoMobileModal,
  },
  mounted() {
    this.$ga.page({
      page: "/landing-page",
      title: "Landing page",
      location: window.location.href,
    });
  },
  data() {
    return {
      isLoading: false,
      tmpSelectedProducts: [],
      form: "sign_up",
    };
  },
  computed: {
    ...mapGetters({
      isLoggedIn: "isLoggedIn",
      user: "user",
      designMeta: "designer/designMeta",
    }),
  },
  methods: {
    handleStartClicked() {
      this.$ga.event({
        eventCategory: "landing-page",
        eventAction: "click",
        eventLabel: "Start Designing",
        eventValue: 1,
      });
      this.showAvailableProducts()
    },
    async showAvailableProducts() {
      if (isMobile()) {
        this.$refs.noMobileModal.show();
        return;
      }
      if (!this.isLoggedIn) {
        this.$refs.authModal.show();
        return;
      }
      this.isLoading = false;
      this.$refs.availableProductsModal.show();
    },
    handleLoginSuccess() {
      if (this.$flags.flagIs("flow", 2)) {
        this.$refs.authModal.hide();
        this.isLoading = false;
        this.showAvailableProducts();
        return;
      }
      this.createNewDesign();
    },
    async createNewDesign() {
      if (!this.isLoggedIn) {
        this.$refs.authModal.show();
        return;
      }
      this.$refs.authModal.hide();
      if (this.tmpSelectedProducts.length) {
        this.isLoading = true;
        let design = await this.$store.dispatch("designer/createNewDesign", {
          user: this.user,
          products: this.tmpSelectedProducts,
        });
        this.tmpSelectedProducts = [];
        this.$storage.setLocalStorage("current_design_id", design._id);
        this.$router.push("/collection/designer");
        return;
        ``;
      }
    },
  },
};
</script>

<style lang="scss">
.lp-container {
  background-image: url("/lp1-bg.jpg");
}
</style>
