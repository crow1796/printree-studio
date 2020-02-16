import { fireAuth } from '~/plugins/firebase'
import Cookies from 'js-cookie'

export default function({ store }) {
  fireAuth.onAuthStateChanged(async user => {
    if (user) {
      const token = await user.getIdToken(true)
      Cookies.set('access_token', token)
      return
    }
    // Cookies.remove('access_token')
  })
}
