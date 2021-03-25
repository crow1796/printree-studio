import queries from "./queries";

export const getCollectionsOfUserId = async (axios) => {
  const { data } = await axios.post("/gql", {
    query: queries.currentUserCollections,
    variables: {
      status: ["draft", "pending", "approved", "declined", 'reviewing', 'to pay', 'printing process', "completed", "partially approved"]
    },
  });
  const collections = data.data.currentUserCollections;
  return collections;
}