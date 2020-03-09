import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
if (!firebase.apps.length) {
  const config = {
    apiKey: process.env.firebaseApiKey,
    authDomain: process.env.firebaseAuthDomain,
    databaseURL: process.env.firebaseDatabaseURL,
    projectId: process.env.firebaseProjectId,
    storageBucket: process.env.firebaseStorageBucket,
    messagingSenderId: process.env.firebaseMessagingSenderId,
    appId: process.env.firebaseAppId
  }
  firebase.initializeApp(config)
}
const fireDb = firebase.firestore()
const fireStorage = firebase.storage()
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
const Timestamp = firebase.firestore.Timestamp
const ServerTimestamp = firebase.firestore.FieldValue.serverTimestamp()

export { fireDb, fireAuth, authProviderOf, FieldValue, Timestamp, ServerTimestamp, fireStorage }
