import api from "./lib/v2/db";

export default ({ app, $axios }, inject) => {
  app.$api = api($axios);
  inject("api", app.$api);
};
