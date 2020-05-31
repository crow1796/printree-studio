import queries from "./queries";

export default (axios) => {
  return {
    async getUserCollectionsOf(userId) {
      const { data } = await axios.post("/graphql", {
        query: queries.currentUserCollections,
        variables: {
          user_id: userId,
        },
      });
      const collections = data.data.currentUserCollections;
      return collections;
    },
    async fetchAvailableProducts() {
      const { data } = await axios.post("/graphql", {
        query: queries.customizableProducts,
      });
      const customizableProducts = data.data.customizableProducts;
      return customizableProducts;
    },
    async createDesignFor(products) {
      const { data } = await axios.post("/graphql", {
        query: queries.createUserCollection,
        variables: {
          collection: {
            name: "Untitled Collection",
            products: _.map(products, (prod) => ({
              customizableProduct: prod._id,
              meta: {
                name: prod.name,
                description: "",
                tags: [],
              },
              variants: [
                {
                  customizableVariant: prod.customizableVariants[0]._id,
                  sizes: _.map(prod.customizableVariants[0].sizes, (size) => ({
                    name: size,
                    quantity: 0,
                  })),
                },
              ],
            })),
          },
        },
      });
      const { createUserCollection } = data.data;
      return createUserCollection;
    },
    async getCollection(id) {
      const { data } = await axios.post("/graphql", {
        query: queries.collection,
        variables: {
          id,
        },
      });
      const collection = {
        ...data.data.collection,
        products: _.map(data.data.collection.products, (prod) => ({
          ...prod,
          variants: _.map(prod.variants, (variant) => ({
            ...variant,
            contents: _.map(variant.contents, (content) => ({
              ...content,
              objects: JSON.parse(content.objects),
            })),
          })),
        })),
      };
      return collection;
    },
    async getArts() {
      return [];
    },
    async saveCollection(collection){
      console.log(collection)
    }
  };
};
