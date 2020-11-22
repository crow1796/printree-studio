import { createDesignFor, getCollection, saveCollection, deleteCollection, updateCollectionName } from './collections';
import { getCollections, updateCollectionStatus, getUsers, payoutRequests, processPayoutRequest, declinePayoutRequest, paidPayoutRequest } from './admin';
import { getCollectionsOfUserId } from './users';
import { getProductsToSell } from './marketplace';
import { ordersOfCurrentUser, totalEarningsOfCurrentUser, payoutsOfCurrentUser, payoutRequest, cancelPayoutRequest, editPayoutRequest, updateAccount } from './user_dashboard';
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
      payoutRequests: (query) => payoutRequests(axios, query),
      processPayoutRequest: (payout) => processPayoutRequest(axios, payout),
      declinePayoutRequest: (payout) => declinePayoutRequest(axios, payout),
      paidPayoutRequest: (payout) => paidPayoutRequest(axios, payout),
    },
    // marketplace
    marketplace: {
      getProductsToSell: (query) => getProductsToSell(axios, query),
    },
    userDashboard: {
      ordersOfCurrentUser: (query) => ordersOfCurrentUser(axios, query),
      totalEarningsOfCurrentUser: () => totalEarningsOfCurrentUser(axios),
      payoutsOfCurrentUser: (query) => payoutsOfCurrentUser(axios, query),
      payoutRequest: (data) => payoutRequest(axios, data),
      editPayoutRequest: (data) => editPayoutRequest(axios, data),
      cancelPayoutRequest: (id) => cancelPayoutRequest(axios, id),
      updateAccount: (data) => updateAccount(axios, data),
    }
  };
};
