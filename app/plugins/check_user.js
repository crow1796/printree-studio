import { fireAuth } from '~/plugins/firebase'
import Cookies from 'js-cookie'

export default function({$axios}) {
  fireAuth.onAuthStateChanged(async user => {
    if (user) {
      const token = await user.getIdToken(true)
      await $axios.put('/verify-token', {token})
      Cookies.set('access_token', token)
      return
    }
  })
}
