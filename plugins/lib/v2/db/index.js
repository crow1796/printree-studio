import queries from "./queries";
import { createDesignFor, getCollection, saveCollection } from './collections';
import { getCollectionsOfUserId } from './users';
import { fetchAvailableProducts, getArts } from './designer';

export default (axios) => {
  return {
    // users.js
    getUserCollectionsOf: (userId) => getCollectionsOfUserId(axios, userId),
    // designer.js
    fetchAvailableProducts: () => fetchAvailableProducts(axios) ,
    getArts: () => getArts(axios),
    // collections.js
    createDesignFor: (products) => createDesignFor(axios, products),
    getCollection: (id) => getCollection(axios, id),
    saveCollection: (collection) => saveCollection(axios, collection)
  };
};
