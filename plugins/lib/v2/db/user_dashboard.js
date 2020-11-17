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

export const payoutRequest = async (axios, payout) => {
  const { data } = await axios.post("/gql", {
    query: queries.payoutRequest,
    variables: {
      payout,
    }
  });
  const payoutRequest = data.data.payoutRequest;
  return payoutRequest;
}

export const cancelPayoutRequest = async (axios, id) => {
  const { data } = await axios.post("/gql", {
    query: queries.cancelPayoutRequest,
    variables: {
      id,
    }
  });
  const cancelPayoutRequest = data.data.cancelPayoutRequest;
  return cancelPayoutRequest;
}