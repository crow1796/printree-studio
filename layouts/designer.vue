<template>
  <client-only>
    <div class="flex-grow flex flex-col text-sm">
      <AreaLoader v-if="isLoading" fullscreen />
      <AuthModal ref="authModal" />
      <div class="w-full p-4 flex border-b">
        <div class="flex w-1/3">
          <img src="~/assets/images/logo.png" alt="Printree" class="w-24" />
        </div>
        <div class="flex w-1/3 justify-center items-center">
          <div class="flex" v-if="!isEditingDesignName" style="animation-duration: 0.2s">
            <span class="text-primary uppercase font-bold">Designer</span>
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
          <nuxt-link to="/dashboard" class="text-blue-400">Go to Dashboard</nuxt-link>
          <div class="w-4"></div>
          <PTButton color="primary" @click="nextStep">NEXT</PTButton>
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
import VueTailwindModal from '@/components/VueTailwindModal'
import ProductsPreviewDrawer from '@/components/ProductsPreviewDrawer'
import AuthModal from '@/components/Auth/AuthModal'
import { mapGetters } from 'vuex'

export default {
  head: {
    title: 'Printree Studio',
    bodyAttrs: {
      class: 'no-scroll'
    }
  },
  components: {
    VueTailwindModal,
    AuthModal,
    ProductsPreviewDrawer
  },
  middleware: 'authenticated',
  computed: {
    ...mapGetters({
      isLoggedIn: 'user/isLoggedIn',
      designMeta: 'designer/designMeta',
      user: 'user/user',
      currentDesignName: 'designer/currentDesignName',
      currentDesignId: 'designer/currentDesignId'
    })
  },
  async created() {
    if(process.client){
      if(this.$route.query.id){
        this.$storage.setLocalStorage('current_design_id', this.$route.query.id)
      }
      this.$store.commit(
        'designer/CURRENT_DESIGN_ID',
        this.$storage.getLocalStorage('current_design_id')
      )
      await this.$store.dispatch(
        'designer/fetchDesignDataAndCommit',
        this.currentDesignId
      )
      await this.$store.dispatch(
        'designer/fetchArts'
      )
      this.isLoading = false
    }
  },
  mounted() {
    window.onbeforeunload = (e) => {
      e = e || window.event
      // For IE and Firefox prior to version 4
      if (e) {
        e.returnValue = 'Sure?'
      }
      // For Safari
      return 'Sure?'
    }
  },
  destroyed(){
    window.onbeforeunload = null
  },
  data() {
    return {
      isLoading: true,
      isEditingDesignName: false,
      generatedImages: []
    }
  },
  methods: {
    startEditingName() {
      this.isEditingDesignName = true
      this.$nextTick(() => {
        this.$refs.designNameField.focus()
        this.$refs.designNameField.setSelectionRange(
          0,
          this.$refs.designNameField.value.length
        )
      })
    },
    updateDesignName(newName) {
      if (!newName.trim()) return
      this.$store.dispatch('designer/updateDesignName', newName)
      this.isEditingDesignName = false
    },
    async nextStep() {
      if (!this.isLoggedIn) return this.$refs.authModal.show()
      this.isLoading = true
      const generatedImages = await this.$store.dispatch('designer/saveData')
      this.isLoading = false
      this.generatedImages = generatedImages
      this.$refs.productsPreviewDrawer.show()
    }
  }
}
</script>
