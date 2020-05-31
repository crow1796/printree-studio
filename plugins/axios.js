export default function({ $axios, $storage }) {
  $axios.setToken($storage.getCookie("access_token"), "Bearer");
  // $axios.onError(async error => {
  //   if(error.response.status === 401){
  //     const token = fireAuth.currentUser.getIdToken(true)
  //     await $axios.put('/verify-token', {token})
        // this.$storage.setCookie("access_token", token);
  //   }
  // })
}
