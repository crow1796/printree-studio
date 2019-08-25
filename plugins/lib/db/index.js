import { fireDb } from '~/plugins/firebase'

export default {
  async fetchAvailableProducts() {
    const productsRef = await fireDb.collection('available_products')
    let productsSnap = await productsRef.get()
    const products = await Promise.all(_.map(productsSnap.docs, (async (doc) => {
      let product = doc.data()
      const availableVariants = await Promise.all(_.map(product.available_variants, async (variantRef) => {
        let variantSnap = await variantRef.get()
        let variant = variantSnap.data()
        let printableArea = JSON.parse(JSON.stringify(variant.printable_area))
        _.map(_.keys(printableArea), (key) => printableArea[key].objects = [])
        return JSON.parse(JSON.stringify({
          id: variantSnap.id,
          base_cost: variant.base_cost,
          color: variant.color,
          printable_area: printableArea,
          sizes: variant.sizes
        }))
      }))
      return JSON.parse(JSON.stringify({
        id: doc.id,
        name: product.name,
        availableVariants,
        variants: [
          JSON.parse(JSON.stringify(availableVariants[0]))
        ]
      }))
    })))
    return products
  },
  async getDesign(id) {
    let design = {
      id: null,
      name: null,
      user_id: null,
      products: []
    }
    const designRef = await fireDb.collection('user_designs').doc(id)
    let designSnap = await designRef.get()
    design.id = designSnap.id
    design.name = designSnap.data().name
    design.user_id = designSnap.data().user_id
    const products = await Promise.all(_.map(designSnap.data().products, async (productRef) => {
      let productSnap = await productRef.product.get()
      const availableVariants = await Promise.all(_.map(productSnap.data().available_variants, async (variantRef) => {
        let variantSnap = await variantRef.get()
        let variant = variantSnap.data()
        return JSON.parse(JSON.stringify({
          id: variantSnap.id,
          base_cost: variant.base_cost,
          color: variant.color,
          printable_area: variant.printable_area,
          sizes: variant.sizes
        }))
      }))
      const variants = await Promise.all(_.map(productRef.variants, async (variantRef) => {
        let variantSnap = await variantRef.variant.get()
        let printableArea = variantSnap.data().printable_area
        _.map(_.keys(printableArea), (key) => printableArea[key].objects = variantRef.objects[key])
        return {
          id: variantSnap.id,
          base_cost: variantSnap.data().base_cost,
          color: variantSnap.data().color,
          printable_area: printableArea,
          sizes: variantSnap.data().sizes
        }
      }))
      return {
        id: productSnap.id,
        name: productSnap.data().name,
        availableVariants,
        variants
      }
    }))
    design.products = products
    return design
  },
  async createDesignFor(user, products){
    let design = {
      name: 'Untitled Design',
      user_id: user.uid,
      products: _.map(products, (product) => {
        let objects = {}
        _.map(product.availableVariants[0].printable_area, (v, k) => {
          objects[k] = []
        })
        return {
          product: fireDb.collection('available_products').doc(product.id),
          variants: [
            {
              objects,
              variant: fireDb.collection('product_variants').doc(product.availableVariants[0].id)
            }
          ]
        }
      })
    }
    let designRef = await fireDb.collection('user_designs').add(design)
    return {
      ...design,
      id: designRef.id
    }
  }
}
