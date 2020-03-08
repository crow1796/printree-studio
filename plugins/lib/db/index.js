import { fireDb, FieldValue, fireStorage } from '~/plugins/firebase'

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
                color: variant.color,
                printable_area: printableArea,
                available_sizes: variant.available_sizes,
                sizes,
                parent_id: variantRef.id
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
  async _extractCollectionFromSnap(snap) {
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
        const productSnap = await productDocData.product.get()
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
            const variantData = (await variantRef.get()).data()
            let parentVariantSnap = await variantData.variant.get()
            let printableArea = parentVariantSnap.data().printable_area
            _.map(
              _.keys(printableArea),
              key => (printableArea[key].objects = variantData.objects[key])
            )
            return {
              id: variantRef.id,
              color: parentVariantSnap.data().color,
              printable_area: printableArea,
              available_sizes: parentVariantSnap.data().available_sizes,
              sizes: variantData.sizes,
              parent_id: variantData.variant.id
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
    const snap = await fireDb
      .collection('user_collections')
      .doc(id)
      .get()
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
      const variantRef = fireDb.collection('user_product_variants').doc()
      batch.set(variantRef, {
        objects,
        sizes,
        variant: fireDb
          .collection('available_product_variants')
          .doc(product.availableVariants[0].parent_id),
        product: productRef
      })
      const prod = {
        id: productRef.id,
        meta: {
          name: '',
          description: '',
          tags: ''
        },
        product: fireDb.collection('available_products').doc(product.id),
        variants: [variantRef]
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
          const variantRef = variant.id
            ? fireDb.collection('user_product_variants').doc(variant.id)
            : fireDb.collection('user_product_variants').doc()
          _.map(variant.printable_area, (side, key) => {
            objects[key] = side.objects
          })

          const newVariantData = {
            variant: fireDb
              .collection('available_product_variants')
              .doc(variant.parent_id),
            objects,
            sizes: variant.sizes,
            product: productRef
          }
          if (variant.id) {
            batch.update(variantRef, newVariantData)
          } else {
            batch.set(variantRef, newVariantData)
          }

          return variantRef
        })
        const prod = {
          id: productRef.id,
          meta: product.meta,
          product: fireDb
            .collection('available_products')
            .doc(product.parent_id),
          variants
        }
        if (!product.is_new) batch.update(productRef, prod)
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
    const collectionRef = fireDb
      .collection('user_collections')
      .doc(collectionId)
    await collectionRef.update(data)
  },
  async deleteCollection(collectionId) {
    const collectionRef = fireDb
      .collection('user_collections')
      .doc(collectionId)
    await collectionRef.delete()
  },
  async addToCartOf(item, user) {
    const batch = fireDb.batch()
    const ref = await fireDb.collection('user_carts').doc(user.uid)

    const products = [
      {
        variant: fireDb
          .collection('user_product_variants')
          .doc(item.variant.id),
        quantity: item.quantity,
        size: item.size
      }
    ]

    _.map(products, product => {
      const productRef = ref.collection('products').doc()
      batch.set(productRef, product)
    })

    batch.commit()
  },
  async getCartOf(user) {
    const productsSnapshot = await fireDb
      .collection('user_carts')
      .doc(user.uid)
      .collection('products')
      .get()
    if (productsSnapshot.docs.length) {
      const products = await Promise.all(
        _.map(productsSnapshot.docs, async productSnap => {
          const productData = productSnap.data()
          const variantRef = await productData.variant.get()
          const variantData = variantRef.data()
          const parentVariantRef = await variantData.variant.get()
          const parentVariantData = parentVariantRef.data()
          const sides = _.keys(parentVariantData.printable_area)
          const side = _.includes(sides, 'front') ? 'front' : sides[0]
          const productRef = await variantData.product.get()
          const parentProductData = productRef.data()
          const thumb = await fireStorage
            .ref(
              `products/thumbnails/${productRef.id}/${variantRef.id}/${side}.png`
            )
            .getDownloadURL()
          const baseCost = _.find(parentVariantData.available_sizes, {
            name: productData.size
          }).base_cost
          return {
            id: productSnap.id,
            variantId: variantRef.id,
            name: parentProductData.meta.name,
            quantity: productData.quantity,
            size: productData.size,
            thumbnail: thumb,
            price: baseCost + variantData.sizes[productData.size].price,
            max: variantData.sizes[productData.size].quantity
          }
        })
      )
      return JSON.parse(
        JSON.stringify({
          products
        })
      )
    }
    return {
      products: []
    }
  },
  async saveAddress(data) {
    const userId = data.user_id
    const docId = data.id
    delete data.id
    delete data.user_id
    if (docId) {
      const addressRef = await fireDb
        .collection('user_addresses')
        .doc(userId)
        .collection('addresses')
        .doc(docId)
        .update(data)
      return {
        ...data,
        id: addressRef.id,
        user_id: userId
      }
    }
    const addressRef = await fireDb
      .collection('user_addresses')
      .doc(userId)
      .collection('addresses')
      .doc()
    await addressRef.set(data)
    return {
      ...data,
      id: addressRef.id,
      user_id: userId
    }
  },
  async getAddressesOf(userId) {
    const userAddressRef = await fireDb
      .collection('user_addresses')
      .doc(userId)
      .collection('addresses')
      .get()
    let addresses = _.map(userAddressRef.docs, snapshot => {
      const addressData = snapshot.data()
      return {
        ...addressData,
        id: snapshot.id,
        user_id: userId
      }
    })
    return addresses
  },
  async confirmOrderFor({ products, user, contact }) {
    const batch = fireDb.batch()
    const orderRef = fireDb.collection('user_orders').doc()

    await Promise.all(
      _.map(products, async product => {
        const cartProductRef = fireDb
          .collection('user_carts')
          .doc(user.uid)
          .collection('products')
          .doc(product)
        const cartProductSnap = await cartProductRef.get()
        const productRef = orderRef.collection('products').doc(product)
        batch.set(productRef, {
          id: cartProductRef.id,
          ...cartProductSnap.data()
        })
        batch.delete(cartProductRef)
      })
    )

    batch.set(orderRef, {
      user_id: user.uid,
      status: 'draft',
      contact
    })

    batch.commit()

    return {
      id: orderRef.id,
      user_id: user.uid,
      status: 'draft',
      contact
    }
  },
  async placeOrder(orderId) {
    await fireDb
      .collection('user_orders')
      .doc(orderId)
      .update({ status: 'pending' })
  },
  async getUserPurchasesOf(user) {
    const ordersQuery = fireDb
      .collection('user_orders')
      .where('user_id', '==', user.uid)
    const ordersSnap = await ordersQuery.get()

    const orders = await Promise.all(
      _.map(ordersSnap.docs, async snap => {
        const orderData = snap.data()

        const productsRef = await snap.ref.collection('products').get()
        const products = await Promise.all(
          _.map(productsRef.docs, async productSnap => {
            const productData = productSnap.data()
            if (!productData.variant) return productData
            const variantRef = productData.variant
            const variantSnap = await variantRef.get()
            let variantData = variantSnap.data()

            const parentVariantRef = await variantData.variant.get()
            const parentVariantData = parentVariantRef.data()
            const sides = _.keys(parentVariantData.printable_area)
            const side = _.includes(sides, 'front') ? 'front' : sides[0]
            const productRef = await variantData.product.get()
            const thumb = await fireStorage
              .ref(
                `products/thumbnails/${productRef.id}/${variantRef.id}/${side}.png`
              )
              .getDownloadURL()

            console.log(parentVariantData)
              
            return {
              id: productData.id,
              quantity: productData.quantity,
              size: productData.size,
              thumbnail: thumb
            }
          })
        )

        return {
          ...orderData,
          products: products
        }
      })
    )
    return orders
  }
}
