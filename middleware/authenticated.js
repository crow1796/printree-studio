export default function({ store, route, redirect }){
  if(!store.getters['user/user']) redirect('/')
}
