import auth from "~/plugins/lib/auth/index";

const state = () => ({
  user: null,
  isLoggedIn: false,
});

const mutations = {
  USER(state, user) {
    state.user = user;
  },
  IS_LOGGED_IN(state, status) {
    state.isLoggedIn = status;
  },
  USER_NAME(state, name) {
    state.user.displayName = name;
  },
  USER_EMAIL(state, email) {
    state.user.email = email;
  },
};

const getters = {
  user(state) {
    return state.user;
  },
  isLoggedIn(state) {
    return state.isLoggedIn;
  },
};

const actions = {
  async saveAuthToken(context, token) {
    this.$storage.setCookie("access_token", token);
    this.$axios.setToken(token, "Bearer");
  },
  async createAccount(context, data) {
    let res = await auth.createUserWithEmailAndPassword(data, this.$axios);
    if (res.status && res.user) {
      await context.dispatch("saveAuthToken", res.user.token);
      context.commit("USER", res.user);
      context.commit("IS_LOGGED_IN", true);
    }
    return res;
  },
  async signIn(context, data) {
    let res = await auth.signInWithEmailAndPassword(data, this.$axios);
    if (res.status && res.user) {
      await context.dispatch("saveAuthToken", res.user.token);
      context.commit("USER", res.user);
      context.commit("IS_LOGGED_IN", true);
    }
    return res;
  },
  async sendPasswordRecovery(context, data) {
    const res = await auth.sendPasswordRecoveryEmail(data.email);
    return res;
  },
  async socialLogin(context, type) {
    const response = await auth.socialLogin(type);
    if (response.status && response.user) {
      context.commit("USER", response.user);
      context.commit("IS_LOGGED_IN", true);
      await context.dispatch("saveAuthToken", response.user.token);
    }
    return response;
  },
  async signOut(context) {
    context.commit("USER", null);
    context.commit("IS_LOGGED_IN", false);
    this.$storage.setCookie("access_token", "");
  },
  async signInAsAGuest(context) {
    const response = await auth.signInAsAGuest();
    await context.dispatch("saveAuthToken", response.user.token);
    return response;
  },
  async updateProfile(context, data) {
    const response = await auth.updateProfile({
      email: data.email,
      displayName: data.displayName,
    });
    context.commit("USER_NAME", data.displayName);
    context.commit("USER_EMAIL", data.email);
    return response;
  },
  async updatePassword(context, password) {
    const response = await auth.updatePassword(password);
    return response;
  },
  async refreshToken() {
    const refreshed = await auth.refreshToken();
    if (refreshed.status) {
      const token = refreshed.token;
      await this.$axios.put("/api/refresh-token", { token });
      this.$storage.setCookie("access_token", token);
    }
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
