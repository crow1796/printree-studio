import Cookies from 'js-cookie'

export default function({ $axios }) {
  $axios.setToken(Cookies.get('access_token'), 'Bearer')
}
