import queries from "./queries";

export const createDesignFor = async (axios, products) => {
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
};

export const getCollection = async (axios, id) => {
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
};

const stringifyContentsOfProduct = (product) => {
  return {
    _id: product._id,
    meta: product.meta,
    variants: _.map(product.variants, (variant) => {
      let newVariant = {
        sizes: variant.sizes,
        contents: _.map(variant.contents, (content) => {
          let newContent = {
            objects: JSON.stringify(content.objects)
          };
          // TODO: Update id
          if (content._id) newContent._id = content._id;
          else newContent.printableArea = "test printable area";

          return newContent;
        }),
      };
      // TODO: Update id
      if(variant._id) newVariant._id = variant._id;
      else newVariant.customizableVariant = 'test customizable variant';

      return newVariant;
    }),
  };
};

export const saveCollection = async (axios, collection) => {
  const tmpCollection = {
    _id: collection.id,
    name: collection.name,
    products: _.map(collection.selectedProducts, stringifyContentsOfProduct),
    plan: collection.plan,
  };
  const { data } = await axios.post("/graphql", {
    query: queries.updateUserCollection,
    variables: {
      collection: tmpCollection,
    },
  });
  const { updateUserCollection } = data.data;
  return updateUserCollection;
};
