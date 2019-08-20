import { fireDb } from '~/plugins/firebase'

export default {
  async fetchAvailableProducts(){
    const productsRef = await fireDb.collection('available_products')
    let productsSnap = await productsRef.get()
    const products = await Promise.all(_.map(productsSnap.docs, (async (doc) => {
      let product = doc.data()
      const availableVariants = await Promise.all(_.map(product.available_variants, async (variantRef) => {
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
      return JSON.parse(JSON.stringify({
        id: doc.id,
        name: product.name,
        availableVariants
      }))
    })))
    return products
  },
  async getDesign(id){
    let design = {
      id: null,
      name: null,
      products: []
    }
    const designRef = await fireDb.collection('user_designs').doc(id)
    let designSnap = await designRef.get()
    design.id = designSnap.id
    design.name = designSnap.data().name
    const products = await Promise.all(_.map(designSnap.data().products, async (productRef) => {
      let productSnap = await productRef.product.get()
      const variants = await Promise.all(_.map(productRef.variants, async (variantRef) => {
        let variantSnap = await variantRef.get()
        let printableArea = variantSnap.data().printable_area
        _.map(printableArea, (side) => {
          // TODO: Get objects
          // Printable area (front,back, etc.)
        })
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
        variants
      }
    }))
    design.products = products
    console.log(design)
    return design
  }
}
