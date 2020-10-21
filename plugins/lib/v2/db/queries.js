export default {
  currentUserCollections: `
  query{
      currentUserCollections{
          _id
          name
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
                  sizes {
                      name
                      quantity
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
                        color
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
  `
};
