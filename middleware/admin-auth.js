export default function({store, route, redirect, isServer, $auth}){
  const user = store.getters['user']
  const isLoggedIn = store.getters['isLoggedIn']
  if(!isLoggedIn && !user) return redirect('/admin/login')
  const isAdmin = _.includes(_.map(user.roles, 'name'), 'admin')
  if(isLoggedIn && isAdmin && route.path === '/admin/login') return redirect('/admin/collections')
  if(isLoggedIn && !isAdmin) return redirect('/')
}