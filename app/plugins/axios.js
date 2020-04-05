import { fireAuth } from '~/plugins/firebase'
import Cookies from 'js-cookie'

export default function({ $axios }) {
  $axios.setToken(Cookies.get('access_token'), 'Bearer')
  $axios.onError(async error => {
    if(error.response.status === 401){
      const token = fireAuth.currentUser.getIdToken(true)
      await $axios.put('/verify-token', {token})
      Cookies.set('access_token', token)
    }
  })
}
