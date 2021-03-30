<template>
  <client-only>
    <div class="flex-grow flex flex-col text-sm h-full">
      <AreaLoader v-if="isLoading" fullscreen :text="loadingText" />
      <VueTailwindModal
        ref="saveConfirmationModal"
        width="30%"
        content-class="rounded-none shadow-none text-gray-600"
        :backdrop="false"
      >
        <div class="flex flex-col">
          <div class="modal-heading border-b w-full p-4">
            <div class="flex justify-between w-full items-center">
              <div class="flex uppercase justify-center flex-grow">
                <strong>Confirmation</strong>
              </div>
            </div>
          </div>
          <div class="modal-body p-4 text-center">Do you want to save your changes?</div>
          <div class="flex modal-footer justify-between flex-shrink p-4 border-t items-center">
            <button
              type="button"
              class="justify-center items-center focus:outline-none outline-none border px-3 py-2 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
              @click="hideSaveConfirmationModal"
            >Cancel</button>

            <div>
              <button
                type="button"
                class="justify-center items-center focus:outline-none outline-none border px-3 py-2 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
                @click="dontSave"
              >Don't Save</button>
              <button
                type="button"
                class="shadow-xl border border-white bg-primary px-8 py-2 font-bold rounded text-white hover:bg-primary-lighter"
                @click="saveChanges"
              >Save</button>
            </div>
          </div>
        </div>
      </VueTailwindModal>
      <AuthModal ref="authModal" />
      <div class="w-full p-4 flex border-b">
        <div class="flex w-1/3">
          <img src="~/assets/images/logo.png" alt="Printree Studio" class="w-24 object-contain" />
        </div>
        <div class="flex w-1/3 justify-center items-center">
          <div class="flex" v-if="!isEditingDesignName" style="animation-duration: 0.2s">
            <span class="text-primary uppercase font-bold">Collection</span>
            <span class="mx-1">/</span>
            <span
              class="font-normal text-gray-600 hover:underline hover:text-gray-700"
              @click="startEditingName"
            >{{ currentDesignName }}</span>
          </div>
          <div class="flex" v-if="isEditingDesignName" style="animation-duration: 0.2s">
            <input
              type="text"
              ref="designNameField"
              class="text-center text-gray-600 outline-none focus:outline-none"
              :value="currentDesignName"
              @blur="updateDesignName($event.target.value)"
              @keyup.enter="$event.target.blur()"
            />
          </div>
        </div>
        <div class="flex w-1/3 items-center justify-end">
          <a href="#" @click.stop="goToDashboard" class="text-blue-400">Go to Dashboard</a>
          <div class="w-4"></div>
          <PTButton
            color="primary"
            @click="nextStep"
            v-intro="'Finally, click on this button when you\'re done designing all of your products. And that\'s it!'"
            v-intro-step="6"
            v-intro-disable-interaction="true"
          >NEXT</PTButton>
        </div>
      </div>
      <div class="flex flex-grow" id="right-content">
        <ProductsPreviewDrawer
          ref="productsPreviewDrawer"
          :meta="designMeta"
          :products="generatedImages"
        />
        <nuxt v-if="!isLoading" />
      </div>
    </div>
  </client-only>
</template>


<script>
import VueTailwindModal from "@/components/VueTailwindModal";
import ProductsPreviewDrawer from "@/components/ProductsPreviewDrawer";
import AuthModal from "@/components/Auth/AuthModal";
import { mapGetters } from "vuex";

export default {
  head: {
    title: "Printree Studio",
    bodyAttrs: {
      class: "no-scroll",
    },
    meta: [
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
  },
  components: {
    VueTailwindModal,
    AuthModal,
    ProductsPreviewDrawer,
  },
  middleware: "authenticated",
  computed: {
    ...mapGetters({
      isLoggedIn: "isLoggedIn",
      designMeta: "designer/designMeta",
      user: "user",
      currentDesignName: "designer/currentDesignName",
      currentDesignId: "designer/currentDesignId",
      selectedProducts: "designer/selectedProducts",
      currentProductIndex: "designer/currentProductIndex",
    }),
  },
  async created() {
    if (process.client) {
      if (this.$route.query.id) {
        this.$storage.setLocalStorage(
          "current_design_id",
          this.$route.query.id
        );
      }
      this.$store.commit(
        "designer/CURRENT_DESIGN_ID",
        this.$storage.getLocalStorage("current_design_id")
      );
      await this.$store.dispatch(
        "designer/fetchDesignDataAndCommit",
        {
          id: this.currentDesignId,
          products: this.$route.query.prod ? [this.$route.query.prod] : null
        }
      );

      await this.$store.dispatch("designer/fetchArts");
      this.isLoading = false;
    }
  },
  mounted() {
    window.onbeforeunload = (e) => {
      e = e || window.event;
      // For IE and Firefox prior to version 4
      if (e) {
        e.returnValue = "Sure?";
      }
      // For Safari
      return "Sure?";
    };
  },
  destroyed() {
    window.onbeforeunload = null;
  },
  data() {
    return {
      loadingText: "",
      isLoading: true,
      isEditingDesignName: false,
      generatedImages: [],
      isSingle: this.$flags?.get("single") === "on",
    };
  },
  methods: {
    hideSaveConfirmationModal() {
      this.$refs.saveConfirmationModal.hide();
    },
    dontSave() {
      this.$refs.saveConfirmationModal.hide();
      let route = '/dashboard/collections'
      this.$router.push(route);
    },
    async saveChanges() {
      this.$refs.saveConfirmationModal.hide();
      this.isLoading = true;
      await this.$store.dispatch("designer/saveData", {
        shouldGenerateImages: false,
      });
      this.isLoading = false;
      let route = '/dashboard/collections'
      this.$router.push(route);
    },
    goToDashboard() {
      this.$refs.saveConfirmationModal.show();
    },
    startEditingName() {
      this.isEditingDesignName = true;
      this.$nextTick(() => {
        this.$refs.designNameField.focus();
        this.$refs.designNameField.setSelectionRange(
          0,
          this.$refs.designNameField.value.length
        );
      });
    },
    updateDesignName(newName) {
      if (!newName.trim()) return;
      this.$store.dispatch("designer/updateDesignName", newName);
      this.isEditingDesignName = false;
    },
    async nextStep() {
      let contentsValidation = true;
      let products = this.selectedProducts
      if(this.$route.query.prod) {
        products = products.filter((prod) => prod._id === this.$route.query.prod)
      }
      _.map(products, (product) => {
        _.map(product.variants, (variant) => {
          const sidesThatHasContents = _.filter(
            variant.contents,
            (content) => content.objects.length
          );

          if (sidesThatHasContents.length === 0) contentsValidation = false;
        });
      });

      if (!contentsValidation) {
        this.$toast.error(
          "Cannot Proceed. Please make sure to add designs on all of your products.",
          {
            position: "top",
          }
        );
        return;
      }

      if (!this.isLoggedIn) return this.$refs.authModal.show();
      this.loadingText = "Saving Data...";

      this.isLoading = true;
      await this.$store.dispatch("designer/saveData", {
        shouldGenerateImages: false,
        products
      });

      this.generatedImages = _.map(products, () => null);

      await products.reduce(async (promise, product, i) => {
        await promise;

        const res = await this.$axios.post("/create-images", {
          products: [product],
        });

        this.$set(this.generatedImages, i, _.first(res.data));

        if (i === 0) {
          this.loadingText = "";
          this.isLoading = false;
          this.$refs.productsPreviewDrawer.show();
        }
      }, Promise.resolve());
    },
  },
};
</script>
