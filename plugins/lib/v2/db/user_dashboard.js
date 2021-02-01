import queries from "./queries";
import omit from "lodash/omit";

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

export const collectionStatus = async (axios, id) => {
  const { data } = await axios.post("/gql", {
    query: queries.collectionStatus,
    variables: {
      id
    }
  });
  const collectionStatus = data.data.collectionStatus;
  return collectionStatus;
}

export const setVariantMainThumbnail = async (axios, variables) => {
  const { data } = await axios.post("/gql", {
    query: queries.setVariantMainThumbnail,
    variables
  });
  const setVariantMainThumbnail = data.data.setVariantMainThumbnail;
  return setVariantMainThumbnail;
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

export const editPayoutRequest = async (axios, payout) => {
  const { data } = await axios.post("/gql", {
    query: queries.editPayoutRequest,
    variables: {
      id: payout._id,
      payout: omit(payout, '_id'),
    }
  });
  const editPayoutRequest = data.data.editPayoutRequest;
  return editPayoutRequest;
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

export const updateAccount = async (axios, userInfo) => {
  const { data } = await axios.post("/gql", {
    query: queries.updateAccount,
    variables: {
      userInfo,
    }
  });
  const updateAccount = data.data.updateAccount;
  return updateAccount;
}

export const removeProductFromCollection = async (axios, id) => {
  const { data } = await axios.post("/gql", {
    query: queries.removeProductFromCollection,
    variables: {
      id,
    }
  });
  const removeProductFromCollection = data.data.removeProductFromCollection;
  return removeProductFromCollection;
}

export const variantData = async (axios, id) => {
  const { data } = await axios.post("/gql", {
    query: queries.variantData,
    variables: {
      id,
    }
  });
  const variantData = data.data.variantData;
  return variantData;
}