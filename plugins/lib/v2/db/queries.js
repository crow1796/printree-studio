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
    updateUserCollection: `
    mutation ($collection: UpdateCollectionInput){
        updateUserCollection(collection: $collection){
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
                email
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
            created_at
            updated_at
            roles {
                _id
                name
                displayName
            }
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
            created_at
            parent_collection {
                _id
                name
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
  `
};
