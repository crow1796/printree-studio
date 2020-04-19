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
      response = {
        status: false,
        message: error
      }
    }

    return response
  },
  async markAsFeatured(data){
    let response = {
      status: true
    }
    try {
      const featured_at = data.is_marked ? null : Timestamp.now()
      switch(data.type){
        case 'product':
          const productRef = await fireDb.collection('user_products').doc(data.obj.id)

          await productRef.update({ featured_at })
          response.data = {
            ...data.obj,
            featured_at
          }
          break;
        case 'collection':
          const collectionRef = await fireDb.collection('user_collections').doc(data.obj.id)

          await collectionRef.update({ featured_at })
          response.data = {
            ...data.obj,
            featured_at
          }
          break;
      }
    } catch (error) {
      response = {
        status: false,
        message: error
      }
    }

    return response
  },
  async updateCollectionStatusOf(collectionId, status) {
    const batch = fireDb.batch()
    const now = Timestamp.now()
    const collectionRef = fireDb
      .collection('user_collections')
      .doc(collectionId)
    const productSnaps = await collectionRef.collection('collection_products').get()
    const productsCount = productSnaps.docs.length
    _.map(productSnaps.docs, snap => {
      batch.update(snap.ref, {
        status,
        approved_at: status === 'approved' ? now : null,
        declined_at: status === 'declined' ? now : null
      })
    })
    batch.update(collectionRef, {
      status,
      approved_at: status === 'approved' ? now : null,
      declined_at: status === 'declined' ? now : null
    })
    if(status === 'approved'){
      const counterRef = fireDb.collection('_counters').doc('published_products')
      const countSnap = await counterRef.get()
      batch.update(counterRef, { count: countSnap.data().count + productsCount})
    }
    batch.commit()
  }
}
