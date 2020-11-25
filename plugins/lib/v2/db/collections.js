import queries from "./queries";

export const createDesignFor = async (axios, products) => {
  const { data } = await axios.post("/gql", {
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
                name: size.name,
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
};

const parseCollection = collection => ({
  ...collection,
  products: _.map(collection.products, (prod) => ({
    ...prod,
    variants: _.map(prod.variants, (variant) => ({
      ...variant,
      contents: _.map(variant.contents, (content) => ({
        ...content,
        objects: JSON.parse(content.objects),
      })),
    })),
  })),
})

export const getCollection = async (axios, id) => {
  const { data } = await axios.post("/gql", {
    query: queries.collection,
    variables: {
      id,
    },
  });
  return parseCollection(data.data.collection);
};

const stringifyContentsOfProduct = (product) => {
  return {
    ...product,
    customizableProduct: product.customizableProduct._id,
    meta: product.meta,
    variants: _.map(product.variants, (variant) => {
      let newVariant = {
        customizableVariant: variant.customizableVariant._id,
        sizes: variant.sizes,
        contents: _.map(variant.contents, (content) => {
          let newContent = {
            objects: JSON.stringify(content.objects)
          };
          if (content._id) newContent._id = content._id;
          else newContent.printableArea = content.side;

          return newContent;
        }),
      };
      if (variant._id) newVariant._id = variant._id;

      return { ...variant, ...newVariant };
    }),
  };
};

export const saveCollection = async (axios, collection) => {
  const tmpCollection = {
    _id: collection.id,
    name: collection.name,
    status: collection.status,
    products: _.map(collection.selectedProducts, stringifyContentsOfProduct),
    plan: collection.plan,
  };

  const { data } = await axios.post("/gql", {
    query: queries.updateUserCollection,
    variables: {
      collection: tmpCollection,
    },
  });
  const { updateUserCollection } = data.data;
  return parseCollection(updateUserCollection);
};

export const deleteCollection = async (axios, id) => {
  const { data } = await axios.post("/gql", {
    query: queries.deleteCollection,
    variables: {
      id
    },
  });
  const { deleteCollection } = data.data;
  return deleteCollection;
}

export const updateCollectionName = async (axios, { _id, name }) => {
  const { data } = await axios.post("/gql", {
    query: queries.updateCollectionName,
    variables: {
      collection: {
        _id,
        name
      }
    },
  });
  const { updateCollectionName } = data.data;
  return updateCollectionName;
}