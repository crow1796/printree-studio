<template>
  <div class="relative">
    <AreaLoader v-if="isLoading" />
    <div class="py-4">
      <div class="my-2 flex sm:flex-row justify-between items-center">
        <h2 class="text-2xl font-semibold leading-tight">Account Settings</h2>
      </div>
      <form @submit.prevent="updateProfile" class="w-6/12 mx-auto">
        <div class="mb-3">
          <label for="displayName" class="font-bold">Full Name</label>
          <div>
            <input
              type="text"
              name="displayName"
              class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
              :class="{ 'border-red-400': errors.has('displayName'), 'focus:border-gray-600': !errors.has('displayName') }"
              placeholder="Your Name"
              v-model="formData.displayName"
            />
          </div>
          <span
            class="text-red-700 text-xs pt-1 font-bold inline-block"
            v-if="errors.has('displayName')"
          >{{ errors.first('displayName') }}</span>
        </div>
        <div class="mb-3">
          <label for="email" class="font-bold">Email Address</label>
          <div>
            <input
              type="text"
              name="email"
              class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
              :class="{ 'border-red-400': errors.has('email'), 'focus:border-gray-600': !errors.has('email') }"
              placeholder="Your Email Address"
              v-model="formData.email"
              data-vv-as="Email Address"
              v-validate="'required|email'"
            />
          </div>
          <span
            class="text-red-700 text-xs pt-1 font-bold inline-block"
            v-if="errors.has('email')"
          >{{ errors.first('email') }}</span>
        </div>
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
              v-validate="'min:6|confirmed:confirmPasswordRef'"
            />
          </div>
          <span
            class="text-red-700 text-xs pt-1 font-bold inline-block"
            v-if="errors.has('password')"
          >{{ errors.first('password') }}</span>
        </div>
        <div class="mb-3">
          <label for="password_confirmation" class="font-bold">Confirm Password</label>
          <div>
            <input
              type="password"
              name="password_confirmation"
              class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
              ref="confirmPasswordRef"
              :class="{ 'border-red-400': errors.has('password_confirmation'), 'focus:border-gray-600': !errors.has('password_confirmation') }"
              placeholder="Password Confirmation"
              v-model="formData.password_confirmation"
              data-vv-as="Password"
              v-validate="'confirmed:passwordRef'"
            />
          </div>
          <span
            class="text-red-700 text-xs pt-1 font-bold inline-block"
            v-if="errors.has('password_confirmation')"
          >{{ errors.first('password_confirmation') }}</span>
        </div>
        <div class="flex justify-end">
          <button
            class="items-center justify-center focus:outline-none outline-none flex border px-6 py-2 font-bold rounded text-white border-white bg-primary hover:bg-primary-lighter"
          >UPDATE</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  layout: 'user_dashboard',
  async mounted() {
    this.formData.displayName = this.user.displayName
    this.formData.email = this.user.email
    this.isLoading = false
  },
  data() {
    return {
      isLoading: true,
      formData: {
        displayName: null,
        email: null,
        password: null,
        password_confirmation: null
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/user'
    })
  },
  methods: {
    async updateProfile(){
      let res = await this.$validator.validateAll()
      if (!res || this.isLoading) return
      this.isLoading = true
      const response = await this.$store.dispatch('user/updateProfile', this.formData)
      let passwordResponse = null

      if(this.formData.password && this.formData.password === this.formData.password_confirmation){
        passwordResponse = await this.$store.dispatch('user/updatePassword', this.formData.password)
      }
      await this.$store.dispatch('user/refreshToken')
      if(!response.status || (passwordResponse && !passwordResponse.status)){
        this.isLoading = false
        this.$toast.error('Updating the profile failed! Please try again.', {
          position: 'bottom'
        })
        return
      }
      this.formData.password = null
      this.formData.password_confirmation = null
      this.$toast.success('Profile updated successfully!', {
        position: 'top'
      })
      this.isLoading = false
    }
  }
}
</script>