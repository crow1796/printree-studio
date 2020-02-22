import { fireAuth, authProviderOf } from '~/plugins/firebase'

export default {
  async _extractUserdata(user){
    const { claims, token } = await user.getIdTokenResult()
    return {
      displayName: claims.name,
      email: claims.email,
      photoUrl: user.photoURL,
      emailVerified: claims.emailVerified,
      uid: claims.user_id,
      isAnonymous: user.isAnonymous,
      role: claims.role,
      token
    }
  },
  async createUserWithEmailAndPassword(formData){
    let response = {}
    try {
      let res = await fireAuth.createUserWithEmailAndPassword(formData.email, formData.password)
      await res.user.updateProfile({
        displayName: formData.name
      })
      response = {
        status: true,
        user: await this._extractUserdata(res.user)
      }
    } catch (error) {
      response.status = false
      response.message = error.message
    }
    return response
  },
  async signInWithEmailAndPassword(formData) {
    let response = {}
    try {
      let res = await fireAuth.signInWithEmailAndPassword(formData.email, formData.password)
      response = {
        status: true,
        user: await this._extractUserdata(res.user)
      }
    } catch (error) {
      response.status = false
      response.message = error.message
    }
    return response
  },
  async socialLogin(type){
    let response = {}
    try {
      let provider = authProviderOf(type)
      let res = await fireAuth.signInWithPopup(provider)
      response = {
        status: true,
        user: await this._extractUserdata(res.user)
      }
    } catch (error) {
      response.status = false
      response.message = error.message
    }
    return response
  },
  signOut(){
    return fireAuth.signOut()
  },
  async signInAsAGuest(){
    let response = {}
    try {
      let res = await fireAuth.signInAnonymously()
      response = {
        status: true,
        user: await this._extractUserdata(res.user)
      }
    } catch (error) {
      response.status = false
      response.message = error.message
    }
    return response
  }
}
