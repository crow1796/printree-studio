export default async function({ $axios, $storage, store }) {
  if (!$storage.getCookie("access_token")) return;
  const res = await $axios.post("/api/me");
  if (!res) return;
  const user = res.data;
  if (user) {
    await store.commit("user/USER", {
      displayName: user.name,
      email: user.email,
      uid: user._id,
      roles: user.roles,
    });
    await store.commit("user/IS_LOGGED_IN", true);
    return;
  }
}
