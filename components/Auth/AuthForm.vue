<template>
  <div class="flex flex-col items-center w-full p-4">
    <AreaLoader v-if="isLoading"/>
    <div class="top-text flex flex-col items-center">
      <h2 class="font-bold text-4xl text-primary-lighter">
        SIGN IN TO CONTINUE
      </h2>
      <div class="text-center">
        <div>
          Unlock more features.
        </div>
        <div>
          No contract. No commitment.
        </div>
      </div>
    </div>
    <div class="content w-full flex flex-grow py-8">
      <div class="social pr-8 mr-8 border-r w-1/2">
        <div class="text-lg font-bold text-gray-700">
          SIGN IN WITH
        </div>
        <div class="my-3">
          <button class="w-full items-center focus:outline-none outline-none flex flex-grow border px-3 py-2 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
            @click="socialLogin('google')">
            <font-awesome-icon :icon="['fab', 'google']"
              class="text-xs mr-2 text-red-700"/>
            <span>Sign In with Google</span>
          </button>
        </div>
        <div class="my-3">
          <button class="w-full items-center focus:outline-none outline-none flex flex-grow border px-3 py-2 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
            @click="socialLogin('facebook')">
            <font-awesome-icon :icon="['fab', 'facebook-f']"
              class="text-xs mr-2 text-blue-600"/>
            <span>Sign In with Facebook</span>
          </button>
        </div>
      </div>
      <div class="form w-1/2">
        <form @submit.prevent="submitForm">
          <div class="text-lg font-bold text-gray-700 mb-2">
            {{ formTitle }}
          </div>
          <div class="mb-3 mt-2" v-if="formType == 'sign_up'">
            <label for="name" class="font-bold">Name</label>
            <div>
              <input name="name"
                class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                type="text"
                :class="{ 'border-red-400': errors.has('name'), 'focus:border-gray-600': !errors.has('name') }"
                placeholder="Your Name"
                v-model="formData.name"
                data-vv-as="Name"
                v-validate="'required'"/>
            </div>
            <span class="text-red-700 text-xs pt-1 font-bold inline-block"
              v-if="errors.has('name')">
              {{ errors.first('name') }}
            </span>
          </div>
          <div class="mb-3">
            <label for="email" class="font-bold">Email</label>
            <div>
              <input name="email"
                class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                type="text"
                :class="{ 'border-red-400': errors.has('email'), 'focus:border-gray-600': !errors.has('email') }"
                placeholder="email@example.com"
                v-model="formData.email"
                data-vv-as="Email"
                v-validate="'required|email'"/>
            </div>
            <span class="text-red-700 text-xs pt-1 font-bold inline-block"
              v-if="errors.has('email')">
              {{ errors.first('email') }}
            </span>
          </div>
          <div class="mb-3" v-if="formType != 'password_recovery'">
            <label for="pass" class="font-bold">Password</label>
            <div>
              <input type="password"
                name="pass"
                class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                :class="{ 'border-red-400': errors.has('pass'), 'focus:border-gray-600': !errors.has('pass') }"
                placeholder="Password"
                v-model="formData.password"
                data-vv-as="Password"
                v-validate="'required|min:6'"/>
            </div>
            <span class="text-red-700 text-xs pt-1 font-bold inline-block"
              v-if="errors.has('pass')">
              {{ errors.first('pass') }}
            </span>
          </div>
          <div class="mb-3" v-if="formType != 'password_recovery'">
            <a href="#" class="text-blue-400 font-bold"
              @click.prevent="toggleForm('password_recovery')">
              Forgot Password?
            </a>
          </div>
          <div class="mb-3 bg-red-200 text-red-500 p-3 rounded text-center" v-if="isLoginFailed">
            Invalid Email or Password. Please try again.
          </div>
          <div class="mb-3">
            <button class="w-full items-center justify-center focus:outline-none outline-none flex flex-grow border px-3 py-2 font-bold rounded text-white border-white bg-primary hover:bg-primary-lighter">
              {{ formButtonText }}
            </button>
          </div>
          <div class="my-3 font-bold mx-1">
            {{ formType == 'sign_up' ? 'Already have an account?' : 'No Account?' }}
            <a href="#" class="text-blue-400"
              @click.prevent="toggleForm(formType == 'sign_up' && formType != 'password_recovery' ? 'sign_in' : 'sign_up')">
              {{ formType == 'sign_up' ? 'Sign In' : 'Create One' }}
            </a>
          </div>
        </form>
      </div>
    </div>
    <div class="bot-text flex">
      <div>
        By using <strong>Printree</strong> you also agree to our
        <a href="#" class="text-blue-400">Terms of Service</a> and <a href="#" class="text-blue-400">Privacy Policy</a>.
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      formType: 'sign_in',
      formData: {
        name: null,
        email: null,
        password: null
      },
      isLoading: false,
      isLoginFailed: false
    }
  },
  computed: {
    formTitle(){
      let title = 'SIGN IN WITH EMAIL'
      switch(this.formType){
        case 'password_recovery':
          title = 'FORGOT PASSWORD?'
          break
        case 'sign_up':
          title = 'SIGN UP'
          break
      }
      return title
    },
    formButtonText(){
      let title = 'SIGN IN'
      switch(this.formType){
        case 'password_recovery':
          title = 'RECOVER PASSWORD'
          break
        case 'sign_up':
          title = 'SIGN UP'
          break
      }
      return title
    }
  },
  methods: {
    toggleForm(type = null){
      this.$validator.reset()
      this.formType = type
      this.$nextTick(() => {
        this.formData = {
          name: null,
          email: null,
          password: null
        }
      })
    },
    async signInAsAGuest(){
      this.isLoading = true
      let response = await this.$store.dispatch('user/signInAsAGuest')
      this.isLoading = false
      if(response.status) this.$emit('login-success')
    },
    async submitForm(){
      this.isLoginFailed = false
      let validationResponse = await this.$validator.validateAll()
      if(!validationResponse) return
      this.isLoading = true
      let action = 'user/signIn'
      switch(this.formType){
        case 'password_recovery':
          action = 'user/sendPasswordRecovery'
          break
        case 'sign_up':
          action = 'user/createAccount'
          break
      }
      let res = await this.$store.dispatch(action, this.formData)
      this.isLoading = false
      if(!res.status && this.formType == 'sign_in'){
        this.isLoginFailed = true
        return
      }
      this.$emit('login-success')
    },
    async socialLogin(type){
      this.isLoading = true
      let res = await this.$store.dispatch('user/socialLogin', type)
      this.isLoading = false
      if(res.status) this.$emit('login-success')
    }
  }
}
</script>
