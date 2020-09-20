import ColorRegulator from "~/plugins/color-regulator";
import db from "~/plugins/lib/db/index";
import { scaleUp } from "~/plugins/scaler";

const state = () => ({
  currentSide: "front",
  designMeta: {
    id: null,
    name: null,
    uid: null,
    plan: "sell",
    printing_option: null,
    status: "draft",
  },
  availableProducts: [],
  selectedProducts: [],
  objectBoilerplates: {
    text: {
      id: null,
      name: null,
      type: "text",
      value: "TEXT",
      bounds: {
        left: 0,
        top: 0,
        width: scaleUp(80),
        height: scaleUp(20),
        angle: 0,
      },
      style: {
        fontFamily: "Lobster",
        fontWeight: "normal",
        fontStyle: "normal",
        textDecoration: "",
        color: "#FEFEFE",
        alignItems: "center",
        justifyContent: "center",
        fontSize: scaleUp(16),
        textAlign: "center",
      },
      editorData: {
        isResizable: false,
        isActive: false,
        hasActiveContent: true,
        isEditing: false,
        aspectRatio: false,
        sticks: ["tl", "tm", "tr", "mr", "br", "bm", "bl", "ml"],
      },
    },
    svg: {
      id: null,
      name: null,
      type: "svg",
      value: "",
      bounds: {
        left: 0,
        top: 0,
        width: scaleUp(40),
        height: scaleUp(40),
        angle: 0,
      },
      style: {
        color: "#FEFEFE",
      },
      editorData: {
        isResizable: true,
        isActive: false,
        hasActiveContent: false,
        isEditing: false,
        aspectRatio: true,
        sticks: ["br"],
      },
    },
    image: {
      id: null,
      name: null,
      type: "image",
      value: "",
      bounds: {
        left: 0,
        top: 0,
        width: scaleUp(40),
        height: scaleUp(40),
        angle: 0,
      },
      style: {},
      editorData: {
        isActive: true,
        hasActiveContent: false,
        isEditing: false,
        aspectRatio: true,
        sticks: ["br"],
      },
    },
  },
  currentProductIndex: 0,
  currentVariantIndex: 0,
  textColors: [
    {
      code: "#6AF6FF",
    },
    {
      code: "#3A5DAB",
    },
    {
      code: "#2023A8",
    },
    {
      code: "#012F56",
    },
    {
      code: "#40263A",
    },
    {
      code: "#6B3076",
    },
    {
      code: "#BB19A1",
    },
    {
      code: "#9595D2",
    },

    {
      code: "#327FE0",
    },
    {
      code: "#E7B2C2",
    },
    {
      code: "#D58BC8",
    },
    {
      code: "#EE6078",
    },
    {
      code: "#EF4E97",
    },
    {
      code: "#CD1168",
    },
    {
      code: "#7E2E2C",
    },
    {
      code: "#AA2227",
    },
    {
      code: "#D1272F",
    },

    {
      code: "#E0513D",
    },
    {
      code: "#FE6917",
    },
    {
      code: "#FE8574",
    },
    {
      code: "#F2CEB3",
    },
    {
      code: "#EDD385",
    },
    {
      code: "#F5EA64",
    },
    {
      code: "#F2E41A",
    },
    {
      code: "#EFB229",
    },

    {
      code: "#CB890B",
    },
    {
      code: "#9D6938",
    },
    {
      code: "#664635",
    },
    {
      code: "#974755",
    },
    {
      code: "#D3B49E",
    },
    {
      code: "#AFA97E",
    },
    {
      code: "#00C6B1",
    },
    {
      code: "#70CB98",
    },

    {
      code: "#C1E08A",
    },
    {
      code: "#76D54E",
    },
    {
      code: "#1F8748",
    },
    {
      code: "#1F5632",
    },
    {
      code: "#005D5C",
    },
    {
      code: "#017580",
    },
    {
      code: "#93B6BA",
    },
    {
      code: "#FEFEFE",
    },
  ],
  arts: [],
  webfonts: [
    { label: "Lobster", value: "Lobster" },
    { label: "Comfortaa", value: "Comfortaa" },
    { label: "Righteous", value: "Righteous" },
    { label: "Patua One", value: "Patua One" },
    { label: "Afta Slab One", value: "Afta Slab One" },
    { label: "Concert One", value: "Concert One" },
    { label: "Lobster Two", value: "Lobster Two" },
    { label: "Baloo Chettan", value: "Baloo Chettan" },
    { label: "Faster One", value: "Faster One" },
    { label: "Fredoka One", value: "Fredoka One" },
    { label: "Special Elite", value: "Special Elite" },
    { label: "Luckiest Guy", value: "Luckiest Guy" },
    { label: "Passion One", value: "Passion One" },
    { label: "Bangers", value: "Bangers" },
    { label: "Lalezar", value: "Lalezar" },
    { label: "Baloo", value: "Baloo" },
    { label: "Monoton", value: "Monoton" },
    { label: "Playball", value: "Playball" },
    { label: "Press Start 2P", value: "Press Start 2P" },
    { label: "Fugaz One", value: "Fugaz One" },
    { label: "Fredericka the Great", value: "Fredericka the Great" },
    { label: "Bubblegum Sans", value: "Bubblegum Sans" },
    { label: "Shojumaru", value: "Shojumaru" },
    { label: "Bungee Inline", value: "Bungee Inline" },
  ],
});

const getters = {
  webfonts(state) {
    return state.webfonts;
  },
  selectedProducts(state) {
    return state.selectedProducts;
  },
  currentProductIndex(state) {
    return state.currentProductIndex;
  },
  currentVariantIndex(state) {
    return state.currentVariantIndex;
  },
  textColors(state) {
    return state.textColors;
  },
  objectBoilerplates(state) {
    return state.objectBoilerplates;
  },
  arts(state) {
    return state.arts;
  },
  currentSide(state) {
    return state.currentSide;
  },
  availableProducts(state) {
    return state.availableProducts;
  },
  currentDesignId(state) {
    return state.designMeta.id;
  },
  currentDesignName(state) {
    return state.designMeta.name;
  },
  currentDesignStatus(state) {
    return state.designMeta.status;
  },
  designMeta(state) {
    return state.designMeta;
  },
};

const mutations = {
  ARTS(state, arts) {
    state.arts = arts;
  },
  SELECTED_PRODUCTS(state, products) {
    state.selectedProducts = products;
  },
  CURRENT_PRODUCT_INDEX(state, index) {
    state.currentProductIndex = index;
  },
  CURRENT_VARIANT_INDEX(state, index) {
    state.currentVariantIndex = index;
  },
  CURRENT_VARIANT_PROPERTIES(state, data) {
    _.set(
      state.selectedProducts[state.currentProductIndex].variants[
        state.currentVariantIndex
      ],
      data.path,
      data.value
    );
  },
  CURRENT_PRODUCT_META(state, { id, meta }) {
    state.selectedProducts[
      _.findIndex(state.selectedProducts, { id })
    ].meta = meta;
  },
  PRODUCT_PROPERTIES(state, { _id, props }) {
    let tmpProduct = JSON.parse(
      JSON.stringify(
        state.selectedProducts[_.findIndex(state.selectedProducts, { _id })]
      )
    );
    _.set(tmpProduct, props.path, props.value);
    state.selectedProducts[
      _.findIndex(state.selectedProducts, { _id })
    ] = tmpProduct;
  },
  OBJECT_PROPERTIES(state, data) {
    const sideContent = _.find(
      state.selectedProducts[state.currentProductIndex].variants[
        state.currentVariantIndex
      ].contents,
      { side: state.currentSide }
    );
    let objectIndex = _.findIndex(sideContent.objects, { id: data.id });
    _.set(sideContent.objects[objectIndex], data.path, data.value);
  },
  ADD_OBJECT(state, obj) {
    _.map(
      state.selectedProducts[state.currentProductIndex].variants,
      (variant) => {
        obj = JSON.parse(JSON.stringify(obj));
        obj.style.color = ColorRegulator.getContrastOf(
          variant.customizableVariant.color,
          {
            dark: "#012F56",
            light: "#FEFEFE",
          }
        );
        const sideContent = _.find(variant.contents, {
          side: state.currentSide,
        });
        sideContent.objects.push(obj);
      }
    );
  },
  REMOVE_OBJECT_BY_INDEX(state, index) {
    _.map(
      state.selectedProducts[state.currentProductIndex].variants,
      (variant) => {
        const sideContent = _.find(variant.contents, {
          side: state.currentSide,
        });
        sideContent.objects.splice(index, 1);
      }
    );
  },
  OBJECT_FROM_VARIANT_INDEX(state, { index, obj }) {
    const sideContent = _.find(
      state.selectedProducts[state.currentProductIndex].variants[index]
        .contents,
      { side: state.currentSide }
    );

    let objectIndex = _.findIndex(sideContent.objects, { id: obj.id });
    sideContent.objects[objectIndex] = obj;
  },
  ADD_VARIANT(state, variant) {
    state.selectedProducts[state.currentProductIndex].variants.push(variant);
  },
  REMOVE_VARIANT_BY_INDEX(state, index) {
    state.selectedProducts[state.currentProductIndex].variants.splice(index, 1);
  },
  WEBFONTS(state, webfonts) {
    state.webfonts = webfonts;
  },
  SWAP_OBJECT_INDEX(state, { currentIndex, newIndex }) {
    let variant =
      state.selectedProducts[state.currentProductIndex].variants[
        state.currentVariantIndex
      ];
    const sideContent = _.find(variant.contents, { side: state.currentSide });
    let tmp = sideContent.objects[currentIndex];
    sideContent.objects[currentIndex] = sideContent.objects[newIndex];
    sideContent.objects[newIndex] = tmp;
  },
  CURRENT_SIDE(state, side) {
    state.currentSide = side;
  },
  AVAILABLE_PRODUCTS(state, products) {
    state.availableProducts = products;
  },
  ADD_AVAILABLE_PRODUCT(state, product) {
    state.availableProducts.push(product);
  },
  CURRENT_DESIGN_ID(state, id) {
    state.designMeta.id = id;
  },
  DESIGN_NAME(state, name) {
    state.designMeta.name = name;
  },
  DESIGN_META(state, meta) {
    state.designMeta = meta;
  },
  DESIGN_PLAN(state, plan) {
    state.designMeta.plan = plan;
  },
  COLLECTION_STATUS(state, status) {
    state.designMeta.status = status;
  },
};

const actions = {
  addVariant(context, variant) {
    let sizes = {};
    _.map(variant.available_sizes, (size) => {
      sizes[size.name] = {
        quantity: 0,
        price: size.base_cost,
      };
    });
    variant = {
      ...variant,
      sizes,
      contents: _.map(variant.contents, (content) => {
        return {
          ..._.omit(content, "_id"),
          contents: JSON.parse(JSON.stringify(content.objects)),
        };
      }),
    };
    _.map(variant.contents, (area) => {
      _.map(
        area.objects,
        (obj) =>
          (obj.style.color = ColorRegulator.getContrastOf(
            variant.customizableVariant.color,
            {
              dark: "#012F56",
              light: "#FEFEFE",
            }
          ))
      );
    });
    context.commit("ADD_VARIANT", variant);
    return variant;
  },
  removeVariant(context, variant) {
    let variantIndex = _.findIndex(
      context.state.selectedProducts[context.state.currentProductIndex]
        .variants,
      { color: variant.customizableVariant.color }
    );
    context.commit("REMOVE_VARIANT_BY_INDEX", variantIndex);
    return variantIndex;
  },
  addObject(context, { type, value }) {
    let id =
      "_" +
      Math.random()
        .toString(36)
        .substr(2, 9);
    let obj = JSON.parse(
      JSON.stringify(context.getters.objectBoilerplates[type])
    );
    let variant =
      context.state.selectedProducts[context.state.currentProductIndex]
        .variants[context.state.currentVariantIndex];
    obj.id = id;
    obj.value = value;
    obj.bounds.left = obj.bounds.width / 2;
    obj.bounds.top = obj.bounds.height / 2;
    obj.style.color = ColorRegulator.getContrastOf(
      variant.customizableVariant.color,
      {
        dark: "#012F56",
        light: "#FEFEFE",
      }
    );
    obj.style.color = ColorRegulator.getContrastOf(
      variant.customizableVariant.color,
      {
        dark: "#012F56",
        light: "#FEFEFE",
      }
    );
    context.commit("ADD_OBJECT", obj);
    return obj;
  },
  removeObject(context, obj) {
    const sideContent = _.find(
      context.state.selectedProducts[context.state.currentProductIndex]
        .variants[context.state.currentVariantIndex].contents,
      { side: context.state.currentSide }
    );

    let index = _.findIndex(sideContent.objects, { id: obj.id });
    if (index === -1) return;
    context.commit("REMOVE_OBJECT_BY_INDEX", index);
    return index;
  },
  copyPropsToAllVariantsFrom(context, obj) {
    _.map(
      context.state.selectedProducts[context.state.currentProductIndex]
        .variants,
      (variant, i) => {
        const sideContent = _.find(variant.contents, {
          side: context.getters.currentSide,
        });
        _.map(sideContent.objects, (ob) => {
          if (ob.id == obj.id)
            context.commit("OBJECT_FROM_VARIANT_INDEX", {
              obj: JSON.parse(
                JSON.stringify({
                  ...obj,
                  style: {
                    ...obj.style,
                    color: ob.style.color,
                  },
                  editorData: {
                    ...ob.editorData,
                    isActive: false,
                  },
                })
              ),
              index: i,
            });
        });
      }
    );
  },
  duplicate(context, obj) {
    let id =
      "_" +
      Math.random()
        .toString(36)
        .substr(2, 9);
    let newObject = {
      ...obj,
      id,
    };
    context.commit("ADD_OBJECT", newObject);
    return newObject;
  },
  moveObjectPosition(context, { obj, newIndex }) {
    const sideContent = _.find(
      context.state.selectedProducts[context.state.currentProductIndex]
        .variants[context.state.currentVariantIndex].contents,
      { side: context.state.currentSide }
    );
    let currentIndex = _.findIndex(sideContent.objects, { id: obj.id });
    context.commit("SWAP_OBJECT_INDEX", { currentIndex, newIndex });
    let newObjects = sideContent.objects;
    context.commit("CURRENT_VARIANT_PROPERTIES", newObjects);
    return newObjects;
  },
  switchSideTo(context, side) {
    if (side == context.getters.currentSide) return;
    context.commit("CURRENT_SIDE", side);
  },
  setSelectedProducts(context, products) {
    context.commit("SELECTED_PRODUCTS", products);
  },
  async fetchAvailableProducts(context, data) {
    const products = await this.$api.fetchAvailableProducts();
    context.commit("AVAILABLE_PRODUCTS", products);
    return products;
  },
  async fetchArts(context) {
    const arts = await this.$api.getArts();
    context.commit("ARTS", arts);
  },
  async fetchDesignData(context, id) {
    const design = await db.getCollection(id);
    return design;
  },
  async fetchDesignDataAndCommit(context, id) {
    const collection = await this.$api.getCollection(id);
    context.commit("DESIGN_META", {
      id: collection._id,
      name: collection.name,
      user_id: collection.user_id,
      plan: collection.plan,
      status: collection.status,
    });
    context.commit("SELECTED_PRODUCTS", collection.products);
    return collection;
  },
  async createNewDesign(context, { user, products }) {
    const design = await this.$api.createDesignFor(products);
    context.commit("DESIGN_META", {
      id: design._id,
      name: design.name,
      user_id: design.user_id,
      plan: design.plan,
      status: design.status,
    });
    return design;
  },
  async saveData(context, params) {
    const defaultParams = {
      shouldGenerateImages: true,
    };

    const newParams = {
      ...defaultParams,
      ...params,
    };
    let generatedImages = [];
    try {
      const res = newParams.shouldGenerateImages
        ? await this.$axios.post("/api/create-images", {
            products: context.getters.selectedProducts,
          })
        : [];
      generatedImages = res.data || res;
      await this.$api.saveCollection({
        id: context.getters.currentDesignId,
        name: context.getters.designMeta.name,
        plan: context.getters.designMeta.plan,
        selectedProducts: context.getters.selectedProducts,
        status: context.getters.designMeta.status,
      });
    } catch (error) {
      console.log(error);
    }
    return generatedImages;
  },
  async generatePreview(context, collection) {
    const generatedImages = await this.$axios.post("/create-images", {
      products: collection.products,
    });
    return generatedImages;
  },
  async updateDesignName(context, name) {
    await db.updateDesignName(context.getters.currentDesignId, name);
    context.commit("DESIGN_NAME", name);
  },
  async publishCollection(context) {
    await db.updateCollection(context.getters.currentDesignId, {
      status: "pending",
    });
  },
  async deleteCollection(context, collectionId) {
    await db.deleteCollection(collectionId);
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
