export default function({store, route, redirect, isServer, $auth}){
  const user = store.getters['user']
  const isLoggedIn = store.getters['isLoggedIn']
  if(isLoggedIn) return redirect('/dashboard/collections')
}
