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

export const paymentMethods = async (axios, id) => {
  const { data } = await axios.post("/gql", {
    query: queries.paymentMethods
  });
  const { paymentMethods } = data.data;
  return paymentMethods;
}

export const getAddressesOfCurrentUser = async (axios) => {
  const { data } = await axios.post("/gql", {
    query: queries.getAddressesOfCurrentUser
  });
  const { getAddressesOfCurrentUser } = data.data;
  return getAddressesOfCurrentUser;
}

export const saveAddress = async (axios, address) => {
  const { data } = await axios.post("/gql", {
    query: queries.saveAddress,
    variables: {
      address
    }
  });
  const { saveAddress } = data.data;
  return saveAddress;
}

export const calculateShippingFee = async (axios, variables) => {
  const { data } = await axios.post("/gql", {
    query: queries.calculateShippingFee,
    variables
  });
  const { calculateShippingFee } = data.data;
  return calculateShippingFee;
}

export const placeOrder = async (axios, order) => {
  const { data } = await axios.post("/gql", {
    query: queries.placeOrder,
    variables: {
      order
    }
  });
  const { placeOrder } = data.data;
  return placeOrder;
}

export const getMarketplaceOrder = async (axios, id) => {
  const { data } = await axios.post("/gql", {
    query: queries.getMarketplaceOrder,
    variables: {
      id
    }
  });
  const { getMarketplaceOrder } = data.data;
  return getMarketplaceOrder;
}