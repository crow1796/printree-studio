<template>
  <div class="flex flex-grow min-h-screen justify-center items-center">
    <form @submit.prevent="login" action="#" class="shadow-xl border flex flex-col items-center p-4">
      <img src="~/assets/images/logo-nav.png" alt="Printree" class="w-12 mb-4" />
      <div class="flex">
        <input type="text" class="w-full border rounded pl-4 h-12 outine-none resize-none rounded-r-none outline-none focus:outline-none focus:border-primary" placeholder="Enter Secret Key" autocomplete="off" v-model="secret">
      <button class="border border-primary border-l-0 rounded px-6 py-2 h-12 bg-primary text-white hover:bg-primary-darker rounded-l-none">
        <font-awesome-icon :icon="['fas', 'arrow-right']"/>
      </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  layout: 'empty',
  head: {
    title: 'Admin Login'
  },
  data(){
    return {
      secret: null
    }
  },
  methods: {
    login(){
      this.$store.dispatch('admin/signIn', this.secret)
    }
  }
}
</script>