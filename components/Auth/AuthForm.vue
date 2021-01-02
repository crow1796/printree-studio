<template>
  <div class="flex flex-col items-center w-full p-4">
    <AreaLoader v-if="isLoading" />
    <div class="top-text flex flex-col items-center" v-if="!isSignUpSuccess">
      <h2 class="font-black text-4xl text-primary-lighter mb-4">SIGN IN TO CONTINUE</h2>
    </div>
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
          <div class="text-lg font-black text-gray-700 mb-4">{{ formTitle }}</div>
          <div v-if="formType === 'sign_up'">
            <label class="font-bold mb-2 block text-center">I want to...</label>
            <div class="flex justify-center mb-4 text-sm">
              <button
                type="button"
                class="rounded border flex items-center p-3 flex-col w-6/12 cursor-pointer mx-2 hover:border-gray-600 uppercase font-bold"
                v-for="(type, i) in userTypes"
                :key="i"
                :class="{'bg-primary text-white': formData.type === type}"
                @click="changeUserType(type)"
              >{{userType(type)}} PRODUCTS</button>
            </div>
          </div>

          <div
            class="mb-3"
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
          <div class="mb-3" v-if="formType == 'sign_up'" key="name">
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
          <div class="mb-3" key="email">
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
          <div class="mb-3" v-if="formType != 'password_recovery'" key="password">
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
          <div
            class="mb-3"
            v-if="formType === 'sign_up' && formData.type === 'seller'"
            key="portfolio"
          >
            <label for="pass" class="font-bold flex items-center">
              Link to your Portfolio
              <span
                class="pl-1"
                v-tippy="{arrow: true}"
                title="This can help you get your application approved faster."
              >
                <font-awesome-icon :icon="['fas', 'question-circle']" />
              </span>
            </label>
            <div class="text-xs text-blue-500 mt-1">(Google Drive, Dropbox, personal website, etc.)</div>
            <div class="mt-2">
              <input
                type="url"
                name="portfolio"
                class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                :class="{ 'border-red-400': errors.has('portfolio'), 'focus:border-gray-600': !errors.has('portfolio') }"
                placeholder="Portfolio Link"
                v-model="formData.portfolio"
                data-vv-as="Portfolio"
                v-validate="'required|url'"
              />
            </div>
            <span
              class="text-red-700 text-xs pt-1 font-bold inline-block"
              v-if="errors.has('portfolio')"
            >{{ errors.first('portfolio') }}</span>
          </div>
          <div class="mb-3" v-if="formType === 'sign_up'" key="terms">
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
import confetti from "canvas-confetti";

export default {
  data() {
    return {
      formType: "sign_in",
      formData: {
        name: null,
        email: null,
        password: null,
        shopName: null,
        portfolio: null,
        type: "seller",
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
          portfolio: null,
          type: "seller",
        };
      });
    },
    async signInAsAGuest() {
      this.isLoading = true;
      let response = await this.$store.dispatch("user/signInAsAGuest");
      this.isLoading = false;
      if (response.status) this.$emit("login-success");
    },
    async signIn(){
      let res = await this.$store.dispatch("user/signIn", this.formData);

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
        let tmpFormData = {...this.formData};

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
            portfolio: null,
            type: "seller",
          };
          this.formType = "sign_in";
          this.$validator.reset();
          return;
        }
        if (this.formType !== "sign_up") this.$emit("login-success");
        else {
          if (tmpFormData.type === "seller") {
            this.isSignUpSuccess = true;
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          } else{
            await this.signIn()
            return 
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
