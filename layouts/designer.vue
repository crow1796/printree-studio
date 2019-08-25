<template>
  <no-ssr>
    <div class="w-full h-full flex flex-col text-sm">
      <AuthModal ref="authModal"/>
      <VueTailwindModal ref="productsQuantitiesModal"
        width="50%">
        <div class="flex buy-sell-content overflow-hidden" style="height: 30rem">
          <div class="buy w-1/2 h-full rounded border mr-2 cursor-pointer hover:border-gray-500 flex justify-center items-center">

          </div>
          <div class="sell w-1/2 h-full rounded border ml-2 cursor-pointer hover:border-gray-500 flex justify-center items-center">

          </div>
        </div>
      </VueTailwindModal>
      <div class="w-full p-4 flex border-b">
        <div class="flex w-1/3">
          <img src="~/assets/images/logo-nav.png"
            alt="Printree"
            class="w-10">
        </div>
        <div class="flex w-1/3 justify-center items-center font-bold">
          <span class="text-gray-600 uppercase">
            Studio /
          </span>
          &nbsp;
          <span class="parent text-gray-600 cursor-pointer hover:underline hover:text-gray-700">
            {{ currentDesignName }}
            <span class="text-xs ml-1 parent:hover:visible invisible">
              <font-awesome-icon :icon="['fas', 'edit']"/>
            </span>
          </span>
        </div>
        <div class="flex w-1/3 items-center justify-end">
          <a href="#" class="text-blue-400">
            Continue Later
          </a>
          <div class="w-4"></div>
          <button type="button"
            class="shadow-xl border border-white bg-primary px-8 py-2 font-bold rounded text-white hover:bg-primary-lighter outline-none focus:outline-none"
            @click="nextStep">
            NEXT
          </button>
        </div>
      </div>
      <nuxt/>
    </div>
  </no-ssr>
</template>


<script>
import VueTailwindModal from '@/components/VueTailwindModal'
import AuthModal from '@/components/Auth/AuthModal'
import { mapGetters } from 'vuex'

export default {
  head: {
    title: 'Printree Studio'
  },
  components: {
    VueTailwindModal,
    AuthModal
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'user/isLoggedIn',
      user: 'user/user',
      currentDesignName: 'designer/currentDesignName'
    })
  },
  methods: {
    nextStep(){
      if(!this.isLoggedIn) return this.$refs.authModal.show()
    }
  }
}
</script>


<style lang="scss" scoped>
.buy-sell-content{
}
</style>
