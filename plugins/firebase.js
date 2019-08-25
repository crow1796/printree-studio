import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
if (!firebase.apps.length) {
  const config = {
    apiKey: 'AIzaSyCHnNnLCPNRUo2EMOSJpt4Yx6LuIFXnUME',
    projectId: 'printree-52ca8',
    authDomain: 'printree-52ca8.firebaseapp.com',
  }
  firebase.initializeApp(config)
}
const fireDb = firebase.firestore()
const fireAuth = firebase.auth()
const authProviderOf = function(type){
  let provider = null
  switch(type){
    case 'facebook':
      provider = new firebase.auth.FacebookAuthProvider()
      break
    case 'google':
      provider = new firebase.auth.GoogleAuthProvider()
      break
  }
  return provider
}
export { fireDb, fireAuth, authProviderOf }
