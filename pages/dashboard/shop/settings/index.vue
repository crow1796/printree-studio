<template>
  <div class="relative">
    <AreaLoader v-if="isLoading" />
    <div class="py-4 w-full sm:w-6/12 mx-auto">
      <div class="my-2 flex sm:flex-row justify-between items-center">
        <h2 class="text-2xl font-semibold leading-tight">Shop Settings</h2>
      </div>
      <form @submit.prevent="updateShop">
        <div class="mb-3">
          <label for="name" class="font-bold">Logo</label>
          <div class="mt-4">
            <vue-dropzone
              class="h-full border-0 flex items-center justify-center w-fulll sm:w-6/12 cursor-pointer border border-dashed"
              :class="{'-uploading': isLogoLoading}"
              ref="logoDropzone"
              id="logo-dropzone"
              :options="{
                    url: `${apiUrl}/shop/upload-logo`,
                      thumbnailWidth: 150,
                      maxFiles: 1,
                      acceptedFiles: 'image/svg+xml, image/png, image/jpeg, image/bmp',
                      }"
              @vdropzone-sending="(a, b) => assetSending(a, b, 'logo')"
              @vdropzone-success="(res, b) => assetAdded(res, b, $refs.logoDropzone)"
              useCustomSlot
            >
              <div class="dropzone-custom-content">
                <img v-if="shop && shop.logo" :src="shop.logo" />
                <div v-else>Click here or drop file here to upload.</div>
              </div>
            </vue-dropzone>
          </div>
          <span
            class="text-red-700 text-xs pt-1 font-bold inline-block"
            v-if="errors.has('name')"
          >{{ errors.first('name') }}</span>
        </div>
        <div class="mb-3">
          <label for="email" class="font-bold">Banner</label>
          <div class="mt-4">
            <vue-dropzone
              class="h-full border-0 flex items-center justify-center cursor-pointer border border-dashed"
              :class="{'-uploading': isBannerLoading}"
              ref="bannerDropzone"
              id="banner-dropzone"
              :options="{
                    url: `${apiUrl}/shop/upload-banner`,
                      maxFiles: 1,
                      acceptedFiles: 'image/svg+xml, image/png, image/jpeg, image/bmp',
                      }"
              @vdropzone-sending="(a, b) => assetSending(a, b, 'banner')"
              @vdropzone-success="(res, b) => assetAdded(res, b, $refs.bannerDropzone)"
              useCustomSlot
            >
              <div class="dropzone-custom-content">
                <img v-if="shop && shop.banner" :src="shop.banner" />
                <div v-else>Click here or drop file here to upload.</div>
              </div>
            </vue-dropzone>
          </div>
          <span
            class="text-red-700 text-xs pt-1 font-bold inline-block"
            v-if="errors.has('email')"
          >{{ errors.first('email') }}</span>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  layout: "user_dashboard",
  async mounted() {
    const config = await this.$store.dispatch(
      "shop/shopConfig",
      this.user.shop.slug
    );
    this.shop = config;
    this.isLoading = false;
  },
  data() {
    return {
      isLoading: true,
      apiUrl: process.env.apiUrl,
      isBannerLoading: false,
      isLogoLoading: false,
      shop: null,
      formData: {
        name: null,
        email: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      user: "user",
    }),
  },
  methods: {
    async updateShop() {
      let res = await this.$validator.validateAll();
      if (this.isLoading) return;
      if (!res) {
        this.$toast.error("Please fix the errors below.", { position: "top" });
        return;
      }
      this.isLoading = true;

      // TODO

      this.$toast.success("Profile updated successfully!", {
        position: "top",
      });
      this.isLoading = false;
    },
    assetAdded(res, b, ref) {
      this.$toast.success("Shop updated.", { position: "top" });
      ref.removeAllFiles();
      this.shop = b.data
    },
    assetSending(e, xhr, type) {
      switch (type) {
        case "logo":
          this.isLogoLoading = true;
          break;
        case "banner":
          this.isBannerLoading = false;
          break;
      }
      xhr.setRequestHeader("Authorization", this.$auth.getStrategy("local").token.get());
    },
  },
};
</script>