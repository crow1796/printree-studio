import { fireDb, Timestamp, fireStorage } from '~/plugins/firebase'

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
          featured_at: productDocData.featured_at,
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
    const collectionRef = fireDb.collection('user_collections').doc()
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
        product: productRef,
        collection: collectionRef
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
  async approveCollection(collectionId) {
    const now = Timestamp.now()
    const collectionRef = fireDb
      .collection('user_collections')
      .doc(collectionId)
    await collectionRef.update({
      status: 'approved',
      approved_at: now,
      declined_at: null
    })
  },
  async declineCollection(collectionId) {
    const now = Timestamp.now()
    const collectionRef = fireDb
      .collection('user_collections')
      .doc(collectionId)
    await collectionRef.update({
      status: 'declined',
      approved_at: null,
      declined_at: now
    })
  },
  async deleteCollection(collectionId) {
    const collectionRef = fireDb
      .collection('user_collections')
      .doc(collectionId)
    await collectionRef.delete()
  },
  async addToCartOf(item, user) {
    const batch = fireDb.batch()
    const cartRef = await fireDb.collection('user_carts').doc(user.uid)

    const userVariantSnap = await fireDb
      .collection('user_product_variants')
      .doc(item.variant.id)
      .get()
    const userVariantData = userVariantSnap.data()
    const collectionSnap = await userVariantData.collection.get()
    const collectionData = collectionSnap.data()

    const products = [
      {
        owner_id: collectionData.user_id,
        variant: fireDb
          .collection('user_product_variants')
          .doc(item.variant.id),
        quantity: item.quantity,
        size: item.size
      }
    ]

    await Promise.all(
      _.map(products, async product => {
        const existingProducts = await cartRef
          .collection('products')
          .where('variant', '==', product.variant)
          .where('size', '==', product.size)
          .get()
        if (existingProducts.docs.length) {
          const existingDocSnap = _.first(existingProducts.docs)
          const existingDocData = existingDocSnap.data()
          const existingDocRef = existingDocSnap.ref
          const newQuantity = existingDocData.quantity + product.quantity
          batch.update(existingDocRef, { quantity: newQuantity })
          return
        }
        const productRef = cartRef.collection('products').doc()
        batch.set(productRef, product)
      })
    )

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
  async getFeaturedProducts(query) {
    let response = {
      status: true
    }

    try {
      const featuredProductsSnaps = await fireDb
        .collection('user_products')
        .orderBy('featured_at', 'desc')
        .get()

      const featuredProducts = await Promise.all(
        _.map(featuredProductsSnaps.docs, async productSnap => {
          const collectionQuery = await fireDb.collection('user_collections').where('products', 'array-contains', productSnap.ref).get()
          const collectionSnap = _.first(collectionQuery.docs)
          const collectionData = collectionSnap.data()
          const productData = productSnap.data()
          const firstVariantRef = await _.first(productData.variants).get()
          const firstVariant = firstVariantRef.data()
          const firstSizeKey = _.first(_.keys(firstVariant.sizes))
          const price = firstVariant.sizes[firstSizeKey].price
          const parentVariantRef = await firstVariant.variant.get()
          const parentVariantData = parentVariantRef.data()
          const areas = _.keys(parentVariantData.printable_area)
          const frontOrFirstSide = _.includes(areas, 'front')
            ? 'front'
            : _.first(areas)
          const parentFirstSize = _.first(parentVariantData.available_sizes)
          const baseCost = parentFirstSize.base_cost
          const thumbnail = await fireStorage
            .ref(
              `products/thumbnails/${productData.id}/${firstVariantRef.id}/${frontOrFirstSide}.png`
            )
            .getDownloadURL()
          const product = {
            id: productData.id,
            collectionId: collectionSnap.id,
            collectionName: collectionData.name,
            name: productData.meta.name,
            price: baseCost + price,
            thumbnail: thumbnail
          }
          return product
        })
      )
      response.data = featuredProducts
    } catch (error) {
      console.log(error)
      response = {
        status: false,
        message: error
      }
    }

    return response
  },
  async getProductsToSell(query) {
    let collectionSnaps = []
    let collectionsSnap = null
    if (query && query.collectionId) {
      collectionsSnap = await fireDb
        .collection('user_collections')
        .doc(query.collectionId)
        .get()
      collectionSnaps = [collectionsSnap]
    } else {
      collectionsSnap = await fireDb
        .collection('user_collections')
        .where('plan', '==', 'sell')
        .where('status', '==', 'approved')
        .get()
      collectionSnaps = collectionsSnap.docs
    }
    const products = await Promise.all(
      _.map(collectionSnaps, async doc => {
        const collectionData = doc.data()
        return await Promise.all(
          _.map(collectionData.products, async productRef => {
            const productData = (await productRef.get()).data()
            const firstVariantRef = await _.first(productData.variants).get()
            const firstVariant = firstVariantRef.data()
            const firstSizeKey = _.first(_.keys(firstVariant.sizes))
            const price = firstVariant.sizes[firstSizeKey].price
            const parentVariantRef = await firstVariant.variant.get()
            const parentVariantData = parentVariantRef.data()
            const areas = _.keys(parentVariantData.printable_area)
            const frontOrFirstSide = _.includes(areas, 'front')
              ? 'front'
              : _.first(areas)
            const parentFirstSize = _.first(parentVariantData.available_sizes)
            const baseCost = parentFirstSize.base_cost
            const thumbnail = await fireStorage
              .ref(
                `products/thumbnails/${productData.id}/${firstVariantRef.id}/${frontOrFirstSide}.png`
              )
              .getDownloadURL()
            const product = {
              id: productData.id,
              name: productData.meta.name,
              collectionName: collectionData.name,
              collectionId: doc.id,
              price: baseCost + price,
              thumbnail: thumbnail
            }
            return product
          })
        )
      })
    )

    return _.flatten(products)
  },
  async confirmOrderFor({ products, user, contact, total }) {
    const batch = fireDb.batch()
    const orderRef = fireDb.collection('user_orders').doc()
    const now = Timestamp.now()

    await Promise.all(
      _.map(products, async product => {
        const cartProductRef = fireDb
          .collection('user_carts')
          .doc(user.uid)
          .collection('products')
          .doc(product.id)
        const cartProductSnap = await cartProductRef.get()
        const cartProductData = cartProductSnap.data()
        const productRef = orderRef.collection('products').doc(product.id)
        const userVariantSnap = await cartProductData.variant.get()
        const userVariantData = userVariantSnap.data()
        const firstSizeKey = _.first(_.keys(userVariantData.sizes))
        const price = userVariantData.sizes[firstSizeKey].price
        const parentVariantData = (await userVariantData.variant.get()).data()
        const parentFirstSize = _.first(parentVariantData.available_sizes)
        const baseCost = parentFirstSize.base_cost
        const orderedProduct = {
          id: cartProductRef.id,
          ...cartProductData,
          price,
          base_cost: baseCost,
          order: orderRef,
          quantity: product.quantity,
          created_at: now,
          status: 'unpaid'
        }
        batch.set(productRef, orderedProduct)

        const orderedProductRef = fireDb.collection('ordered_products').doc()
        batch.set(orderedProductRef, orderedProduct)
        batch.delete(cartProductRef)
      })
    )

    batch.set(orderRef, {
      user_id: user.uid,
      status: 'unpaid',
      contact,
      created_at: now,
      payment_method: '',
      total
    })

    batch.commit()

    return {
      id: orderRef.id,
      user_id: user.uid,
      status: 'unpaid',
      contact
    }
  },
  async getProductFromCollection(collectionId, productId) {
    const collectionSnap = await fireDb
      .collection('user_collections')
      .doc(collectionId)
      .get()
    const productDocSnap = await fireDb
      .collection('user_products')
      .doc(productId)
      .get()
    const productDocData = productDocSnap.data()
    const collectionData = collectionSnap.data()
    const productSnap = await productDocData.product.get()
    const productData = productSnap.data()
    const firstVariantRef = await _.first(productDocData.variants).get()
    const firstVariant = firstVariantRef.data()
    const firstSizeKey = _.first(_.keys(firstVariant.sizes))
    const price = firstVariant.sizes[firstSizeKey].price
    const parentVariantData = (await firstVariant.variant.get()).data()
    const parentFirstSize = _.first(parentVariantData.available_sizes)
    const baseCost = parentFirstSize.base_cost
    const categoryData = (await productData.category.get()).data()
    const variants = await Promise.all(
      _.map(productDocData.variants, async variant => {
        const variantRef = await variant.get()
        const variantData = variantRef.data()
        const parentVariantRef = await variantData.variant.get()
        const parentVariantData = parentVariantRef.data()
        let thumbnails = {}
        await Promise.all(
          _.map(_.keys(parentVariantData.printable_area), async side => {
            const thumb = await fireStorage
              .ref(
                `products/thumbnails/${productId}/${variantRef.id}/${side}.png`
              )
              .getDownloadURL()

            thumbnails[side] = thumb
          })
        )
        return {
          id: variantRef.id,
          color: parentVariantData.color,
          sizes: variantData.sizes,
          thumbnails,
          parent_id: parentVariantRef.id
        }
      })
    )
    const product = {
      id: productDocSnap.id,
      name: productDocData.meta.name,
      description: productDocData.meta.description,
      collectionName: collectionData.name,
      collectionId: collectionSnap.id,
      price: baseCost + price,
      variants,
      category: categoryData.name,
      categoryId: categoryData.id
    }

    return product
  },
  async placeOrder(orderId, paymentMethod) {
    const batch = fireDb.batch()
    const orderRef = fireDb.collection('user_orders').doc(orderId)
    const now = Timestamp.now()

    const orderedProducts = await fireDb
      .collection('ordered_products')
      .where('order', '==', orderRef)
      .get()

    _.map(orderedProducts.docs, snap => {
      const prodRef = fireDb.collection('ordered_products').doc(snap.id)
      batch.update(prodRef, {
        status: 'pending',
        placed_at: now
      })
    })

    batch.update(orderRef, {
      status: 'pending',
      placed_at: now,
      payment_method: paymentMethod
    })
    batch.commit()
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
            const parentProductSnap = await variantData.product.get()

            return {
              id: productData.id,
              quantity: productData.quantity,
              size: productData.size,
              thumbnail: thumb,
              meta: parentProductSnap.data().meta
            }
          })
        )
        return {
          ...orderData,
          id: snap.id,
          products: products
        }
      })
    )

    return orders
  },
  async getOrdersForSeller(user) {
    const orderedProducts = await fireDb
      .collection('ordered_products')
      .where('owner_id', '==', user.uid)
      .orderBy('placed_at', 'desc')
      .get()
    const orders = []
    await Promise.all(
      _.map(orderedProducts.docs, async productSnap => {
        const productData = productSnap.data()
        const userProductVariantSnap = await productData.variant.get()
        const userProductVariantData = userProductVariantSnap.data()
        const userProductSnap = await userProductVariantData.product.get()
        const userProductData = userProductSnap.data()

        const parentVariantRef = await userProductVariantData.variant.get()
        const parentVariantData = parentVariantRef.data()
        const sides = _.keys(parentVariantData.printable_area)
        const side = _.includes(sides, 'front') ? 'front' : sides[0]
        const thumb = await fireStorage
          .ref(
            `products/thumbnails/${userProductSnap.id}/${userProductVariantSnap.id}/${side}.png`
          )
          .getDownloadURL()
        const product = {
          quantity: productData.quantity,
          profit: productData.price,
          base_cost: productData.base_cost,
          price: productData.price + productData.base_cost,
          size: productData.size,
          meta: userProductData.meta,
          thumbnail: thumb
        }
        const orderSnap = await productData.order.get()
        const orderData = orderSnap.data()
        orders.push({
          id: productData.order.id,
          status: orderData.status,
          placed_at: orderData.placed_at,
          created_at: orderData.created_at,
          payment_method: orderData.payment_method,
          products: [product]
        })
      })
    )
    const groupedOrders = []

    _.map(orders, order => {
      let orderIndex = _.findIndex(groupedOrders, { id: order.id })
      if (orderIndex === -1) {
        groupedOrders.push(_.omit(order, ['products']))
        orderIndex = groupedOrders.length - 1
        groupedOrders[orderIndex].products = []
      }
      groupedOrders[orderIndex].products = _.concat(
        groupedOrders[orderIndex].products,
        order.products
      )
      groupedOrders[orderIndex].total_profit = 0
      if (order.status === 'delivered')
        groupedOrders[orderIndex].total_profit = _.sum(
          _.map(
            groupedOrders[orderIndex].products,
            ({ quantity, profit }) => quantity * profit
          )
        )
    })

    return groupedOrders
  },
  async getTotalProfitOf(user) {
    const deliveredProducts = await fireDb
      .collection('ordered_products')
      .where('owner_id', '==', user.uid)
      .where('status', '==', 'delivered')
      .get()

    const payoutsSnap = await fireDb
      .collection('user_payouts')
      .doc(user.uid)
      .collection('payouts')
      .where('status', 'in', ['pending', 'paid', 'processing'])
      .get()

    const payouts = _.map(payoutsSnap.docs, snap => {
      const payoutData = snap.data()
      return {
        ...payoutData,
        id: snap.id
      }
    })

    const totalPayoutsAmount = _.sum(_.map(payouts, 'amount'))

    const total = _.sum(
      _.map(deliveredProducts.docs, snap => {
        const { price, quantity } = snap.data()
        return price * quantity
      })
    )

    return total - totalPayoutsAmount
  },
  async sendPayoutRequest({ user, payout }) {
    let response = {
      status: true
    }
    try {
      const payoutRef = payout.id
        ? fireDb
            .collection('user_payouts')
            .doc(user.uid)
            .collection('payouts')
            .doc(payout.id)
        : fireDb
            .collection('user_payouts')
            .doc(user.uid)
            .collection('payouts')
            .doc()
      if (payout.id) {
        const payoutSnap = await payoutRef.get()
        const payoutData = payoutSnap.data()
        if (payoutData.status !== 'pending')
          return {
            status: false,
            message:
              'Unable to update request. Has already moved from "pending" state.'
          }
      }
      let payoutRequest = {
        id: payoutRef.id,
        ...payout,
        user_id: user.uid,
        status: 'pending',
        created_at: Timestamp.now()
      }
      if (payout.id) {
        const updatedAt = Timestamp.now()
        await payoutRef.update({
          ..._.omit(payoutRequest, ['id', 'created_at']),
          updated_at: updatedAt
        })
        payoutRequest.created_at = new Timestamp(
          payout.created_at.seconds,
          payout.created_at.nanoseconds
        )
        payoutRequest.updated_at = updatedAt
      } else {
        await payoutRef.set(payoutRequest)
      }
      response.data = payoutRequest
    } catch (e) {
      response = {
        status: false,
        message: e
      }
    }
    return response
  },
  async getPayoutsOf(user) {
    let response = {
      status: true
    }
    try {
      const payoutsSnap = await fireDb
        .collection('user_payouts')
        .doc(user.uid)
        .collection('payouts')
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
    } catch (e) {
      response = {
        status: false,
        message: e
      }
    }
    return response
  },
  async cancelPayout({ user, payout }) {
    let response = {
      status: true
    }
    try {
      const payoutRef = fireDb
        .collection('user_payouts')
        .doc(user.uid)
        .collection('payouts')
        .doc(payout.id)
      const payoutSnap = await payoutRef.get()

      const payoutData = payoutSnap.data()
      if (payoutData.status !== 'pending') {
        return {
          status: false,
          message:
            'Unable to update request. Has already moved from "pending" state.'
        }
      }

      payoutRef.update({
        status: 'cancelled'
      })
    } catch (e) {
      response = {
        status: false,
        message: e
      }
    }
    return response
  }
}
