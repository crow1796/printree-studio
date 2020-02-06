import { fireDb, FieldValue } from '~/plugins/firebase'

export default {
  async fetchAvailableProducts() {
    const productsRef = await fireDb.collection('available_products')
    let productsSnap = await productsRef.get()
    const products = await Promise.all(_.map(productsSnap.docs, (async (doc) => {
      let product = doc.data()
      let categorySnap = await product.category.get()
      let category = {
        ...categorySnap.data(),
        id: categorySnap.id
      }
      const availableVariants = await Promise.all(_.map(product.available_variants, async (variantRef) => {
        let variantSnap = await variantRef.get()
        let variant = variantSnap.data()
        let printableArea = JSON.parse(JSON.stringify(variant.printable_area))
        _.map(_.keys(printableArea), (key) => printableArea[key].objects = [])
        let sizes = {}
        _.map(variant.available_sizes, (size) => {
          sizes[size.name] = {
            quantity: 0,
            price: size.base_cost
          }
        })

        return JSON.parse(JSON.stringify({
          id: variantSnap.id,
          color: variant.color,
          printable_area: printableArea,
          available_sizes: variant.available_sizes,
          sizes
        }))
      }))
      const availableProducts = JSON.parse(JSON.stringify({
        id: doc.id,
        category,
        name: product.name,
        availableVariants,
        variants: [
          JSON.parse(JSON.stringify(availableVariants[0]))
        ]
      }))
      return availableProducts
    })))
    return products
  },
  async getDesign(id) {
    let design = {
      id: null,
      name: null,
      user_id: null,
      plan: null,
      products: []
    }
    const designRef = await fireDb.collection('user_designs').doc(id)
    let designSnap = await designRef.get()
    design.id = designSnap.id
    design.name = designSnap.data().name
    design.user_id = designSnap.data().user_id
    design.plan = designSnap.data().plan
    const products = await Promise.all(_.map(designSnap.data().products, async (productRef) => {
      let productSnap = await productRef.product.get()
      let categorySnap = await productSnap.data().category.get()
      let category = {
        ...categorySnap.data(),
        id: categorySnap.id
      }
      const availableVariants = await Promise.all(_.map(productSnap.data().available_variants, async (variantRef) => {
        let variantSnap = await variantRef.get()
        let variant = variantSnap.data()
        return JSON.parse(JSON.stringify({
          id: variantSnap.id,
          color: variant.color,
          printable_area: variant.printable_area,
          available_sizes: variant.available_sizes
        }))
      }))
      const variants = await Promise.all(_.map(productRef.variants, async (variantRef) => {
        let variantSnap = await variantRef.variant.get()
        let printableArea = variantSnap.data().printable_area
        _.map(_.keys(printableArea), (key) => printableArea[key].objects = variantRef.objects[key])
        return {
          id: variantSnap.id,
          color: variantSnap.data().color,
          printable_area: printableArea,
          available_sizes: variantSnap.data().available_sizes,
          sizes: variantRef.sizes
        }
      }))
      return {
        id: productSnap.id,
        category,
        name: productSnap.data().name,
        meta: productRef.meta,
        availableVariants,
        variants
      }
    }))
    design.products = products
    return design
  },
  async getArts(){
    const artsRef = await fireDb.collection('available_arts')
    let artsSnap = await artsRef.get()
    const arts = await Promise.all(_.map(artsSnap.docs, async (doc) => {
      const art = doc.data()
      return JSON.parse(JSON.stringify({
        id: doc.id,
        label: art.label,
        value: art.value,
        type: art.type
      }))
    }))
    return arts
  },
  async createDesignFor(user, products){
    let design = {
      name: 'Untitled Collection',
      user_id: user.uid,
      plan: 'sell',
      products: _.map(products, (product) => {
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
        return {
          product: fireDb.collection('available_products').doc(product.id),
          meta: {
            name: '',
            description: '',
            tags: ''
          },
          variants: [
            {
              objects,
              sizes,
              variant: fireDb.collection('product_variants').doc(product.availableVariants[0].id)
            }
          ]
        }
      })
    }
    let designRef = await fireDb.collection('user_designs').add(design)
    try{
      await fireDb.collection(`user_collections`).doc(user.uid).update({
        collections: FieldValue.arrayUnion(designRef)
      })
    }catch(e){
      await fireDb.collection(`user_collections`).doc(user.uid).set({
        collections: [designRef]
      })
    }

    return {
      ...design,
      id: designRef.id
    }
  },
  async updateDesignName(id, name){
    const designRef = fireDb.collection('user_designs').doc(id)
    await designRef.update({name})
  },
  async saveCollection({ id, selectedProducts, plan }){
    const products = _.map(selectedProducts, (product) => {
      let variants = _.map(product.variants, variant => {
        let objects = {}
        _.map(variant.printable_area, (side, key) => {
          objects[key] = side.objects
        })

        return {
          variant: fireDb.collection('product_variants').doc(variant.id),
          objects,
          sizes: variant.sizes
        }
      })

      return {
        meta: product.meta,
        product: fireDb.collection('available_products').doc(product.id),
        variants
      }
    })
    const designRef = fireDb.collection('user_designs').doc(id)
    await designRef.update({
      plan,
      products
    })
  },
  async getUserCollectionsOf(userId){
    const userCollectionsRef = await fireDb.collection(`user_collections`).doc(userId)
    const collectionsSnap = await userCollectionsRef.get()
    const { collections } = collectionsSnap.data()
    let collectionsData = await Promise.all(_.map(collections, async (col) => {
      const colData = await col.get()
      return colData.data()
    }))
    return collectionsData
  }
}
