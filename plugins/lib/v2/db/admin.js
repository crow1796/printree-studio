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

export const updateCollectionStatus = async (axios, {_id, status}) => {
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
