export default function({store, route, redirect}){
  if(!store.getters['user/isLoggedIn']) return redirect('/')
  if(route.path === '/') return redirect('/dashboard')
}
