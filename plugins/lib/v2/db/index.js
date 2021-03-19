import { createDesignFor, getCollection, saveCollection, deleteCollection, updateCollectionName } from './collections';
import { getCollections, updateCollectionStatus, getUsers, allMarketplaceOrders, payoutRequests, processPayoutRequest, declinePayoutRequest, paidPayoutRequest, generateVariantImages, getUserById, approveAccount, deleteUserById, totalEarningsOfUser, saveShippingProfile, shippingProfiles, updateOrder } from './admin';
import { getCollectionsOfUserId } from './users';
import { getProductsToSell, addToCart, getCartOfCurrentUser, removeItemFromCart, checkout, getCheckout, getAddressesOfCurrentUser, saveAddress, paymentMethods, calculateShippingFee, placeOrder, getMarketplaceOrder, getCheckoutsOfCurrentUser, marketplaceOrders, getCollectionMeta, getMPCounts } from './marketplace';
import { ordersOfCurrentUser, totalEarningsOfCurrentUser, payoutsOfCurrentUser, payoutRequest, cancelPayoutRequest, editPayoutRequest, updateAccount, removeProductFromCollection, collectionStatus, productStatus, setVariantMainThumbnail, variantData, getUserProductsOf } from './user_dashboard';
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
      updateOrder: (data) => updateOrder(axios, data),
      getUsers: (query) => getUsers(axios, query),
      allMarketplaceOrders: (query) => allMarketplaceOrders(axios, query),
      payoutRequests: (query) => payoutRequests(axios, query),
      processPayoutRequest: (payout) => processPayoutRequest(axios, payout),
      declinePayoutRequest: (payout) => declinePayoutRequest(axios, payout),
      paidPayoutRequest: (payout) => paidPayoutRequest(axios, payout),
      generateVariantImages: (data) => generateVariantImages(axios, data),
      getUserById: (data) => getUserById(axios, data),
      saveShippingProfile: (data) => saveShippingProfile(axios, data),
      shippingProfiles: () => shippingProfiles(axios),
      approveAccount: (id) => approveAccount(axios, id),
      deleteUserById: (id) => deleteUserById(axios, id),
      totalEarningsOfUser: (id) => totalEarningsOfUser(axios, id),
    },
    // marketplace
    marketplace: {
      getProductsToSell: (query) => getProductsToSell(axios, query),
      addToCart: (item) => addToCart(axios, item),
      getCartOfCurrentUser: () => getCartOfCurrentUser(axios),
      removeItemFromCart: (id) => removeItemFromCart(axios, id),
      checkout: (items) => checkout(axios, items),
      getCheckout: (id) => getCheckout(axios, id),
      getCheckoutsOfCurrentUser: (query) => getCheckoutsOfCurrentUser(axios, query),
      marketplaceOrders: (query) => marketplaceOrders(axios, query),
      getMarketplaceOrder: (id) => getMarketplaceOrder(axios, id),
      getCollectionMeta: (id) => getCollectionMeta(axios, id),
      getAddressesOfCurrentUser: () => getAddressesOfCurrentUser(axios),
      saveAddress: (data) => saveAddress(axios, data),
      getMPCounts: (data) => getMPCounts(axios, data),
      calculateShippingFee: (data) => calculateShippingFee(axios, data),
      placeOrder: (data) => placeOrder(axios, data),
      paymentMethods: () => paymentMethods(axios),
    },
    userDashboard: {
      getUserProductsOf: (query) => getUserProductsOf(axios, query),
      ordersOfCurrentUser: (query) => ordersOfCurrentUser(axios, query),
      totalEarningsOfCurrentUser: () => totalEarningsOfCurrentUser(axios),
      payoutsOfCurrentUser: (query) => payoutsOfCurrentUser(axios, query),
      payoutRequest: (data) => payoutRequest(axios, data),
      editPayoutRequest: (data) => editPayoutRequest(axios, data),
      cancelPayoutRequest: (id) => cancelPayoutRequest(axios, id),
      updateAccount: (data) => updateAccount(axios, data),
      removeProductFromCollection: (id) => removeProductFromCollection(axios, id),
      collectionStatus: (id) => collectionStatus(axios, id),
      productStatus: (id) => productStatus(axios, id),
      variantData: (id) => variantData(axios, id),
      setVariantMainThumbnail: (data) => setVariantMainThumbnail(axios, data),
    }
  };
};
