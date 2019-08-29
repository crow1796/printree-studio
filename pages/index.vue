<template>
  <div class="w-full">
    <VueTailwindModal ref="availableProductsModal"
      width="100%"
      content-class="rounded-none h-full shadow-none text-gray-600">
      <div class="flex flex-col h-full">
        <div class="modal-heading border-b w-full p-4">
          <div class="flex justify-between w-full items-center">
            <div class="flex uppercase">
              <strong>Select Products</strong>
            </div>
            <div class="flex text-right">
              <div class="select-none cursor-pointer w-8 h-8 border rounded-full flex justify-center items-center hover:border-gray-600 hover:text-gray-700"
                  @click="$refs.availableProductsModal.hide()">
                <font-awesome-icon :icon="['fas', 'times']"
                  class="text-xs"/>
              </div>
            </div>
          </div>
        </div>
        <div class="flex modal-body flex-grow h-full">
          <AvailableProducts @selected="storeTmpProducts"/>
        </div>
        <div class="flex modal-footer justify-between flex-shrink p-4 border-t items-center">
          <a href="#" class="text-blue-400 cursor-help border-dashed border-b hover:border-blue-400">
            {{ tmpSelectedProducts.length || 'No' }} Products Selected
          </a>
          <button type="button"
            class="shadow-xl border border-white bg-primary px-8 py-2 font-bold rounded text-white hover:bg-primary-lighter"
            @click="createNewDesign">
            CONTINUE
          </button>
        </div>
      </div>
    </VueTailwindModal>
    <AuthModal ref="authModal"
      @login-success="createNewDesign"/>
    <AreaLoader v-if="isLoading" fullscreen/>
    <div class="hero flex relative w-full">
      <div id="screen" class="z-10 overflow-hidden "></div>
      <div class="flex z-20 relative mt-32 w-3/5 pl-32 flex-col">
        <h1 class="w-8/12 mt-10">
          <div class="text-6xl font-bold leading-none">
            CREATE
          </div>
          <div class="text-2xl ml-2">
            your own designs for any product &amp; earn
          </div>
        </h1>
        <div class="flex mt-5">
          <button type="button"
            class="shadow-xl border border-white bg-primary px-8 py-4 font-bold rounded text-white hover:bg-primary-lighter"
            @click="showAvailableProducts">
            START DESIGNING
          </button>
        </div>
      </div>
      <div class="flex">
        <img src="/forming_ideas.png">
      </div>
    </div>

    <div class="how-it-works">
      <div class="text-center text-4xl font-bold my-6">
        HOW IT WORKS?
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
  data(){
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
  mounted(){
    let minBoxSize = 63
    let maxBoxSize = 150
    let boxCount = 0
    let screenEl = document.getElementById('screen')
    let maxBoundsX = document.body.offsetWidth
    let maxBoundsY = document.body.offsetHeight
    while(boxCount < 20){
        let size = Math.floor(Math.random() * (+maxBoxSize - +minBoxSize)) + +minBoxSize
        let rotation = Math.floor(Math.random() * (180 - -180)) + -180
        let left = (Math.floor(Math.random() * (maxBoundsX - 0)) + 0) - (size / 2)
        let top = (Math.floor(Math.random() * (maxBoundsY - 0)) + 0) - (size / 2)
        let animationDelay = (Math.floor(Math.random() * (3 - 0)) + 0)
        let boxContainer = document.createElement('div')
        let box = document.createElement('div')
        box.style.width = boxContainer.style.width = `${size}px`
        box.style.height = boxContainer.style.height = `${size}px`
        boxContainer.style.left = `${left}px`
        boxContainer.style.top = `${top}px`
        box.style.animationDelay = `${animationDelay}s`
        boxContainer.style.transform = `rotate(${rotation}deg)`
        boxContainer.classList.add('bgbox-container')
        box.classList.add('bgbox')
        boxContainer.appendChild(box)
        screenEl.appendChild(boxContainer)
        boxCount++
    }
  },
  methods: {
    async showAvailableProducts(){
      if(this.$storage.getLocalStorage('current_design_id')){
        this.isLoading = true
        const design = await this.$store.dispatch('designer/fetchDesignData', this.$storage.getLocalStorage('current_design_id'))
        if(design.user_id == (this.user && this.user.uid)) return this.$router.push('/products/designer')
      }
      this.isLoading = false
      this.$refs.availableProductsModal.show()
    },
    storeTmpProducts(products){
      this.tmpSelectedProducts = products
    },
    async createNewDesign(){
      if(!this.tmpSelectedProducts.length) return
      if(!this.isLoggedIn){
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
      this.$storage.setLocalStorage('current_design_id', design.id)
      this.$router.push('/products/designer')
    }
  }
}
</script>

<style lang="scss">
#screen{
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  top: 0;

  .bgbox-container{
      position: absolute;
      width: 160px;
      height: 160px;
      z-index: 1;
  }

  .bgbox-container .bgbox{
      background-color: rgba(225, 39, 78, .1);
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
