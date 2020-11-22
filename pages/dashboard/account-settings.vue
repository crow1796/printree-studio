<template>
  <div class="relative">
    <AreaLoader v-if="isLoading" />
    <div class="py-4">
      <div class="my-2 flex sm:flex-row justify-between items-center">
        <h2 class="text-2xl font-semibold leading-tight">Account Settings</h2>
      </div>
      <form @submit.prevent="updateAccount" class="w-6/12 mx-auto">
        <div class="mb-3">
          <label for="name" class="font-bold">Full Name</label>
          <div>
            <input
              type="text"
              name="name"
              class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
              :class="{ 'border-red-400': errors.has('name'), 'focus:border-gray-600': !errors.has('name') }"
              placeholder="Your Name"
              v-model="formData.name"
            />
          </div>
          <span
            class="text-red-700 text-xs pt-1 font-bold inline-block"
            v-if="errors.has('name')"
          >{{ errors.first('name') }}</span>
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
    this.formData.name = this.user.name
    this.formData.email = this.user.email
    this.isLoading = false
  },
  data() {
    return {
      isLoading: true,
      formData: {
        name: null,
        email: null,
        password: null,
        passwordConfirmation: null
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'user'
    })
  },
  methods: {
    async updateAccount(){
      let res = await this.$validator.validateAll()
      if (this.isLoading) return
      if(!res){
        this.$toast.error('Please fix the errors below.', { position: 'top'})
        return
      }
      this.isLoading = true
      const response = await this.$store.dispatch('user/updateAccount', this.formData)
      let passwordResponse = null

      if(!response){
        this.isLoading = false
        this.$toast.error('Updating the profile failed! Please try again.', {
          position: 'bottom'
        })
        return
      }
      this.formData.password = null
      this.formData.passwordConfirmation = null
      this.$toast.success('Profile updated successfully!', {
        position: 'top'
      })
      this.isLoading = false
    }
  }
}
</script>