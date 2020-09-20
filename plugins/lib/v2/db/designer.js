import queries from "./queries";

export const fetchAvailableProducts = async (axios) => {
  const { data } = await axios.post("/graphql", {
    query: queries.customizableProducts,
  });
  const customizableProducts = data.data.customizableProducts;
  return customizableProducts;
}

export const getArts = async () => {
  return []
} 