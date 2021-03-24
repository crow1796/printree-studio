import queries from "./queries";

export const getCollections = async (axios, searchQuery) => {
  const { data } = await axios.post("/gql", {
    query: queries.getCollections,
    variables: {
      searchQuery
    }
  });

  return data.data?.collections || [];
};

export const payoutRequests = async (axios, searchQuery) => {
  const { data } = await axios.post("/gql", {
    query: queries.payoutRequests,
    variables: {
      searchQuery
    }
  });

  return data.data?.payoutRequests || [];
};

export const getUsers = async (axios, searchQuery) => {
  const { data } = await axios.post("/gql", {
    query: queries.getUsers,
    variables: {
      searchQuery
    }
  });

  return data.data?.users || [];
}

export const updateCollectionStatus = async (axios, { _id, status, notes, products }) => {
  const { data } = await axios.post("/gql", {
    query: queries.updateCollectionStatus,
    variables: {
      collection: {
        _id,
        status,
        notes,
        products
      }
    },
  });
  const { updateCollectionStatus } = data.data;
  return updateCollectionStatus;
}

export const processPayoutRequest = async (axios, { _id }) => {
  const { data } = await axios.post("/gql", {
    query: queries.processPayoutRequest,
    variables: {
      id: _id
    },
  });
  const { processPayoutRequest } = data.data;
  return processPayoutRequest;
}

export const getUserById = async (axios, { _id }) => {
  const { data } = await axios.post("/gql", {
    query: queries.user,
    variables: {
      id: _id
    },
  });
  const { user } = data.data;
  return user;
}

export const deleteUserById = async (axios, _id) => {
  const { data } = await axios.post("/gql", {
    query: queries.deleteUserById,
    variables: {
      _id
    },
  });
  const { deleteUserById } = data.data;
  return deleteUserById;
}

export const approveAccount = async (axios, id) => {
  const { data } = await axios.post("/gql", {
    query: queries.approveAccount,
    variables: {
      id
    },
  });
  const { approveAccount } = data.data;
  return approveAccount;
}

export const declinePayoutRequest = async (axios, { _id, notes }) => {
  const { data } = await axios.post("/gql", {
    query: queries.declinePayoutRequest,
    variables: {
      id: _id
    },
  });
  const { declinePayoutRequest } = data.data;
  return declinePayoutRequest;
}

export const paidPayoutRequest = async (axios, { _id }) => {
  const { data } = await axios.post("/gql", {
    query: queries.paidPayoutRequest,
    variables: {
      id: _id
    },
  });
  const { paidPayoutRequest } = data.data;
  return paidPayoutRequest;
}

export const generateVariantImages = async (axios, { _id }) => {
  const { data } = await axios.post("/gql", {
    query: queries.generateVariantImages,
    variables: {
      id: _id
    },
  });
  const { generateVariantImages } = data.data;
  return generateVariantImages;
}

export const totalEarningsOfUser = async (axios, _id) => {
  const { data } = await axios.post("/gql", {
    query: queries.totalEarningsOfUser,
    variables: {
      id: _id
    },
  });
  const { totalEarningsOfUser } = data.data;
  return totalEarningsOfUser;
}

export const saveShippingProfile = async (axios, profile) => {
  const { data } = await axios.post("/gql", {
    query: queries.saveShippingProfile,
    variables: {
      profile
    },
  });
  const { saveShippingProfile } = data.data;
  return saveShippingProfile;
}

export const shippingProfiles = async (axios) => {
  const { data } = await axios.post("/gql", {
    query: queries.shippingProfiles
  });
  const { shippingProfiles } = data.data;
  return shippingProfiles;
}

export const allMarketplaceOrders = async (axios, query) => {
  const { data } = await axios.post("/gql", {
    query: queries.allMarketplaceOrders,
    variables: {
      query
    }
  });
  const { allMarketplaceOrders } = data.data;
  return allMarketplaceOrders;
}

export const updateOrder = async (axios, query) => {
  const { data } = await axios.post("/gql", {
    query: queries.updateOrder,
    variables: query
  });
  const { updateOrder } = data.data;
  return updateOrder;
}