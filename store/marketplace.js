import db from '~/plugins/lib/db/index'

const state = () => ({
})

const mutations = {
}

const getters = {
}

const actions = {
  async getProductsToSell(context, query){
    const products = await db.getProductsToSell(query)
    return [{
      id: 1,
      name: 'Printree T-Shirt',
      collectionName: 'Printree Uniforms',
      price: 499,
      thumbnail: 'https://user-images.githubusercontent.com/2805249/64069899-8bdaa180-cc97-11e9-9b19-1a9e1a254c18.png'
    },{
      id: 2,
      name: 'Printree T-Shirt',
      collectionName: 'Printree Uniforms',
      price: 499,
      thumbnail: 'https://user-images.githubusercontent.com/2805249/64069899-8bdaa180-cc97-11e9-9b19-1a9e1a254c18.png'
    },{
      id: 3,
      name: 'Printree T-Shirt',
      collectionName: 'Printree Uniforms',
      price: 499,
      thumbnail: 'https://user-images.githubusercontent.com/2805249/64069899-8bdaa180-cc97-11e9-9b19-1a9e1a254c18.png'
    },{
      id: 4,
      name: 'Printree T-Shirt',
      collectionName: 'Printree Uniforms',
      price: 499,
      thumbnail: 'https://user-images.githubusercontent.com/2805249/64069899-8bdaa180-cc97-11e9-9b19-1a9e1a254c18.png'
    }]
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
