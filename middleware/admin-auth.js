export default function({store, route, redirect, isServer, $auth}){
  const user = store.getters['user']
  const isLoggedIn = store.getters['isLoggedIn']
  if(!isLoggedIn) return redirect('/admin/login')
  const isAdmin = _.includes(_.map(user.roles, 'name'), 'admin')

  const isCustomer = _.includes(_.map(user.roles, 'name'), 'customer')
  
  if (isCustomer && (route.path.includes('/dashboard') || route.path.includes('/admin'))) return redirect('/marketplace/profile')
  
  if(isAdmin && route.path === '/admin/login') return redirect('/admin/collections')
  if(!isAdmin) return redirect('/')
}