import queries from "./queries";

export const getCollectionsOfUserId = async (axios, userId) => {
  const { data } = await axios.post("/gql", {
    query: queries.currentUserCollections,
    variables: {
      user_id: userId,
    },
  });
  const collections = data.data.currentUserCollections;
  return collections;
}