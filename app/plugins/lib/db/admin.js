import { fireDb, Timestamp } from '~/plugins/firebase'

export default {
  async getAllPayouts(query) {
    let response = {
      status: true
    }

    try {
      const payoutsSnap = await fireDb
        .collectionGroup('payouts')
        .orderBy('created_at', 'desc')
        .get()
      const payouts = _.map(payoutsSnap.docs, snap => {
        const payoutData = snap.data()
        return {
          ...payoutData,
          id: snap.id
        }
      })

      response.data = payouts
    } catch (error) {
      response = {
        status: false,
        message: error
      }
    }

    return response
  },
  async updatePayoutStatusTo(payout, status) {
    let response = {
      status: true
    }

    try {
      const payoutRef = await fireDb.collection('user_payouts').doc(payout.user_id).collection('payouts').doc(payout.id)
      const now = Timestamp.now()

      await payoutRef.update({ status, paid_at: now })
      response.data = {
        ...payout,
        status,
        paid_at: now
      }
    } catch (error) {
      console.log(error)
      response = {
        status: false,
        message: error
      }
    }

    return response
  }
}
