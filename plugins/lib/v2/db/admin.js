import queries from "./queries";

export const getCollections = async (axios) => {
  const { data } = await axios.post("/gql", {
    query: queries.getCollections,
    variables: {
      searchQuery: {
        plan: "Sell",
        status: ["pending", "approved"],
        sorting: {
          field: "created_at",
          order: "ASC"
        },
        pagination: {
          limit: 15,
          page: 0
        }
      }
    }
  });

  const { collections } = data.data;
  return collections;
};

export const payoutRequests = async (axios) => {
  const { data } = await axios.post("/gql", {
    query: queries.payoutRequests,
    variables: {
      searchQuery: {
        sorting: {
          field: "created_at",
          order: "ASC",
        },
        pagination: {
          limit: 15,
          page: 0,
        },
      }
    }
  });

  const { payoutRequests } = data.data;
  return payoutRequests;
};

export const getUsers = async (axios) => {
  const { data } = await axios.post("/gql", {
    query: queries.getUsers,
    variables: {
      searchQuery: {
        sorting: {
          field: "created_at",
          order: "ASC"
        },
        pagination: {
          limit: 15,
          page: 0
        }
      }
    }
  });

  const { users } = data.data;
  return users;
}

export const updateCollectionStatus = async (axios, { _id, status }) => {
  const { data } = await axios.post("/gql", {
    query: queries.updateCollectionStatus,
    variables: {
      collection: {
        _id,
        status
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

export const declinePayoutRequest = async (axios, { _id }) => {
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
