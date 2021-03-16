export default {
    currentUserCollections: `
  query{
      currentUserCollections{
          _id
          name
          handle
          plan
          approved_at
          declined_at
          status
          created_at
          updated_at
      }
  }`,
    customizableProducts: `
  query {
      customizableProducts {
          _id
          name
          preDescription
          fabricDescription
          category {
              _id
              name
          }
          customizableVariants {
              _id
              printableArea {
                  _id
                  side
                  placeholder
                  bounds {
                      top
                      left
                      width
                      height
                  }
              }
              color
              sizes {
                  name
                  baseCost
              }
          }
          printingOptions {
              _id
              displayName
              name
          }
          created_at
          updated_at
      }
  }`,
    createUserCollection: `
  mutation ($collection: CollectionInput){
      createUserCollection(collection: $collection){
          _id
          name
          plan
          approved_at
          declined_at
          status
          created_at
          updated_at
          products {
            _id
            meta {
                name
                tags
                description
            }
            variants {
                _id
                customizableVariant {
                    _id
                }
                sizes {
                    name
                    quantity
                }
                contents {
                    _id
                    side
                    objects 
                }
            }
        }
      }
  }`,
    collection: `
    query ($id: ID!){
        collection(_id: $id){
            _id
            name
            handle
            shopId
            handle
            plan
            status
            user {
                _id
                name
                shopName
            }
            products {
                _id
                shopId
                meta {
                    name
                    description
                    tags
                }
                customizableProduct {
                    _id
                    customizableVariants {
                        _id
                        color
                        sizes {
                            name
                            baseCost
                        }
                    }
                }
                variants {
                    _id
                    customizableVariant {
                        _id
                        color
                        sizes {
                            name
                            baseCost
                        }
                    }
                    sizes {
                        name
                        quantity
                        price
                        shopId
                    }
                    contents {
                        _id
                        side
                        placeholder
                        bounds {
                            left
                            top
                            width
                            height
                        }
                        objects
                        isMainThumb
                    }
                }
            }
        }
    }
  `,
    updateUserCollection: `
    mutation ($collection: UpdateCollectionInput, $isFinal: Boolean){
        updateUserCollection(collection: $collection, isFinal: $isFinal){
            _id
            name
            plan
            status
            products {
                _id
                meta {
                    name
                    description
                    tags
                }
                customizableProduct {
                    _id
                    customizableVariants {
                        _id
                        color
                        sizes {
                            name
                            baseCost
                        }
                    }
                }
                variants {
                    _id
                    customizableVariant {
                        _id
                        color
                        sizes {
                            name
                            baseCost
                        }
                    }
                    sizes {
                        name
                        quantity
                        price
                    }
                    contents {
                        _id
                        side
                        placeholder
                        bounds {
                            left
                            top
                            width
                            height
                        }
                        objects
                    }
                }
            }
        }
    }
  `,
    deleteCollection: `
    mutation($id: ID!){
        deleteCollection(_id: $id){
            _id
            name
        }
    }
  `,
    updateCollectionName: `
    mutation ($collection: UpdateCollectionNameInput) {
        updateCollectionName(collection: $collection){
            _id
            name
        }   
    }
  `,
    updateCollectionStatus: `
    mutation ($collection: UpdateCollectionStatusInput) {
        updateCollectionStatus(collection: $collection){
            _id
            status
        }   
    }
  `,
    getCollections: `
    query ($searchQuery: CollectionQueryInput){
        collections(query: $searchQuery){
            _id
            name
            handle
            plan
            approved_at
            declined_at
            status
            created_at
            updated_at
            user {
                _id
                name
                email
                shopName
            }
            products {
                _id
                meta {
                    name
                    description
                    tags
                }
            }
        }
    }
  `,
    getUsers: `
    query ($searchQuery: UserQueryInput!){
        users(query: $searchQuery) {
            _id
            name
            email
            status
            created_at
            updated_at
            shopName
            roles {
                _id
                name
                displayName
            }
        }
    }
  `,
    user: `
    query ($id: ID!){
        user(_id: $id){
            _id
            name
            shopName
            email
            status
            portfolioLink
        }
    }
  `,
    products: `
    query ($searchQuery: ProductQueryInput) {
        products(query: $searchQuery){
            _id
            meta {
                name
                description
                tags
            }
            status
            created_at
            customizableProduct {
                preDescription
            }
            parent_collection {
                _id
                name
                plan
                handle
                user {
                    _id
                    shopName
                }
            }
            variants {
                _id
                customizableVariant {
                    _id
                    color
                }
                sizes {
                    name
                    quantity
                    calculatedCost
                    price
                    approvedPrice
                    approvedBaseCost
                    shopId
                }
                contents {
                    fullThumb
                    isMainThumb
                    printableArea {
                        side
                    }
                }
            }
        }
    }
  `,
    assetsOfCurrentUser: `
    query {
        assetsOfCurrentUser {
            _id
            location
            originalName
            mimetype
            location
            imageKitLocation
            key
        }
    }
  `,
    ordersOfCurrentUser: `
    query {
        ordersOfCurrentUser{
            _id
            orderNum
            vendor {
                _id
                name
            }
            fulfillmentStatus
            financialStatus
            statusUrl
            created_at
            updated_at
            orderProducts {
                _id
                quantity
                price
                shopId
                variant {
                    _id
                    fullThumb
                    contents {
                        isMainThumb
                        fullThumb
                        printableArea {
                            side
                        }
                    }
                    sizes {
                        name
                        shopId
                        price
                    }
                    product {
                        meta {
                            name
                        }
                    }
                }
            }
        }
    }
  `,
    totalEarningsOfCurrentUser: `
    query {
        totalEarningsOfCurrentUser
    }
  `,
    payoutsOfCurrentUser: `
    query {
        payoutsOfCurrentUser {
            _id
            recipient {
                completeName
                mobileNumber
            }
            amount
            channel
            notes
            status
            created_at
            updated_at
        }
    }
  `,
    payoutRequest: `
    mutation($payout: PayoutRequestInput!){
        payoutRequest(payout: $payout){
            _id
            recipient {
                completeName
                mobileNumber
            }
            amount
            channel
            notes
            status
        }
    }
  `,
    cancelPayoutRequest: `
    mutation ($id: ID!) {
        cancelPayoutRequest(_id: $id){
            _id
            recipient {
                completeName
                mobileNumber
            }
            amount
            channel
            notes
            status
        }
    }
  `,
    editPayoutRequest: `
    mutation ($id: ID!, $payout: PayoutRequestInput!){
        editPayoutRequest(_id: $id, payout: $payout){
            _id
            recipient {
                completeName
                mobileNumber
            }
            amount
            channel
            notes
            status
        }
    }
  `,
    payoutRequests: `
    query ($searchQuery: PayoutQueryInput) {
        payoutRequests(query: $searchQuery) {
            _id
            user {
                _id
                name
            }
            recipient {
                completeName
                mobileNumber
            }
            amount
            channel
            notes
            status
            created_at
            updated_at
        }
    }
  `,
    processPayoutRequest: `
    mutation ($id: ID!) {
        processPayoutRequest(_id: $id){
            _id
            recipient {
                completeName
                mobileNumber
            }
            amount
            channel
            notes
            status
        }
    }
  `,
    declinePayoutRequest: `
    mutation ($id: ID!, $notes: String) {
        declinePayoutRequest(_id: $id, notes: $notes){
            _id
            recipient {
                completeName
                mobileNumber
            }
            amount
            channel
            notes
            status
        }
    }
  `,
    paidPayoutRequest: `
    mutation ($id: ID!) {
        paidPayoutRequest(_id: $id){
            _id
            recipient {
                completeName
                mobileNumber
            }
            amount
            channel
            notes
            status
        }
    }
  `,
    updateAccount: `
    mutation ($userInfo: AccountInfoInput!) {
        updateAccount(userInfo: $userInfo) {
            _id
            name
            shopName
            email
            created_at
            updated_at
        }
    }
  `,
    removeProductFromCollection: `
    mutation($id: ID!) {
        removeProductFromCollection(_id: $id) {
            _id
        }
    }
  `,
    generateVariantImages: `
    query($id: ID!) {
        generateVariantImages(_id: $id){
            _id
            color
            design
            isEmpty
            side
            fullThumb
        }
    }
  `,
    collectionStatus: `
    query ($id: ID!){
        collectionStatus(_id: $id){
            status
            handle
        }
    }
  `,
    productStatus: `
    query ($id: ID!){
        productStatus(_id: $id){
            status
            handle
        }
    }
  `,
    approveAccount: `
    mutation ($id: ID!){
        approveAccount(_id: $id){
            _id
            name
            shopName
            email
            status
            portfolioLink
        }
    }
  `,
    setVariantMainThumbnail: `
    mutation($_id: ID!, $side: String!) {
        setVariantMainThumbnail(_id: $_id, side: $side) {
            _id
            contents {
                isMainThumb
            }
        }
    }
  `,
    deleteUserById: `
    mutation($_id: ID!) {
        deleteUserById(_id: $_id) {
            _id
        }
    }
  `,
    variantData: `
    query ($id: ID!){
        variantData(_id: $id){
            _id
            sizes {
                name
                quantity
                shopId
            }
            customizableVariant {
                color
            }
            contents {
                _id
                side
                placeholder
                bounds {
                    left
                    top
                    width
                    height
                }
                objects
                isMainThumb
                fullThumb
                imageId
            }
        }
    }
  `,
    totalEarningsOfUser: `
    query ($id: ID!){
        totalEarningsOfUser(_id: $id)
    }
  `,
    addToCart: `
    mutation ($item: AddToCartInput!){
        addToCart(item: $item){
            _id
            items {
                _id
                variant {
                    _id
                }
                quantity
                size
            }
        }
    }
  `,
    getCartOfCurrentUser: `
    query {
        cartOfCurrentUser{
            _id
            items {
                _id
                variant {
                    _id
                }
                productName
                collectionName
                price
                fullThumb
                quantity
                size
            }
        }
    }
  `,
    removeItemFromCart: `
        mutation ($id: ID!) {
            removeItemFromCart(_id: $id) {
                _id
                items {
                    _id
                    variant {
                        _id
                    }
                    productName
                    collectionName
                    price
                    fullThumb
                    quantity
                    size
                }
            }
        }
  `,
    checkout: `
    mutation ($items: [ID!]) {
        checkout(items: $items) {
            _id
            items {
                _id
                productName
                collectionName
                price
                fullThumb
                quantity
                size
            }
        }
    }
  `,
    getCheckout: `
    query ($id: ID!) {
        getCheckout(_id: $id){
            _id
            items {
                _id
                variant {
                    _id
                }
                productName
                collectionName
                price
                fullThumb
                quantity
                size
            }
        }
    }
  `,
  getAddressesOfCurrentUser: `
    query {
        getAddressesOfCurrentUser {
            _id
            fullName
            street
            province
            city
            barangay
            mobileNumber
            notes
            label
            isDefault
        }
    }
  `,
  saveAddress: `
    mutation ($address: AddressInput!) {
        saveAddress(address: $address){
            _id
            fullName
            street
            province
            city
            barangay
            mobileNumber
            notes
            label
            isDefault
        }
    }
  `,
  paymentMethods: `
    query {
        paymentMethods{
            _id
            title
            name
            status
        }
    }
  `,
  saveShippingProfile: `
    mutation ($profile: ShippingProfileInput!) {
        saveShippingProfile(profile: $profile) {
            _id
            name
            zones {
                _id
                name
                provinces
                rates {
                    _id
                    name
                    minWeight
                    maxWeight
                    price
                }
            }
        }
    }
  `,
  shippingProfiles: `
    query {
        shippingProfiles{
            _id
            name
            zones {
                _id
                name
                provinces
                rates {
                    _id
                    name
                    minWeight
                    maxWeight
                    price
                }
            }
        }
    }
  `,
  calculateShippingFee: `
    query ($checkout: ID!, $address: ID!){
        calculateShippingFee(checkout: $checkout, address: $address){
            _id
            name
            minWeight
            maxWeight
            price
            zone {
                profile {
                    name
                }
            }
        }
    }
  `,
  placeOrder: `
    mutation ($order: OrderInput!){
        placeOrder(order: $order){
            _id
            orderNumber
            paymentMethod {
                _id
                title
                name
            }
            checkout {
                items {
                    _id
                    productName
                    collectionName
                    price
                    fullThumb
                    quantity
                    size
                }
            }
            shippingFee
            shippingProfileName
            shippingAddress {
                fullName
                street
                province
                barangay
                city
                mobileNumber
                notes
                label
                postcode
            }
            billingAddress {
                fullName
                street
                province
                barangay
                city
                mobileNumber
                notes
                label
                postcode
            }
            trackingUrl
            fulfillmentStatus
            financialStatus
        }
    }
  `,
  getMarketplaceOrder: `
    query ($id: ID!) {
        getMarketplaceOrder(_id: $id) {
            _id
            orderNumber
            paymentMethod {
                _id
                title
                name
            }
            checkout {
                items {
                    _id
                    productName
                    collectionName
                    price
                    fullThumb
                    quantity
                    size
                }
            }
            shippingFee
            shippingProfileName
            shippingAddress {
                fullName
                street
                province
                barangay
                city
                mobileNumber
                notes
                label
                postcode
            }
            billingAddress {
                fullName
                street
                province
                barangay
                city
                mobileNumber
                notes
                label
                postcode
            }
            trackingUrl
            fulfillmentStatus
            financialStatus
        }
    }
  `,
  getCheckoutsOfCurrentUser: `
    query ($searchQuery: CheckoutsQueryInput){
        getCheckoutsOfCurrentUser(query: $searchQuery){
            _id
            items {
                _id
                variant {
                    _id
                }
                productName
                collectionName
                quantity
                size
                price
                fullThumb
            }
        }
    }
  `,
  marketplaceOrders: `
    query ($query: MarketplaceOrdersQueryInput) {
        marketplaceOrders(query: $query) {
            _id
            orderNumber
            paymentMethod {
                _id
                title
                name
            }
            checkout {
                items {
                    _id
                    productName
                    collectionName
                    price
                    fullThumb
                    quantity
                    size
                }
            }
            shippingFee
            shippingProfileName
            shippingAddress {
                fullName
                street
                province
                barangay
                city
                mobileNumber
                notes
                label
                postcode
            }
            billingAddress {
                fullName
                street
                province
                barangay
                city
                mobileNumber
                notes
                label
                postcode
            }
            trackingUrl
            fulfillmentStatus
            financialStatus
        }
    }
  `,
  getCollectionMeta: `
    query ($id: ID!){
        collection(_id: $id){
            _id
            name
            handle
            plan
            user {
                _id
                shopName
            }
        }
    }
  `,
  getMPCounts: `
    query ($counts: [String!]){
        getMPCounts(counts: $counts) {
            toPay
            toShip
            toReceive
            delivered
            cart
        }
    }
  `,
  allMarketplaceOrders: `
    query ($query: MarketplaceOrdersQueryInput) {
        allMarketplaceOrders(query: $query) {
            _id
            orderNumber
            created_at
            paymentMethod {
                _id
                title
                name
            }
            checkout {
                items {
                    _id
                    productName
                    collectionName
                    price
                    fullThumb
                    quantity
                    size
                    variant {
                        _id
                    }
                }
            }
            shippingFee
            shippingProfileName
            shippingAddress {
                fullName
                street
                province
                barangay
                city
                mobileNumber
                notes
                label
                postcode
            }
            billingAddress {
                fullName
                street
                province
                barangay
                city
                mobileNumber
                notes
                label
                postcode
            }
            trackingUrl
            fulfillmentStatus
            financialStatus
        }
    }
  `
};
