import { createDesignFor, getCollection, saveCollection, deleteCollection, updateCollectionName } from './collections';
import { getCollections, updateCollectionStatus, getUsers } from './admin';
import { getCollectionsOfUserId } from './users';
import { getProductsToSell } from './marketplace';
import { ordersOfCurrentUser, totalEarningsOfCurrentUser, payoutsOfCurrentUser } from './user_dashboard';
import { fetchAvailableProducts, getArts } from './designer';

export default (axios) => {
  return {
    // users.js
    getUserCollectionsOf: (userId) => getCollectionsOfUserId(axios, userId),
    // designer.js
    fetchAvailableProducts: () => fetchAvailableProducts(axios),
    getArts: () => getArts(axios),
    // collections.js
    createDesignFor: (products) => createDesignFor(axios, products),
    getCollection: (id) => getCollection(axios, id),
    saveCollection: (collection) => saveCollection(axios, collection),
    deleteCollection: (id) => deleteCollection(axios, id),
    updateCollectionName: (data) => updateCollectionName(axios, data),
    // admin
    admin: {
      getCollections: (data) => getCollections(axios, data),
      updateCollectionStatus: (data) => updateCollectionStatus(axios, data),
      getUsers: (data) => getUsers(axios, data),
    },
    // marketplace
    marketplace: {
      getProductsToSell: (query) => getProductsToSell(axios, query),
    },
    userDashboard: {
      ordersOfCurrentUser: (query) => ordersOfCurrentUser(axios, query),
      totalEarningsOfCurrentUser: () => totalEarningsOfCurrentUser(axios),
      payoutsOfCurrentUser: (query) => payoutsOfCurrentUser(axios, query),
    }
  };
};
