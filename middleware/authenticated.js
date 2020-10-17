export default function({store, route, redirect, isServer, $auth}){
  const user = store.getters['user']
  const isLoggedIn = store.getters['isLoggedIn']
  if(!isLoggedIn) return redirect('/')
  const isAdmin = _.includes(_.map(user.roles, 'name'), 'admin')
  if(isLoggedIn && isAdmin && route.path.includes('/dashboard')) return redirect('/admin/collections')
}
