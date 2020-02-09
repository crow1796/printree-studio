export default function({store, route, redirect, isServer}){
  if(!store.getters['user/isLoggedIn']) return redirect('/')
  // if(route.path === '/') return redirect('/dashboard/collections')
}
