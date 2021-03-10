import queries from "./queries";

export const getProductsToSell = async (axios, searchQuery) => {
  const { data } = await axios.post("/gql", {
    query: queries.products,
    variables: {
      searchQuery
    },
  });
  const { products } = data.data;
  return products;
}

export const addToCart = async (axios, item) => {
  const { data } = await axios.post("/gql", {
    query: queries.addToCart,
    variables: {
      item
    },
  });
  const { addToCart } = data.data;
  return addToCart;
}

export const getCartOfCurrentUser = async (axios, item) => {
  const { data } = await axios.post("/gql", {
    query: queries.getCartOfCurrentUser,
  });
  const { cartOfCurrentUser } = data.data;
  return cartOfCurrentUser;
}

export const removeItemFromCart = async (axios, id) => {
  const { data } = await axios.post("/gql", {
    query: queries.removeItemFromCart,
    variables: {
      id
    }
  });
  const { removeItemFromCart } = data.data;
  return removeItemFromCart;
}

export const checkout = async (axios, items) => {
  const { data } = await axios.post("/gql", {
    query: queries.checkout,
    variables: {
      items
    }
  });
  const { checkout } = data.data;
  return checkout;
}

export const getCheckout = async (axios, id) => {
  const { data } = await axios.post("/gql", {
    query: queries.getCheckout,
    variables: {
      id
    }
  });
  const { getCheckout } = data.data;
  return getCheckout;
}

export const getAddressesOfCurrentUser = async (axios, id) => {
  const { data } = await axios.post("/gql", {
    query: queries.getAddressesOfCurrentUser,
    variables: {
      id
    }
  });
  const { getAddressesOfCurrentUser } = data.data;
  return getAddressesOfCurrentUser;
}