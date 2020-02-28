import { fireDb, fireStorage } from '~/plugins/firebase'

export default {
  async fetchAvailableProducts() {
    const productsRef = await fireDb.collection('available_products')
    let productsSnap = await productsRef.get()
    const products = await Promise.all(
      _.map(productsSnap.docs, async doc => {
        let product = doc.data()
        let categorySnap = await product.category.get()
        let category = {
          ...categorySnap.data(),
          id: categorySnap.id
        }
        const availableVariants = await Promise.all(
          _.map(product.available_variants, async variantRef => {
            let variantSnap = await variantRef.get()
            let variant = variantSnap.data()
            let printableArea = JSON.parse(
              JSON.stringify(variant.printable_area)
            )
            _.map(
              _.keys(printableArea),
              key => (printableArea[key].objects = [])
            )
            let sizes = {}
            _.map(variant.available_sizes, size => {
              sizes[size.name] = {
                quantity: 0,
                price: size.base_cost
              }
            })

            return JSON.parse(
              JSON.stringify({
                id: variantSnap.id,
                color: variant.color,
                printable_area: printableArea,
                available_sizes: variant.available_sizes,
                sizes
              })
            )
          })
        )
        const availableProducts = JSON.parse(
          JSON.stringify({
            id: doc.id,
            category,
            name: product.name,
            availableVariants,
            variants: [JSON.parse(JSON.stringify(availableVariants[0]))]
          })
        )
        return availableProducts
      })
    )
    return products
  },
  async _extractCollectionFromSnap(snap){
    let collection = {
      id: null,
      name: null,
      user_id: null,
      plan: null,
      status: null,
      products: []
    }
    collection.id = snap.id
    collection.name = snap.data().name
    collection.user_id = snap.data().user_id
    collection.plan = snap.data().plan
    collection.status = snap.data().status
    const products = await Promise.all(
      _.map(snap.data().products, async productRef => {
        const productDocSnap = await productRef.get()
        const productDocData = productDocSnap.data()
        const productSnap = (await productDocData.product.get())
        const productData = productSnap.data()
        let categorySnap = await productData.category.get()
        let category = {
          ...categorySnap.data(),
          id: categorySnap.id
        }
        const availableVariants = await Promise.all(
          _.map(productData.available_variants, async variantRef => {
            let variantSnap = await variantRef.get()
            let variant = variantSnap.data()
            return JSON.parse(
              JSON.stringify({
                id: variantSnap.id,
                color: variant.color,
                printable_area: variant.printable_area,
                available_sizes: variant.available_sizes
              })
            )
          })
        )
        const variants = await Promise.all(
          _.map(productDocData.variants, async variantRef => {
            let variantSnap = await variantRef.variant.get()
            let printableArea = variantSnap.data().printable_area
            _.map(
              _.keys(printableArea),
              key => (printableArea[key].objects = variantRef.objects[key])
            )
            return {
              id: variantSnap.id,
              color: variantSnap.data().color,
              printable_area: printableArea,
              available_sizes: variantSnap.data().available_sizes,
              sizes: variantRef.sizes
            }
          })
        )
        return {
          id: productRef.id,
          category,
          name: productData.name,
          meta: productDocData.meta,
          availableVariants,
          parent_id: productSnap.id,
          variants
        }
      })
    )
    collection.products = products
    return collection
  },
  async getCollection(id) {
    const snap = await fireDb.collection('user_collections').doc(id).get()
    const collection = await this._extractCollectionFromSnap(snap)
    return collection
  },
  async getArts() {
    const artsRef = await fireDb.collection('available_arts')
    let artsSnap = await artsRef.get()
    const arts = await Promise.all(
      _.map(artsSnap.docs, async doc => {
        const art = doc.data()
        return JSON.parse(
          JSON.stringify({
            id: doc.id,
            label: art.label,
            value: art.value,
            type: art.type
          })
        )
      })
    )
    return arts
  },
  async createDesignFor(user, products) {
    const batch = fireDb.batch()
    const createdProducts = _.map(products, product => {
      const productRef = fireDb.collection('user_products').doc()
      let objects = {}
      let sizes = {}
      _.map(product.availableVariants[0].printable_area, (v, k) => {
        objects[k] = []
      })
      _.map(product.availableVariants[0].available_sizes, (v, k) => {
        sizes[v.name] = {
          quantity: 0,
          price: v.base_cost
        }
      })
      const prod = {
        id: productRef.id,
        meta: {
          name: '',
          description: '',
          tags: ''
        },
        product: fireDb.collection('available_products').doc(product.id),
        variants: [
          {
            objects,
            sizes,
            variant: fireDb
              .collection('available_product_variants')
              .doc(product.availableVariants[0].id)
          }
        ]
      }
      batch.set(productRef, prod)
      return productRef
    })
    let design = {
      name: 'Untitled Collection',
      user_id: user.uid,
      plan: 'sell',
      products: createdProducts,
      status: 'draft'
    }
    const collectionRef = fireDb.collection('user_collections').doc()
    batch.set(collectionRef, design)
    await batch.commit()
    return {
      ...design,
      id: collectionRef.id
    }
  },
  async updateDesignName(id, name) {
    const collectionRef = fireDb.collection('user_collections').doc(id)
    await collectionRef.update({ name })
  },
  async saveCollection({ id, selectedProducts, plan, status }) {
    const batch = fireDb.batch()
    const products = await Promise.all(
      _.map(selectedProducts, async product => {
        const productRef = fireDb.collection('user_products').doc(product.id)
        let variants = _.map(product.variants, variant => {
          let objects = {}
          _.map(variant.printable_area, (side, key) => {
            objects[key] = side.objects
          })

          return {
            variant: fireDb.collection('available_product_variants').doc(variant.id),
            objects,
            sizes: variant.sizes
          }
        })
        const prod = {
          id: productRef.id,
          meta: product.meta,
          product: fireDb.collection('available_products').doc(product.parent_id),
          variants
        }
        if(!product.is_new) batch.update(productRef, prod)
        else batch.set(productRef, prod)
        return productRef
      })
    )
    const collectionRef = fireDb.collection('user_collections').doc(id)
    batch.update(collectionRef, {
      plan,
      products,
      status
    })
    await batch.commit()
  },
  async getUserCollectionsOf(userId) {
    const userCollectionsRef = await fireDb
      .collection(`user_collections`)
      .where('user_id', '==', userId)

    const collectionsSnap = await userCollectionsRef.get()
    const collections = collectionsSnap.docs
    let collectionsData = await Promise.all(
      _.map(collections, async collection => {
        let collectionData = collection.data()
        return JSON.parse(
          JSON.stringify({
            id: collection.id,
            plan: collectionData.plan,
            name: collectionData.name,
            status: collectionData.status,
            products: _.map(collectionData.products, product => {
              return {
                meta: product.meta
              }
            })
          })
        )
      })
    )
    return collectionsData
  },
  async updateCollection(collectionId, data) {
    const collectionRef = fireDb.collection('user_collections').doc(collectionId)
    await collectionRef.update(data)
  },
  async deleteCollection(collectionId) {
    const collectionRef = fireDb.collection('user_collections').doc(collectionId)
    await collectionRef.delete()
  }
}
