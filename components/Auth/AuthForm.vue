<template>
  <div class="flex flex-col items-center w-full p-4">
    <AreaLoader v-if="isLoading" />
    <div class="top-text flex flex-col items-center">
      <h2 class="font-black text-4xl text-primary-lighter mb-4">SIGN IN TO CONTINUE</h2>
    </div>
    <div class="content w-full flex flex-grow">
      <div class="form w-full">
        <form @submit.prevent="submitForm">
          <div class="text-lg font-black text-gray-700 mb-4">{{ formTitle }}</div>
          <div class="mb-3" v-if="formType == 'sign_up'">
            <label for="shop_name" class="font-bold">Shop Name</label>
            <div class="mt-2">
              <input
                name="shop_name"
                class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                type="text"
                :class="{ 'border-red-400': errors.has('shop_name'), 'focus:border-gray-600': !errors.has('shop_name') }"
                placeholder="Name of your shop"
                v-model="formData.shopName"
                data-vv-as="Shop Name"
                v-validate="'required'"
              />
            </div>
            <span
              class="text-red-700 text-xs pt-1 font-bold inline-block"
              v-if="errors.has('shop_name')"
            >{{ errors.first('shop_name') }}</span>
          </div>
          <div class="mb-3" v-if="formType == 'sign_up'">
            <label for="name" class="font-bold">Name</label>
            <div class="mt-2">
              <input
                name="name"
                class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                type="text"
                :class="{ 'border-red-400': errors.has('name'), 'focus:border-gray-600': !errors.has('name') }"
                placeholder="Your name"
                v-model="formData.name"
                data-vv-as="Name"
                v-validate="'required'"
              />
            </div>
            <span
              class="text-red-700 text-xs pt-1 font-bold inline-block"
              v-if="errors.has('name')"
            >{{ errors.first('name') }}</span>
          </div>
          <div class="mb-3">
            <label for="email" class="font-bold">Email</label>
            <div class="mt-2">
              <input
                name="email"
                class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
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
          <div class="mb-3" v-if="formType != 'password_recovery'">
            <label for="pass" class="font-bold">Password</label>
            <div class="mt-2">
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
          <div class="mb-3" v-if="formType === 'sign_up'">
            <div class="flex items-center">
              <label class="custom-checkbox block relative cursor-pointer text-xl pl-8 w-6 h-6">
                <input
                  class="absolute opacity-0 left-0 top-0 cursor-pointer"
                  type="checkbox"
                  name="terms"
                  v-model="terms"
                  v-validate="'required'"
                />
                <span class="h-6 w-6 checkmark absolute top-0 left-0 bg-gray-400"></span>
              </label>
              <div class="text-sm">
                I agree to the
                <strong>Printree Studio</strong>
                <a href="#" class="text-blue-400">Terms of Service</a> and
                <a href="#" class="text-blue-400">Privacy Policy</a>.
                <div>
                  <span
                    class="text-red-700 text-xs pt-1 font-bold inline-block"
                    v-if="errors.has('terms')"
                  >You must accept the terms and conditions to proceed.</span>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-3" v-if="formType != 'password_recovery'">
            <a
              href="#"
              class="text-blue-400 font-bold"
              @click.prevent="toggleForm('password_recovery')"
            >Forgot Password?</a>
          </div>
          <div
            class="mb-3 bg-red-200 text-red-500 p-3 rounded text-center"
            v-if="isSubmissionFailed"
          >{{ formMessage }}</div>
          <div class="mb-3">
            <button
              class="w-full items-center justify-center focus:outline-none outline-none flex flex-grow border px-3 py-2 font-bold rounded text-white border-white bg-primary hover:bg-primary-lighter"
            >{{ formButtonText }}</button>
          </div>
          <div class="mt-3 mb-2 font-bold mx-1">
            {{ formType == 'sign_up' ? 'Already have an account?' : "Don't have an account?" }}
            <a
              href="#"
              class="text-blue-400"
              @click.prevent="toggleForm(formType == 'sign_up' && formType != 'password_recovery' ? 'sign_in' : 'sign_up')"
            >{{ formType == 'sign_up' ? 'Sign In' : 'Sign Up' }}</a>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formType: "sign_in",
      formData: {
        name: null,
        email: null,
        password: null,
        shopName: null,
      },
      terms: false,
      isLoading: false,
      isSubmissionFailed: false,
      formMessage: null,
    };
  },
  computed: {
    formTitle() {
      let title = "SIGN IN WITH EMAIL";
      switch (this.formType) {
        case "password_recovery":
          title = "FORGOT PASSWORD?";
          break;
        case "sign_up":
          title = "CREATE AN ACCOUNT";
          break;
      }
      return title;
    },
    formButtonText() {
      let title = "SIGN IN";
      switch (this.formType) {
        case "password_recovery":
          title = "RESET PASSWORD";
          break;
        case "sign_up":
          title = "SIGN UP";
          break;
      }
      return title;
    },
  },
  methods: {
    toggleForm(type = null) {
      this.$validator.reset();
      this.formType = type;
      this.isSubmissionFailed = false;
      this.$nextTick(() => {
        this.formData = {
          name: null,
          email: null,
          password: null,
        };
      });
    },
    async signInAsAGuest() {
      this.isLoading = true;
      let response = await this.$store.dispatch("user/signInAsAGuest");
      this.isLoading = false;
      if (response.status) this.$emit("login-success");
    },
    async submitForm() {
      this.isSubmissionFailed = false;
      let validationResponse = await this.$validator.validateAll();
      if (!validationResponse) return;
      this.isLoading = true;
      let action = "user/signIn";
      switch (this.formType) {
        case "password_recovery":
          action = "user/sendPasswordRecovery";
          break;
        case "sign_up":
          action = "user/createAccount";
          break;
      }
      try {
        let res = await this.$store.dispatch(action, this.formData);

        if (this.formType === "password_recovery") {
          if (!res.status) {
            this.$toast.error(res.message, {
              position: "bottom",
            });
            return;
          }
          this.$toast.success(
            "A reset password email has been sent to your email.",
            {
              position: "bottom",
            }
          );
          this.formData = {
            name: null,
            email: null,
            password: null,
          };
          this.formType = "sign_in";
          this.$validator.reset();
          return;
        }
        this.$emit("login-success");
      } catch (e) {
        this.isSubmissionFailed = true;
        this.formMessage = e.message;
        if (this.formType == "sign_in") {
          this.formMessage = "Invalid Email or Password. Please try again.";
        }
      }
      this.isLoading = false;
    },
  },
};
</script>
