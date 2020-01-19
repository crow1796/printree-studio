import ColorRegulator from '~/plugins/color-regulator'
import db from '~/plugins/lib/db/index'
import { scaleUp } from '~/plugins/scaler'

const state = () => ({
  currentSide: 'front',
  designMeta: {
    id: null,
    name: null,
    uid: null,
    plan: 'sell'
  },
  availableProducts: [],
  selectedProducts: [],
  objectBoilerplates: {
    text: {
      id: null,
      name: null,
      type: 'text',
      value: 'TEXT',
      bounds: {
        left: 0,
        top: 0,
        width: scaleUp(80),
        height: scaleUp(20),
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
        fontSize: scaleUp(16),
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
    svg: {
      id: null,
      name: null,
      type: 'svg',
      value: '',
      bounds: {
        left: 0,
        top: 0,
        width: scaleUp(40),
        height: scaleUp(40),
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
    image: {
      id: null,
      name: null,
      type: 'image',
      value: '',
      bounds: {
        left: 0,
        top: 0,
        width: scaleUp(40),
        height: scaleUp(40),
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
  arts: [],
  webfonts: [
    { label: 'Lobster', value: 'Lobster' },
    { label: 'Comfortaa', value: 'Comfortaa' },
    { label: 'Righteous', value: 'Righteous' },
    { label: 'Patua One', value: 'Patua One' },
    { label: 'Afta Slab One', value: 'Afta Slab One' },
    { label: 'Concert One', value: 'Concert One' },
    { label: 'Lobster Two', value: 'Lobster Two' },
    { label: 'Baloo Chettan', value: 'Baloo Chettan' },
    { label: 'Faster One', value: 'Faster One' },
    { label: 'Fredoka One', value: 'Fredoka One' },
    { label: 'Special Elite', value: 'Special Elite' },
    { label: 'Luckiest Guy', value: 'Luckiest Guy' },
    { label: 'Passion One', value: 'Passion One' },
    { label: 'Bangers', value: 'Bangers' },
    { label: 'Lalezar', value: 'Lalezar' },
    { label: 'Baloo', value: 'Baloo' },
    { label: 'Monoton', value: 'Monoton' },
    { label: 'Playball', value: 'Playball' },
    { label: 'Press Start 2P', value: 'Press Start 2P' },
    { label: 'Fugaz One', value: 'Fugaz One' },
    { label: 'Fredericka the Great', value: 'Fredericka the Great' },
    { label: 'Patua One', value: 'Patua One' },
    { label: 'Bubblegum Sans', value: 'Bubblegum Sans' },
    { label: 'Shojumaru', value: 'Shojumaru' },
    { label: 'Bungee Inline', value: 'Bungee Inline' }
  ]
})

const getters = {
  webfonts(state) {
    return state.webfonts
  },
  selectedProducts(state) {
    return state.selectedProducts
  },
  currentProductIndex(state) {
    return state.currentProductIndex
  },
  currentVariantIndex(state) {
    return state.currentVariantIndex
  },
  textColors(state) {
    return state.textColors
  },
  objectBoilerplates(state) {
    return state.objectBoilerplates
  },
  arts(state) {
    return state.arts
  },
  currentSide(state) {
    return state.currentSide
  },
  availableProducts(state) {
    return state.availableProducts
  },
  currentDesignId(state) {
    return state.designMeta.id
  },
  currentDesignName(state) {
    return state.designMeta.name
  },
  designMeta(state) {
    return state.designMeta
  }
}

const mutations = {
  ARTS(state, arts) {
    state.arts = arts
  },
  SELECTED_PRODUCTS(state, products) {
    state.selectedProducts = products
  },
  CURRENT_PRODUCT_INDEX(state, index) {
    state.currentProductIndex = index
  },
  CURRENT_VARIANT_INDEX(state, index) {
    state.currentVariantIndex = index
  },
  CURRENT_VARIANT_PROPERTIES(state, data) {
    _.set(
      state.selectedProducts[state.currentProductIndex].variants[
        state.currentVariantIndex
      ],
      data.path,
      data.value
    )
  },
  CURRENT_PRODUCT_META(state, meta) {
    state.selectedProducts[state.currentProductIndex].meta = meta
  },
  OBJECT_PROPERTIES(state, data) {
    let objectIndex = _.findIndex(
      state.selectedProducts[state.currentProductIndex].variants[
        state.currentVariantIndex
      ].printable_area[state.currentSide].objects,
      { id: data.id }
    )
    _.set(
      state.selectedProducts[state.currentProductIndex].variants[
        state.currentVariantIndex
      ].printable_area[state.currentSide].objects[objectIndex],
      data.path,
      data.value
    )
  },
  ADD_OBJECT(state, obj) {
    _.map(
      state.selectedProducts[state.currentProductIndex].variants,
      variant => {
        obj = JSON.parse(JSON.stringify(obj))
        obj.style.color = ColorRegulator.getContrastOf(variant.color, {
          dark: '#012F56',
          light: '#FEFEFE'
        })
        variant.printable_area[state.currentSide].objects.push(obj)
      }
    )
  },
  REMOVE_OBJECT_BY_INDEX(state, index) {
    _.map(
      state.selectedProducts[state.currentProductIndex].variants,
      variant => {
        variant.printable_area[state.currentSide].objects.splice(index, 1)
      }
    )
  },
  OBJECT_FROM_VARIANT_INDEX(state, { index, obj }) {
    let objectIndex = _.findIndex(
      state.selectedProducts[state.currentProductIndex].variants[index]
        .printable_area[state.currentSide].objects,
      { id: obj.id }
    )
    state.selectedProducts[state.currentProductIndex].variants[
      index
    ].printable_area[state.currentSide].objects[objectIndex] = obj
  },
  ADD_VARIANT(state, variant) {
    state.selectedProducts[state.currentProductIndex].variants.push(variant)
  },
  REMOVE_VARIANT_BY_INDEX(state, index) {
    state.selectedProducts[state.currentProductIndex].variants.splice(index, 1)
  },
  WEBFONTS(state, webfonts) {
    state.webfonts = webfonts
  },
  SWAP_OBJECT_INDEX(state, { currentIndex, newIndex }) {
    let variant =
      state.selectedProducts[state.currentProductIndex].variants[
        state.currentVariantIndex
      ]
    let tmp = variant.printable_area[state.currentSide].objects[currentIndex]
    variant.printable_area[state.currentSide].objects[currentIndex] =
      variant.printable_area[state.currentSide].objects[newIndex]
    variant.printable_area[state.currentSide].objects[newIndex] = tmp
  },
  CURRENT_SIDE(state, side) {
    state.currentSide = side
  },
  AVAILABLE_PRODUCTS(state, products) {
    state.availableProducts = products
  },
  ADD_AVAILABLE_PRODUCT(state, product) {
    state.availableProducts.push(product)
  },
  CURRENT_DESIGN_ID(state, id) {
    state.designMeta.id = id
  },
  DESIGN_NAME(state, name) {
    state.designMeta.name = name
  },
  DESIGN_META(state, meta) {
    state.designMeta = meta
  },
  DESIGN_PLAN(state, plan) {
    state.designMeta.plan = plan
  }
}

const actions = {
  addVariant(context, variant) {
    let sizes = {}
    _.map(variant.available_sizes, size => {
      sizes[size.name] = {
        quantity: 0,
        price: size.base_cost
      }
    })
    variant = {
      ...variant,
      sizes,
      printable_area: JSON.parse(
        JSON.stringify(
          context.state.selectedProducts[context.state.currentProductIndex]
            .variants[0].printable_area
        )
      )
    }
    _.map(variant.printable_area, area => {
      _.map(
        area.objects,
        obj =>
          (obj.style.color = ColorRegulator.getContrastOf(variant.color, {
            dark: '#012F56',
            light: '#FEFEFE'
          }))
      )
    })
    context.commit('ADD_VARIANT', variant)
    return variant
  },
  removeVariant(context, variant) {
    let variantIndex = _.findIndex(
      context.state.selectedProducts[context.state.currentProductIndex]
        .variants,
      { color: variant.color }
    )
    context.commit('REMOVE_VARIANT_BY_INDEX', variantIndex)
    return variantIndex
  },
  addObject(context, { type, value }) {
    let id =
      '_' +
      Math.random()
        .toString(36)
        .substr(2, 9)
    let obj = JSON.parse(
      JSON.stringify(context.getters.objectBoilerplates[type])
    )
    let variant =
      context.state.selectedProducts[context.state.currentProductIndex]
        .variants[context.state.currentVariantIndex]
    obj.id = id
    obj.value = value
    obj.bounds.left = obj.bounds.width / 2
    obj.bounds.top = obj.bounds.height / 2
    obj.style.color = ColorRegulator.getContrastOf(variant.color, {
      dark: '#012F56',
      light: '#FEFEFE'
    })
    obj.style.color = ColorRegulator.getContrastOf(variant.color, {
      dark: '#012F56',
      light: '#FEFEFE'
    })
    context.commit('ADD_OBJECT', obj)
    return obj
  },
  removeObject(context, obj) {
    let index = _.findIndex(
      context.state.selectedProducts[context.state.currentProductIndex]
        .variants[context.state.currentVariantIndex].printable_area[
        context.getters.currentSide
      ].objects,
      { id: obj.id }
    )
    if (index === -1) return
    context.commit('REMOVE_OBJECT_BY_INDEX', index)
    return index
  },
  copyPropsToAllVariantsFrom(context, obj) {
    _.map(
      context.state.selectedProducts[context.state.currentProductIndex]
        .variants,
      (variant, i) => {
        _.map(
          variant.printable_area[context.getters.currentSide].objects,
          ob => {
            if (ob.id == obj.id)
              context.commit('OBJECT_FROM_VARIANT_INDEX', {
                obj: JSON.parse(
                  JSON.stringify({
                    ...obj,
                    style: {
                      ...obj.style,
                      color: ob.style.color
                    },
                    editorData: {
                      ...ob.editorData,
                      isActive: false
                    }
                  })
                ),
                index: i
              })
          }
        )
      }
    )
  },
  duplicate(context, obj) {
    let id =
      '_' +
      Math.random()
        .toString(36)
        .substr(2, 9)
    let newObject = {
      ...obj,
      id
    }
    context.commit('ADD_OBJECT', newObject)
    return newObject
  },
  moveObjectPosition(context, { obj, newIndex }) {
    let currentIndex = _.findIndex(
      context.state.selectedProducts[context.state.currentProductIndex]
        .variants[context.state.currentVariantIndex].printable_area[
        context.getters.currentSide
      ].objects,
      { id: obj.id }
    )
    context.commit('SWAP_OBJECT_INDEX', { currentIndex, newIndex })
    let newObjects =
      context.state.selectedProducts[context.state.currentProductIndex]
        .variants[context.state.currentVariantIndex].printable_area[
        context.getters.currentSide
      ].objects
    context.commit('CURRENT_VARIANT_PROPERTIES', newObjects)
    return newObjects
  },
  switchSideTo(context, side) {
    if (side == context.getters.currentSide) return
    context.commit('CURRENT_SIDE', side)
  },
  setSelectedProducts(context, products) {
    context.commit('SELECTED_PRODUCTS', products)
  },
  async fetchAvailableProducts(context, data) {
    const products = await db.fetchAvailableProducts()
    context.commit('AVAILABLE_PRODUCTS', products)
    return products
  },
  async fetchDesignData(context, id) {
    const design = await db.getDesign(id)
    const arts = await db.getArts()
    context.commit('DESIGN_META', {
      id: design.id,
      name: design.name,
      user_id: design.user_id,
      plan: design.plan
    })
    context.commit('SELECTED_PRODUCTS', design.products)
    context.commit('ARTS', arts)
    return design
  },
  async createNewDesign(context, { user, products }) {
    const design = await db.createDesignFor(user, products)
    context.commit('DESIGN_META', {
      id: design.id,
      name: design.name,
      user_id: design.user_id,
      plan: design.plan
    })
    return design
  },
  async saveData(context, params) {
    const defaultParams = {
      shouldGenerateImages: true
    }

    const newParams = {
      ...defaultParams,
      ...params
    }
    let generatedImages = []
    try {
      const res = newParams.shouldGenerateImages
        ? await this.$axios.post('http://localhost:8080/create-images', {
            products: context.getters.selectedProducts
          })
        : []
      generatedImages = res.data || res
      await db.saveCollection({
        id: context.getters.currentDesignId,
        plan: context.getters.designMeta.plan,
        selectedProducts: context.getters.selectedProducts
      })
    } catch (error) {
      console.log(error)
    }
    return generatedImages
  },
  async updateDesignName(context, name) {
    await db.updateDesignName(context.getters.currentDesignId, name)
    context.commit('DESIGN_NAME', name)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
