<template>
  <div class="relative py-48">
    <AreaLoader v-if="isLoading" />
    <div class="py-4 w-6/12 mx-auto">
      <div class="my-2 flex sm:flex-row justify-between items-center">
        <h2 class="text-2xl font-semibold leading-tight">Change Password</h2>
      </div>
      <form @submit.prevent="updatePassword">
        <div class="mb-3">
          <label for="password" class="font-bold">New Password</label>
          <div>
            <input
              type="password"
              name="password"
              class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
              ref="passwordRef"
              :class="{ 'border-red-400': errors.has('password'), 'focus:border-gray-600': !errors.has('password') }"
              placeholder="Your Password"
              v-model="formData.password"
              data-vv-as="Password"
              v-validate="'required|min:6|confirmed:confirmPasswordRef'"
            />
          </div>
          <span
            class="text-red-700 text-xs pt-1 font-bold inline-block"
            v-if="errors.has('password')"
          >{{ errors.first('password') }}</span>
        </div>
        <div class="mb-3">
          <label for="passwordConfirmation" class="font-bold">Confirm Password</label>
          <div>
            <input
              type="password"
              name="passwordConfirmation"
              class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
              ref="confirmPasswordRef"
              :class="{ 'border-red-400': errors.has('passwordConfirmation'), 'focus:border-gray-600': !errors.has('passwordConfirmation') }"
              placeholder="Password Confirmation"
              v-model="formData.passwordConfirmation"
              data-vv-as="Password"
              v-validate="'confirmed:passwordRef'"
            />
          </div>
          <span
            class="text-red-700 text-xs pt-1 font-bold inline-block"
            v-if="errors.has('passwordConfirmation')"
          >{{ errors.first('passwordConfirmation') }}</span>
        </div>
        <div class="flex justify-end">
          <button
            class="items-center justify-center focus:outline-none outline-none flex border px-6 py-2 font-bold rounded text-white border-white bg-primary hover:bg-primary-lighter"
          >CHANGE PASSWORD</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      isLoading: false,
      formData: {
        password: null,
        passwordConfirmation: null,
        token: this.$route.params.token
      }
    }
  },
  methods: {
    async updatePassword(){
      let res = await this.$validator.validateAll()
      if (this.isLoading) return
      if(!res){
        this.$toast.error('Please fix the errors below.', { position: 'top'})
        return
      }
      this.isLoading = true

      res = await this.$store.dispatch('user/updatePassword', this.formData);
      if (!res.status) {
        this.$toast.error(res.message, {
          position: "top",
        });
        this.isLoading = false
        return;
      }

      this.$toast.success('Password changed successfully! You can now log in.', { position: 'top'})

      this.$router.replace('/')
    }
  }
};
</script>