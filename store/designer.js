import ColorRegulator from '~/plugins/color-regulator'
import db from '~/plugins/lib/db'

const state = () => ({
  currentSide: 'front',
  currentDesignId: null,
  availableProducts: [],
  selectedProducts: [
    {
      id: 1,
      product_id: 1,
      name: 'Classic Tee',
      availableVariants: [
        {
          id: 1,
          printable_area: {
            front: {
              placeholder: require('~/assets/images/products/placeholders/type_1/id1/front.png'),
              left: 160,
              top: 105,
              width: 200,
              height: 280,
              objects: []
            },
            back: {
              placeholder: require('~/assets/images/products/placeholders/type_1/id1/back.png'),
              left: 175,
              top: 60,
              width: 175,
              height: 420,
              objects: []
            }
          },
          base_cost: null,
          color: '#FEFEFE'
        },
        {
          id: 2,
          printable_area: {
            front: {
              placeholder: require('~/assets/images/products/placeholders/type_1/id1/front.png'),
              left: 160,
              top: 105,
              width: 200,
              height: 280,
              objects: []
            },
            back: {
              placeholder: require('~/assets/images/products/placeholders/type_1/id1/back.png'),
              left: 160,
              top: 105,
              width: 200,
              height: 280,
              objects: []
            }
          },
          base_cost: null,
          color: '#012F56'
        },
        {
          id: 3,
          printable_area: {
            front: {
              placeholder: require('~/assets/images/products/placeholders/type_1/id1/front.png'),
              left: 160,
              top: 105,
              width: 200,
              height: 280,
              objects: []
            },
            back: {
              placeholder: require('~/assets/images/products/placeholders/type_1/id1/back.png'),
              left: 160,
              top: 105,
              width: 200,
              height: 280,
              objects: []
            }
          },
          base_cost: null,
          color: '#FE8474'
        },
        {
          id: 4,
          printable_area: {
            front: {
              placeholder: require('~/assets/images/products/placeholders/type_1/id1/front.png'),
              left: 160,
              top: 105,
              width: 200,
              height: 280,
              objects: []
            },
            back: {
              placeholder: require('~/assets/images/products/placeholders/type_1/id1/back.png'),
              left: 160,
              top: 105,
              width: 200,
              height: 280,
              objects: []
            }
          },
          base_cost: null,
          color: '#3A5DAB'
        }
      ],
      variants: [
        {
          printable_area: {
            front: {
              placeholder: require('~/assets/images/products/placeholders/type_1/id1/front.png'),
              left: 160,
              top: 105,
              width: 200,
              height: 280,
              objects: []
            },
            back: {
              placeholder: require('~/assets/images/products/placeholders/type_1/id1/back.png'),
              left: 175,
              top: 60,
              width: 175,
              height: 420,
              objects: []
            }
          },
          base_cost: 499,
          color: '#FEFEFE'
        }
      ]
    }
  ],
  objectBoilerplates: {
    'text': {
      id: null,
      type: 'text',
      value: 'TEXT',
      bounds: {
        left: 0,
        top: 0,
        width: 80,
        height: 20,
        angle: 0
      },
      style: {
        fontFamily: 'Lobster',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: '',
        color: '#FEFEFE',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        textAlign: 'center'
      },
      editorData: {
        isResizable: false,
        isActive: false,
        hasActiveContent: true,
        isEditing: false,
        aspectRatio: false,
        sticks: ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml']
      }
    },
    'svg': {
      id: null,
      type: 'svg',
      value: '<?xml version="1.0" encoding="iso-8859-1"?><!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --><svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 480.164 480.164" style="enable-background:new 0 0 480.164 480.164;" xml:space="preserve"><g>	<g>		<path d="M464.164,232.082c-3.141,0.102-6.352,1.938-7.594,5.027l-7.133,17.84l-17.719-64.973c-0.875-3.199-3.633-5.527-6.93-5.855			c-3.359-0.359-6.461,1.422-7.945,4.383l-21.789,43.578h-12.249c11.185-22.096,17.194-46.638,17.194-72			c0-88.223-71.773-160-160-160s-160,71.777-160,160c0,25.371,6.015,49.92,17.206,72.021l-1.042-0.021			c-3.219,0.102-6.352,1.938-7.594,5.027l-7.133,17.84l-17.719-64.973c-0.875-3.199-3.633-5.527-6.93-5.855			c-3.391-0.359-6.461,1.422-7.945,4.383l-21.789,43.578H0v16h32c3.031,0,5.797-1.711,7.156-4.422l14.633-29.273l18.492,67.801			c0.906,3.316,3.828,5.684,7.266,5.883c0.148,0.008,0.305,0.012,0.453,0.012c3.258,0,6.211-1.98,7.43-5.027l13.945-34.863			l5.367,0.108c4.106,6.168,8.52,12.16,13.508,17.767c0.219,0.859,0.586,1.691,1.094,2.453			c26.258,39.383,27.789,47.543,32.344,71.77c0.844,4.449,1.773,9.391,2.953,15.078c2.036,9.923,7.845,18.002,15.669,23.056			c-2.702,3.883-4.31,8.58-4.31,13.659c0,8.523,4.497,15.975,11.211,20.233c-1.985,3.492-3.211,7.471-3.211,11.767			c0,8.523,4.497,15.975,11.211,20.233c-1.985,3.492-3.211,7.471-3.211,11.767c0,13.234,10.766,24,24,24h64			c13.234,0,24-10.766,24-24c0-4.296-1.226-8.274-3.211-11.767c6.714-4.259,11.211-11.71,11.211-20.233			c0-4.296-1.226-8.274-3.211-11.767c6.714-4.259,11.211-11.71,11.211-20.233c0-5.079-1.607-9.775-4.309-13.658			c7.824-5.052,13.632-13.125,15.668-23.037c1.18-5.707,2.109-10.648,2.953-15.098c4.555-24.227,6.086-32.387,32.344-71.77			c0.508-0.762,0.875-1.594,1.094-2.453c5.047-5.673,9.51-11.737,13.654-17.984H400c3.031,0,5.797-1.711,7.156-4.422l14.633-29.273			l18.492,67.801c0.906,3.316,3.828,5.684,7.266,5.883c0.148,0.008,0.305,0.012,0.453,0.012c3.258,0,6.211-1.98,7.43-5.027			l13.945-34.863l10.461,0.211l0.328-16L464.164,232.082z M272,464.082h-64c-4.414,0-8-3.59-8-8s3.586-8,8-8h64c4.414,0,8,3.59,8,8			S276.414,464.082,272,464.082z M280,432.082h-8h-64h-8c-4.414,0-8-3.59-8-8s3.586-8,8-8h80c4.414,0,8,3.59,8,8			S284.414,432.082,280,432.082z M288,400.082h-8h-80h-8c-4.414,0-8-3.59-8-8s3.586-8,8-8h96c4.414,0,8,3.59,8,8			S292.414,400.082,288,400.082z M344.898,258.59c-1.305,1.387-2.047,3.164-2.164,4.992c-25.586,38.84-27.563,49.379-32.148,73.75			c-0.82,4.359-1.734,9.207-2.898,14.824c-1.922,9.375-9.727,15.926-18.969,15.926H288h-14.468l21.176-120H304			c13.234,0,24-10.766,24-24v-32h24c4.422,0,8-3.582,8-8v-40c0-13.234-10.766-24-24-24v-24c0-13.234-10.766-24-24-24h-8			c0-13.234-10.766-24-24-24h-24c-4.422,0-8,3.582-8,8v184c0,4.418,3.578,8,8,8h22.468l-21.176,120h-34.583l-21.176-120H224			c4.422,0,8-3.582,8-8v-184c0-4.418-3.578-8-8-8h-24c-13.234,0-24,10.766-24,24h-8c-13.234,0-24,10.766-24,24v24			c-13.234,0-24,10.766-24,24v56c0,4.418,3.578,8,8,8h24v16c0,13.234,10.766,24,24,24h9.292l21.176,120H192h-0.719			c-9.242,0-17.047-6.551-18.969-15.945c-1.164-5.598-2.078-10.445-2.898-14.805c-4.586-24.371-6.563-34.91-32.148-73.75			c-0.117-1.828-0.859-3.605-2.164-4.992C109.883,231.879,96,196.898,96,160.082c0-79.402,64.602-144,144-144s144,64.598,144,144			C384,196.898,370.117,231.879,344.898,258.59z M296,136.082v-24c0-4.418-3.578-8-8-8h-24v-40h16c4.414,0,8,3.59,8,8v8			c0,4.418,3.578,8,8,8h16c4.414,0,8,3.59,8,8v32c0,4.418,3.578,8,8,8h8c4.414,0,8,3.59,8,8v32h-24h-32c-4.422,0-8,3.582-8,8v16h16			v-8h16v32c0,4.41-3.586,8-8,8h-40v-112h16v16H296z M160,160.082c-4.422,0-8,3.582-8,8v24h-16v-48c0-4.41,3.586-8,8-8h8			c4.422,0,8-3.582,8-8v-32c0-4.41,3.586-8,8-8h8v16h16v-24v-8c0-4.41,3.586-8,8-8h16v168h-40c-4.414,0-8-3.59-8-8v-24v-24h16v-16			H160z"/>	</g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>',
      bounds: {
        left: 0,
        top: 0,
        width: 40,
        height: 40,
        angle: 0
      },
      style: {
        color: '#FEFEFE'
      },
      editorData: {
        isResizable: true,
        isActive: false,
        hasActiveContent: false,
        isEditing: false,
        aspectRatio: true,
        sticks: ['br']
      }
    },
    'image': {
      id: null,
      type: 'image',
      value: '',
      bounds: {
        left: 0,
        top: 0,
        width: 40,
        height: 40,
        angle: 0
      },
      style: {},
      editorData: {
        isActive: true,
        hasActiveContent: false,
        isEditing: false,
        aspectRatio: true,
        sticks: ['br']
      }
    }
  },
  currentProductIndex: 0,
  currentVariantIndex: 0,
  textColors: [
    {
      code: '#6AF6FF'
    },
    {
      code: '#3A5DAB'
    },
    {
      code: '#2023A8'
    },
    {
      code: '#012F56'
    },
    {
      code: '#40263A'
    },
    {
      code: '#6B3076'
    },
    {
      code: '#BB19A1'
    },
    {
      code: '#9595D2'
    },

    {
      code: '#327FE0'
    },
    {
      code: '#E7B2C2'
    },
    {
      code: '#D58BC8'
    },
    {
      code: '#EE6078'
    },
    {
      code: '#EF4E97'
    },
    {
      code: '#CD1168'
    },
    {
      code: '#7E2E2C'
    },
    {
      code: '#AA2227'
    },
    {
      code: '#D1272F'
    },

    {
      code: '#E0513D'
    },
    {
      code: '#FE6917'
    },
    {
      code: '#FE8574'
    },
    {
      code: '#F2CEB3'
    },
    {
      code: '#EDD385'
    },
    {
      code: '#F5EA64'
    },
    {
      code: '#F2E41A'
    },
    {
      code: '#EFB229'
    },

    {
      code: '#CB890B'
    },
    {
      code: '#9D6938'
    },
    {
      code: '#664635'
    },
    {
      code: '#974755'
    },
    {
      code: '#D3B49E'
    },
    {
      code: '#AFA97E'
    },
    {
      code: '#00C6B1'
    },
    {
      code: '#70CB98'
    },

    {
      code: '#C1E08A'
    },
    {
      code: '#76D54E'
    },
    {
      code: '#1F8748'
    },
    {
      code: '#1F5632'
    },
    {
      code: '#005D5C'
    },
    {
      code: '#017580'
    },
    {
      code: '#93B6BA'
    },
    {
      code: '#FEFEFE'
    }
  ],
  fontSizes: [
    {
      label: '9px',
      value: '9px'
    },
    {
      label: '10px',
      value: '10px'
    },
    {
      label: '11px',
      value: '11px'
    },
    {
      label: '12px',
      value: '12px'
    },
    {
      label: '13px',
      value: '13px'
    },
    {
      label: '14px',
      value: '14px'
    },
    {
      label: '18px',
      value: '18px'
    },
    {
      label: '24px',
      value: '24px'
    },
    {
      label: '36px',
      value: '36px'
    },
    {
      label: '48px',
      value: '48px'
    },
    {
      label: '64px',
      value: '64px'
    },
    {
      label: '72px',
      value: '72px'
    },
    {
      label: '96px',
      value: '96px'
    },
    {
      label: '144px',
      value: '144px'
    },
    {
      label: '288px',
      value: '288px'
    }
  ],
  arts: [
    {
      label: 'Printree',
      value: '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.5 0C1.11929 0 0 1.11929 0 2.5V37.5C0 38.8807 1.11929 40 2.5 40H37.5C38.8807 40 40 38.8807 40 37.5V2.5C40 1.11929 38.8807 0 37.5 0H2.5ZM15.2785 5.63048V3H5.25V10.8453L34.8208 10.8453V3H24.0291V5.63048H15.2785ZM16.1127 12.6274H23.9581V36.7668H16.1127V12.6274ZM26.0702 27.4412V19.5958H34.8208V27.4412H26.0702Z"/></svg>'
    }
  ],
  webfonts: [
    {label: 'Lobster', value: 'Lobster'},
    {label: 'Comfortaa', value: 'Comfortaa'},
    {label: 'Righteous', value: 'Righteous'},
    {label: 'Patua One', value: 'Patua One'},
    {label: 'Afta Slab One', value: 'Afta Slab One'},
    {label: 'Concert One', value: 'Concert One'},
    {label: 'Lobster Two', value: 'Lobster Two'},
    {label: 'Baloo Chettan', value: 'Baloo Chettan'},
    {label: 'Fredoka One', value: 'Fredoka One'},
    {label: 'Special Elite', value: 'Special Elite'},
    {label: 'Luckiest Guy', value: 'Luckiest Guy'},
    {label: 'Passion One', value: 'Passion One'},
    {label: 'Bangers', value: 'Bangers'},
    {label: 'Lalezar', value: 'Lalezar'},
    {label: 'Baloo', value: 'Baloo'},
    {label: 'Monoton', value: 'Monoton'},
    {label: 'Playball', value: 'Playball'},
    {label: 'Press Start 2P', value: 'Press Start 2P'},
    {label: 'Fugaz One', value: 'Fugaz One'},
    {label: 'Fredericka the Great', value: 'Fredericka the Great'},
    {label: 'Patua', value: 'Patua'},
    {label: 'Bubblegum Sans', value: 'Bubblegum Sans'},
    {label: 'Shojumaru', value: 'Shojumaru'},
    {label: 'Bungee Inline', value: 'Bungee Inline'},
  ]
})

const getters = {
  webfonts(state) {
    return state.webfonts
  },
  selectedProducts(state){
    return state.selectedProducts
  },
  currentProductIndex(state){
    return state.currentProductIndex
  },
  currentVariantIndex(state) {
    return state.currentVariantIndex
  },
  textColors(state){
    return state.textColors
  },
  fontSizes(state) {
    return state.fontSizes
  },
  objectBoilerplates(state){
    return state.objectBoilerplates
  },
  arts(state){
    return state.arts
  },
  currentSide(state){
    return state.currentSide
  },
  availableProducts(state){
    return state.availableProducts
  },
  currentDesignId(state){
    return state.currentDesignId
  }
}

const mutations = {
  SELECTED_PRODUCTS(state, products){
    state.selectedProducts = products
  },
  CURRENT_PRODUCT_INDEX(state, index){
    state.currentProductIndex = index
  },
  CURRENT_VARIANT_INDEX(state, index) {
    state.currentVariantIndex = index
  },
  OBJECT_PROPERTIES(state, data){
    let objectIndex = _.findIndex(state.selectedProducts[state.currentProductIndex].variants[state.currentVariantIndex].printable_area[state.currentSide].objects, { id: data.id })
    _.set(state.selectedProducts[state.currentProductIndex].variants[state.currentVariantIndex].printable_area[state.currentSide].objects[objectIndex], data.path, data.value)
  },
  ADD_OBJECT(state, obj){
    _.map(state.selectedProducts[state.currentProductIndex].variants, (variant) => {
      obj = JSON.parse(JSON.stringify(obj))
      obj.style.color = ColorRegulator.getContrastOf(variant.color, { dark: '#012F56', light: '#FEFEFE' })
      variant.printable_area[state.currentSide].objects.push(obj)
    })
  },
  REMOVE_OBJECT_BY_INDEX(state, index) {
    _.map(state.selectedProducts[state.currentProductIndex].variants, (variant) => {
      variant.printable_area[state.currentSide].objects.splice(index, 1)
    })
  },
  OBJECT_FROM_VARIANT_INDEX(state, {index, obj}){
    let objectIndex = _.findIndex(state.selectedProducts[state.currentProductIndex].variants[index].printable_area[state.currentSide].objects, { id: obj.id })
    state.selectedProducts[state.currentProductIndex].variants[index].printable_area[state.currentSide].objects[objectIndex] = obj
  },
  ADD_VARIANT(state, variant){
    state.selectedProducts[state.currentProductIndex].variants.push(variant)
  },
  REMOVE_VARIANT_BY_INDEX(state, index){
    state.selectedProducts[state.currentProductIndex].variants.splice(index, 1)
  },
  WEBFONTS(state, webfonts){
    state.webfonts = webfonts
  },
  SWAP_OBJECT_INDEX(state, { currentIndex, newIndex }){
    let variant = state.selectedProducts[state.currentProductIndex].variants[state.currentVariantIndex]
    let tmp = variant.printable_area[state.currentSide].objects[currentIndex];
    variant.printable_area[state.currentSide].objects[currentIndex] = variant.printable_area[state.currentSide].objects[newIndex];
    variant.printable_area[state.currentSide].objects[newIndex] = tmp
  },
  CURRENT_SIDE(state, side){
    state.currentSide = side
  },
  AVAILABLE_PRODUCTS(state, products){
    state.availableProducts = products
  },
  ADD_AVAILABLE_PRODUCT(state, product){
    state.availableProducts.push(product)
  },
  CURRENT_DESIGN_ID(state, id){
    state.currentDesignId = id
  }
}

const actions = {
  addVariant(context, variant){
    let id = '_' + Math.random().toString(36).substr(2, 9)
    variant = {
      ...variant,
      id,
      printable_area: JSON.parse(JSON.stringify(context.state.selectedProducts[context.state.currentProductIndex].variants[0].printable_area))
    }
    _.map(variant.printable_area, (area) => {
      _.map(area.objects, (obj) => obj.style.color = ColorRegulator.getContrastOf(variant.color, { dark: '#012F56', light: '#FEFEFE' }))
    })
    context.commit('ADD_VARIANT', variant)
    return variant
  },
  removeVariant(context, variant){
    let variantIndex = _.findIndex(context.state.selectedProducts[context.state.currentProductIndex].variants, { color: variant.color })
    context.commit('REMOVE_VARIANT_BY_INDEX', variantIndex)
    return variantIndex
  },
  addObject(context, {type, value}){
    let id = '_' + Math.random().toString(36).substr(2, 9)
    let obj = JSON.parse(JSON.stringify(context.getters.objectBoilerplates[type]))
    let variant = context.state.selectedProducts[context.state.currentProductIndex].variants[context.state.currentVariantIndex]
    obj.id = id
    obj.value = value
    obj.bounds.left = obj.bounds.width / 2
    obj.bounds.top = obj.bounds.height / 2
    obj.style.color = ColorRegulator.getContrastOf(variant.color, { dark: '#012F56', light: '#FEFEFE' })
    obj.style.color = ColorRegulator.getContrastOf(variant.color, { dark: '#012F56', light: '#FEFEFE' })
    context.commit('ADD_OBJECT', obj)
    return obj
  },
  removeObject(context, obj){
    let index = _.findIndex(context.state.selectedProducts[context.state.currentProductIndex].variants[context.state.currentVariantIndex].printable_area[context.getters.currentSide].objects, { id: obj.id })
    if(index === -1) return
    context.commit('REMOVE_OBJECT_BY_INDEX', index)
    return index
  },
  copyPropsToAllVariantsFrom(context, obj){
    _.map(context.state.selectedProducts[context.state.currentProductIndex].variants, (variant, i) => {
      _.map(variant.printable_area[context.getters.currentSide].objects, (ob) => {
        if (ob.id == obj.id) context.commit('OBJECT_FROM_VARIANT_INDEX', {
          obj: JSON.parse(JSON.stringify({
            ...obj,
            style: {
              ...obj.style,
              color: ob.style.color
            },
            editorData: {
              ...ob.editorData,
              isActive: false
            }
          })), index: i})
      })
    })
  },
  duplicate(context, obj){
    let id = '_' + Math.random().toString(36).substr(2, 9)
    let newObject = {
      ...obj,
      id
    }
    context.commit('ADD_OBJECT', newObject)
    return newObject
  },
  moveObjectPosition(context, { obj, newIndex }){
    let currentIndex = _.findIndex(context.state.selectedProducts[context.state.currentProductIndex].variants[context.state.currentVariantIndex].printable_area[context.getters.currentSide].objects, { id: obj.id })
    context.commit('SWAP_OBJECT_INDEX', { currentIndex, newIndex })
    return context.state.selectedProducts[context.state.currentProductIndex].variants[context.state.currentVariantIndex].printable_area[context.getters.currentSide].objects
  },
  switchSideTo(context, side){
    if(side == context.getters.currentSide) return
    context.commit('CURRENT_SIDE', side)
  },
  setSelectedProducts(context, products){
    _.map(products, (product) => {
      if(!product.product_id){
        product.product_id = product.id
        product.id = '_' + Math.random().toString(36).substr(2, 9)
      }
    })
    context.commit('SELECTED_PRODUCTS', products)
  },
  async fetchAvailableProducts(context, data){
    const products = await db.fetchAvailableProducts()
    context.commit('AVAILABLE_PRODUCTS', products)
    return products
  },
  async fetchDesignData(context, id){
    const design = await db.getDesign(id)
    console.log(design.products)
    context.commit('SELECTED_PRODUCTS', design.products)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
