export default function({store, route, redirect, isServer}){
  const user = store.getters['user/user']
  const isLoggedIn = store.getters['user/isLoggedIn']
  if(!isLoggedIn) return redirect('/')
  const isAdmin = _.includes(['admin'], user.role)
  if(isLoggedIn && isAdmin && route.path.includes('/dashboard')) return redirect('/admin/collections')
}
