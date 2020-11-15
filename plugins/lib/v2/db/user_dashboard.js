import queries from "./queries";

export const ordersOfCurrentUser = async (axios, query) => {
  const { data } = await axios.post("/gql", {
    query: queries.ordersOfCurrentUser,
  });
  const ordersOfCurrentUser = data.data.ordersOfCurrentUser;
  return ordersOfCurrentUser;
}