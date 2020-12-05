import VuexPersistence from 'vuex-persist'
 
export default ({ store }) => {
  new VuexPersistence({
    key: '_stored_ptree',
    modules: ['designer'],
  }).plugin(store);
}