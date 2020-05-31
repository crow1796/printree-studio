<template>
  <div class="w-full">
    <AreaLoader v-if="isLoading" fullscreen/>
    <VueTailwindModal
      ref="availableProductsModal"
      width="100%"
      content-class="rounded-none h-full shadow-none text-gray-600"
    >
      <div class="flex flex-col flex-grow">
        <div class="modal-heading border-b flex-grow p-4">
          <div class="flex justify-between flex-grow items-center">
            <div class="flex uppercase">
              <strong>Select Products</strong>
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
    <AuthModal ref="authModal" @login-success="createNewDesign" />
    <div class="hero flex relative w-full">
      <div class="flex z-20 relative sm:mt-32 mt-8 sm:w-3/5 w-full sm:pl-32 flex-col flex-grow sm:flex-grow-0">
        <div class="sm:w-8/12 text-center sm:text-left">
          <div class="text-6xl font-black leading-none tracking-widest">CREATE</div>
          <div class="text-2xl ml-2">your own designs for any product &amp; earn</div>
        </div>
        <div class="flex sm:mt-5 mt-2 sm:justify-start justify-center">
          <button
            type="button"
            class="shadow-xl border border-white bg-primary px-10 py-4 text-sm rounded-full font-bold rounded text-white hover:bg-primary-lighter"
            @click="() => !isLoading ? showAvailableProducts() : false"
          >
            <span>START DESIGNING</span>
            <span class="ml-2">
              <font-awesome-icon :icon="['fas', 'arrow-right']"/>
            </span>
          </button>
        </div>
      </div>
      <div class="flex sm:flex hidden">
        <img src="/forming_ideas.png" />
      </div>
    </div>

    <div class="how-it-works mb-12">
      <div class="text-center text-4xl font-black tracking-widest my-6">HOW DOES <span class="text-primary">PRINTREE</span> WORKS?</div>
      <div class="flex sm:flex-row flex-col justify-center items-center">
        <div class="p-6 shadow-xl rounded mx-4 w-3/12">
          <div class="vis text-center">
            <img src="/forming_ideas.png" class="sm:w-48 w-64 mx-auto my-2 sm:my-0"/>
          </div>
          <div class="text-center font-bold text-xl">
            Join us
          </div>
          <div class="text-center text-gray-600">
            You can create an account if you don't have one or login.
          </div>
        </div>
        <div class="p-6 shadow-xl rounded mx-4 w-3/12">
          <div class="vis text-center">
            <img src="/forming_ideas.png" class="sm:w-48 w-64 mx-auto my-2 sm:my-0"/>
          </div>
          <div class="text-center font-bold text-xl">
            Create Products
          </div>
          <div class="text-center text-gray-600">
            You choose from variety of products and add your designs on them.
          </div>
        </div>
        <div class="p-6 shadow-xl rounded mx-4 w-3/12">
          <div class="vis text-center">
            <img src="/forming_ideas.png" class="sm:w-48 w-64 mx-auto my-2 sm:my-0"/>
          </div>
          <div class="text-center font-bold text-xl">
            Sell
          </div>
          <div class="text-center text-gray-600">
            Share it to the world and start earning.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueTailwindModal from '@/components/VueTailwindModal'
import AvailableProducts from '@/components/Designer/AvailableProducts'
import AuthModal from '@/components/Auth/AuthModal'
import { mapGetters } from 'vuex'

export default {
  components: {
    VueTailwindModal,
    AvailableProducts,
    AuthModal
  },
  middleware: 'authenticated',
  data() {
    return {
      isLoading: false,
      tmpSelectedProducts: []
    }
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'user/isLoggedIn',
      user: 'user/user',
      designMeta: 'designer/designMeta'
    })
  },
  async mounted() {
    if (this.$storage.getLocalStorage('current_design_id')) {
      this.isLoading = true
      const design = await this.$store.dispatch(
        'designer/fetchDesignDataAndCommit',
        this.$storage.getLocalStorage('current_design_id')
      )
      this.isLoading = false
    }
  },
  methods: {
    async showAvailableProducts() {
      if (this.$storage.getLocalStorage('current_design_id')) {
        this.isLoading = true
        const design = await this.$store.dispatch(
          'designer/fetchDesignDataAndCommit',
          this.$storage.getLocalStorage('current_design_id')
        )
        if (design.user_id == (this.user && this.user.uid))
          return this.$router.push('/collection/designer')
      }
      this.isLoading = false
      this.$refs.availableProductsModal.show()
    },
    async createNewDesign() {
      if (!this.tmpSelectedProducts.length) return
      if (!this.isLoggedIn) {
        this.$refs.authModal.show()
        return
      }
      this.$refs.authModal.hide()
      this.isLoading = true
      let design = await this.$store.dispatch('designer/createNewDesign', {
        user: this.user,
        products: this.tmpSelectedProducts
      })
      this.tmpSelectedProducts = []
      this.$storage.setLocalStorage('current_design_id', design._id)
      this.$router.push('/collection/designer')
    }
  }
}
</script>

<style lang="scss">
#screen {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  top: 0;

  .bgbox-container {
    position: absolute;
    width: 160px;
    height: 160px;
    z-index: 1;
  }

  .bgbox-container .bgbox {
    background-color: rgba(225, 39, 78, 0.1);
    border-radius: 5px;
    position: absolute;
    animation: float 5s ease infinite;
  }

  @keyframes float {
    0% {
      transform: translatey(0px);
    }
    50% {
      transform: translatey(-20px);
    }
    100% {
      transform: translatey(0px);
    }
  }
}
</style>
