<template>
  <div class="flex flex-grow min-h-screen justify-center mt-32">
    <AreaLoader v-if="isLoading" fullscreen/>
    <form @submit.prevent="signIn" class="w-3/12">
      <div class="shadow-xl rounded-lg flex flex-col p-6">
        <div>
          <img src="~/assets/images/logo.png" class="w-16 mx-auto mb-3" />
        </div>
        <div class="text-3xl font-bold text-center">Admin Login</div>
        <div class="mb-3 mt-3">
          <label for="email" class="font-bold">Email</label>
          <div>
            <input
              name="email"
              class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
              autocomplete="off"
              type="text"
              :class="{ 'border-red-400': errors.has('email'), 'focus:border-gray-600': !errors.has('email') }"
              placeholder="email@example.com"
              v-model="formData.email"
              data-vv-as="Email"
              v-validate="'required|email'"
            />
          </div>
          <span
            class="text-red-700 text-xs pt-1 font-bold inline-block"
            v-if="errors.has('email')"
          >{{ errors.first('email') }}</span>
        </div>
        <div class="mb-3">
          <label for="pass" class="font-bold">Password</label>
          <div>
            <input
              type="password"
              name="pass"
              class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
              :class="{ 'border-red-400': errors.has('pass'), 'focus:border-gray-600': !errors.has('pass') }"
              placeholder="Password"
              v-model="formData.password"
              data-vv-as="Password"
              v-validate="'required|min:6'"
            />
          </div>
          <span
            class="text-red-700 text-xs pt-1 font-bold inline-block"
            v-if="errors.has('pass')"
          >{{ errors.first('pass') }}</span>
        </div>
        <div
          class="mb-3 bg-red-200 text-red-500 p-3 rounded text-center"
          v-if="isLoginFailed"
        >Invalid Email or Password. Please try again.</div>
        <div class="mb-3">
          <button
            class="w-full items-center justify-center focus:outline-none outline-none flex flex-grow border px-3 py-2 font-bold rounded text-white border-white bg-primary hover:bg-primary-lighter"
          >SIGN IN</button>
        </div>
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
  middleware: 'admin-auth',
  data() {
    return {
      isLoginFailed: false,
      formData: {
        email: null,
        password: null
      },
      isLoading: false
    }
  },
  methods: {
    async signIn() {
      this.isLoading = true
      const res = await this.$store.dispatch('user/signIn', this.formData)
      this.isLoading = false
      if (!res.data.status) {
        this.isLoginFailed = true
        return
      }
      this.$router.push('/admin/collections')
    }
  }
}
</script>