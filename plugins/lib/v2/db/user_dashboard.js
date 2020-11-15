import queries from "./queries";

export const ordersOfCurrentUser = async (axios, query) => {
  const { data } = await axios.post("/gql", {
    query: queries.ordersOfCurrentUser,
  });
  const ordersOfCurrentUser = data.data.ordersOfCurrentUser;
  return ordersOfCurrentUser;
}

export const totalEarningsOfCurrentUser = async (axios) => {
  const { data } = await axios.post("/gql", {
    query: queries.totalEarningsOfCurrentUser,
  });
  const totalEarningsOfCurrentUser = data.data.totalEarningsOfCurrentUser;
  return totalEarningsOfCurrentUser;
}

export const payoutsOfCurrentUser = async (axios, query) => {
  const { data } = await axios.post("/gql", {
    query: queries.payoutsOfCurrentUser,
  });
  const payoutsOfCurrentUser = data.data.payoutsOfCurrentUser;
  return payoutsOfCurrentUser;
}