import queries from "./queries";

export const getProductsToSell = async (axios, searchQuery) => {
  const { data } = await axios.post("/gql", {
    query: queries.products,
    variables: {
      searchQuery
    },
  });
  const { products } = data.data;
  return products;
}