import firebase from 'firebase/app'
import 'firebase/firestore'
if (!firebase.apps.length) {
  const config = {
    projectId: 'printree-52ca8',
  }
  firebase.initializeApp(config)
}
const fireDb = firebase.firestore()
export { fireDb }
