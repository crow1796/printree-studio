import queries from "./queries";

export const fetchAvailableProducts = async (axios, query) => {
  const { data } = await axios.post("/gql", {
    query: queries.customizableProducts,
    variables: {
      query
    }
  });
  const customizableProducts = data.data.customizableProducts;
  return customizableProducts;
}

export const getArts = async (axios) => {
  const { data } = await axios.post("/gql", {
    query: queries.assetsOfCurrentUser,
  });
  const assetsOfCurrentUser = data.data.assetsOfCurrentUser;
  return assetsOfCurrentUser;
} 