import queries from "./queries";

export const getProductsToSell = async (axios, query) => {
  const { data } = await axios.post("/gql", {
    query: queries.products,
    variables: {
      searchQuery: {
        plan: "Sell",
        sorting: {
          field: "created_at",
          order: "ASC"
        },
        pagination: {
          limit: 15,
          page: 0
        }
      }
    },
  });
  const { products } = data.data;
  return products;
}