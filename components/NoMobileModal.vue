<template>
  <VueTailwindModal
    ref="authFormModal"
    width="100%"
    height="100%"
    content-class="text-gray-600 overflow-hidden relative rounded-none h-full shadow-none text-gray-600"
    :backdrop="false"
  >
    <div class="flex flex-col relative px-4 pb-4 justify-between h-full">
      <div class="text-center">
        <img class="mx-auto mt-6 w-5/12" src="~/assets/images/logo-nav.png" />
      </div>
      <div class="text-center">
        <img src="~/assets/images/broken.png" />
        <div class="text-center mt-4">
          We're really sorry to let you know that
          <strong>Printree Studio</strong> is not working on mobile devices yet.
        </div>
      </div>

      <div>
        <button
          type="button"
          class="shadow-xl bg-primary px-8 py-4 font-bold rounded text-white hover:bg-primary-lighter w-full"
          @click="hide"
        >Close</button>
      </div>
    </div>
  </VueTailwindModal>
</template>

<script>
import VueTailwindModal from "@/components/VueTailwindModal";

export default {
  components: {
    VueTailwindModal,
  },
  methods: {
    show() {
      this.$refs.authFormModal.show();
    },
    hide() {
      this.$refs.authFormModal.hide();
    },
  },
};
</script>
