export default function({store, route, redirect, isServer}){
  const user = store.getters['user/user']
  const isLoggedIn = store.getters['user/isLoggedIn']
  if(!isLoggedIn) return redirect('/admin/login')
  const isAdmin = _.includes(['admin'], user.role)
  if(isLoggedIn && isAdmin && route.path === '/admin/login') return redirect('/admin/collections')
  if(isLoggedIn && !isAdmin) return redirect('/')
}
