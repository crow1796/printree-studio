<template>
  <div class="flex flex-col items-center w-full sm:pl-4 sm:pb-4 pt-8">
    <AreaLoader v-if="isLoading" />
    <div class="content w-full flex flex-grow">
      <div class="text-center mt-8 mb-6" v-if="isSignUpSuccess">
        <div class="mb-4">
          <img src="~/assets/images/welcome.svg" alt="Welcome" class="sm:w-3/5 mx-auto" />
        </div>
        <div class="font-bold">Thank you for signing up!</div>
        <div class="mt-2">
          We will now review your account.
          <!-- It usually takes 1-3 working days for your account to be approved.  -->
          You will receive an email once your account is approved.
        </div>
      </div>
      <div class="form w-full" v-if="!isSignUpSuccess">
        <form @submit.prevent="submitForm">
          <div class="text-3xl text-primary font-black text-gray-700 mb-4">{{ formTitle }}</div>
          <!-- TODO: Uncomment if ready <div v-if="formType === 'sign_up' && !isSingle">
            <label class="font-bold mb-2 block">I want to...</label>
            <div class="flex mb-4 text-sm">
              <button
                type="button"
                class="rounded border flex items-center p-3 flex-col w-6/12 cursor-pointer hover:border-gray-600 mr-4 uppercase font-bold flex-grow"
                v-for="(type, i) in userTypes"
                :key="i"
                :class="{'bg-primary text-white': formData.type === type}"
                @click="changeUserType(type)"
              >{{userType(type)}} PRODUCTS</button>
            </div>
          </div> -->

          <div class="flex flex-wrap">
            <div
              class="mb-3 flex-grow sm:mr-3 mr-0"
              v-if="formType == 'sign_up' && formData.type === 'seller'"
              key="shop_name"
            >
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
            <div class="mb-3 flex-grow sm:mr-3 mr-0" v-if="formType == 'sign_up'" key="name">
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
            <div class="mb-3 w-full mr-0 sm:mr-3" key="email">
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
            <div class="mb-3 w-full mr-0 sm:mr-3" v-if="formType != 'password_recovery'" key="password">
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
            <div class="mb-3 flex-grow sm:mr-3 mr-0" v-if="formType === 'sign_up'" key="terms">
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
                  <nuxt-link to="/terms-and-conditions" class="text-blue-400">Terms of Service</nuxt-link> and
                  <nuxt-link to="/privacy-policy"  class="text-blue-400">Privacy Policy</nuxt-link>.
                  <div>
                    <span
                      class="text-red-700 text-xs pt-1 font-bold inline-block"
                      v-if="errors.has('terms')"
                    >You must accept the terms and conditions to proceed.</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="mb-3 flex-grow sm:mr-3 mr-0" v-if="formType != 'password_recovery'">
              <a
                href="#"
                class="text-blue-400 font-bold"
                @click.prevent="toggleForm('password_recovery')"
              >Forgot Password?</a>
            </div>
          </div>
          <div
            class="mb-3 bg-red-200 text-red-500 p-3 rounded text-center"
            v-if="isSubmissionFailed"
          >{{ formMessage }}</div>
          <div class="mb-3">
            <button
              type="submit"
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
import confetti from "canvas-confetti";

export default {
  created() {
    const inviteCode =
      this.$route.query.invite || this.$storage.getCookie("invite");
    if (process.client) {
      if (inviteCode) {
        this.$storage.setCookie("invite", inviteCode);
        this.formData.inviteCode = inviteCode;
      }
    }
  },
  props: {
    type: {
      type: String,
      default: "seller",
    },
    form: {
      type: String,
      default: "sign_in",
    },
  },
  data() {
    return {
      formType: this.form,
      isSingle: this.$flags.flagIs("single", "on"),
      formData: {
        name: null,
        email: null,
        password: null,
        shopName: null,
        type: this.type,
        inviteCode: this.$storage.getCookie("invite") || null,
      },
      terms: false,
      isLoading: false,
      isSubmissionFailed: false,
      formMessage: null,
      isSignUpSuccess: false,
      userTypes: ["seller", "buyer"],
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
    userType(type) {
      let finalType = "sell";
      if (type === "buyer") finalType = "BUY";
      return finalType;
    },
    changeUserType(type) {
      this.formData.type = type;
    },
    toggleForm(type = null) {
      this.$validator.reset();
      this.formType = type;
      this.isSubmissionFailed = false;
      this.$nextTick(() => {
        this.formData = {
          name: null,
          email: null,
          password: null,
          type: this.formData.type || "seller",
          inviteCode: this.formData.inviteCode,
        };
      });
    },
    async signInAsAGuest() {
      this.isLoading = true;
      let response = await this.$store.dispatch("user/signInAsAGuest");
      this.isLoading = false;
      if (response.status) this.$emit("login-success");
    },
    async signIn() {
      await this.$store.dispatch("user/signIn", this.formData);

      this.$emit("login-success");
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
        let tmpFormData = { ...this.formData };

        if (this.formType === "password_recovery") {
          if (!res.status) {
            this.$toast.error(res.message, {
              position: "bottom",
            });
            return;
          }
          this.$toast.success(
            "Please check your email to change your password.",
            {
              position: "bottom",
            }
          );
          this.formData = {
            name: null,
            email: null,
            password: null,
            type: "seller",
            inviteCode: null,
          };
          this.formType = "sign_in";
          this.$validator.reset();
          this.$emit("reset-success");
          return;
        }
        if (this.formType !== "sign_up") this.$emit("login-success");
        else {
          if (tmpFormData.type === "seller") {
            if (res?.user?.status === 'approved') {
              this.$storage.removeCookie("invite");
              await this.signIn();
              return;
            }
            this.isSignUpSuccess = true;
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          } else {
            await this.signIn();
            return;
          }
        }
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
