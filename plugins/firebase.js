import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
if (!firebase.apps.length) {
  const config = {
    apiKey: "AIzaSyCHnNnLCPNRUo2EMOSJpt4Yx6LuIFXnUME",
    authDomain: "printree-52ca8.firebaseapp.com",
    databaseURL: "https://printree-52ca8.firebaseio.com",
    projectId: "printree-52ca8",
    storageBucket: "printree-52ca8.appspot.com",
    messagingSenderId: "745635077669",
    appId: "1:745635077669:web:dc48ee73b7248866d369cc"
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

const FieldValue = firebase.firestore.FieldValue

export { fireDb, fireAuth, authProviderOf, FieldValue }
