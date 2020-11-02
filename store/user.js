import auth from "~/plugins/lib/auth/index";

const state = () => ({
});

const mutations = {
};

const getters = {
};

const actions = {
  async createAccount(context, data) {
    let res = await auth.createUserWithEmailAndPassword(data, this.$axios);
    if (res.status) {
      await context.dispatch('signIn', data);
    }
    return res;
  },
  async signIn(context, data) {
    let res = await this.$auth.loginWith('local', {
      data,
    })
    return res;
  },
  async sendPasswordRecovery(context, data) {
    const res = await auth.sendPasswordRecoveryEmail(data.email);
    return res;
  },
  async signOut(context) {
    this.$storage.removeLocalStorage('current_design_id')
    await this.$auth.logout();
  },
  async signInAsAGuest(context) {
    const response = await auth.signInAsAGuest();
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
};

export default {
  state,
  mutations,
  actions,
  getters,
};
