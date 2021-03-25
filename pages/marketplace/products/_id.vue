<template>
  <div class="container mx-auto pb-16 pt-0 relative min-h-area-loader">
    <AreaLoader v-if="isLoading" class="my-2" />
    <div v-if="product" :key="product._id">
      <div class="flex justify-between items-center mb-12">
        <div>
          <BreadCrumbs
            home-link="/marketplace"
            :items="[{
          title: 'Products',
          link: '/marketplace/products'
          }, {
            title: product.parent_collection.name,
            link: `/marketplace/collections/${product.parent_collection._id}`
          }, {
          title: product.meta.name,
          active: true
        }]"
          />
        </div>
      </div>
      <div class="flex lg:flex-row flex-col">
        <div class="flex sm:w-6/12 flex-col w-full p-2 sm:p-2">
          <div class="flex flex-start">
            <ZoomOnHover :img="thumbnails[selectedThumbnailIndex][selectedSide]" />
          </div>
          <div
            class="flex flex-wrap"
          >
            <div
              class="cursor-pointer border hover:border-primary p-2 rounded flex justify-center items-center mr-2 mb-2 w-24"
              :class="{'border-primary': i === selectedThumbnailIndex}"
              v-for="(thumb, i) in thumbnails"
              :key="i"
              @click="selectedThumbnailIndex = i"
            >
              <progressive-img :src="thumb[frontOrFirst]" class="lg:w-24 sm:w-16" />
            </div>
          </div>
        </div>
        <div class="flex lg:w-6/12 sm:w-full p-2 sm:p-2">
          <div class="flex flex-grow flex-col">
            <div class="text-xs mb-2">
              <span
                class="bg-primary-lighter rounded px-2 py-1 text-white"
              >{{ product.parent_collection.name }}</span>
            </div>
            <h1 class="text-3xl font-bold leading-none">{{ product.meta.name }}</h1>
            <h2 class="text-xl">
              <number
                :to="selectedVariantSizePrice"
                :format="(num) => num.formatMoney('₱ ')"
                :duration=".4"
              />
            </h2>
            <div class="font-bold mt-3">COLOR</div>
            <div class="mt-2 flex">
              <div
                class="w-10 h-10 rounded flex justify-center items-center cursor-pointer border hover:shadow mr-1"
                v-for="variant in product.variants"
                :key="variant.id"
                :style="{backgroundColor: variant.customizableVariant.color}"
                @click="selectVariant(variant)"
              >
                <font-awesome-icon
                  :style="{color: getContrastOf(variant.customizableVariant.color)}"
                  :icon="['fas', 'check']"
                  v-if="selectedVariant._id === variant._id"
                />
              </div>
            </div>
            <div class="font-bold mt-3">SIZE</div>
            <div class="mt-2 flex">
              <div
                class="w-10 h-10 rounded flex justify-center items-center font-bold text-xs mr-1 border cursor-pointer hover:border-primary hover:text-primary"
                v-for="(size, i) in selectedVariant.sizes"
                :class="{'text-primary border-primary': selectedSize === size.name}"
                :key="i"
                @click="() => selectedSize = size.name"
              >{{size.name}}</div>
            </div>
            <!-- <div
              class="text-xs text-red-600 font-bold mt-2"
            >Only {{ selectedVariant.sizes[selectedSize].quantity }} stock(s) left!</div>-->
            <div class="font-bold mt-3">QUANTITY</div>
            <div class="mt-2 flex">
              <VueNumericInput
                align="center"
                style="width: 90px; height: 40px;"
                :min="1"
                v-model="quantity"
              />
            </div>
            <div class="mt-3">
              <button
                type="button"
                class="border border-white bg-primary px-8 py-4 font-bold rounded text-white hover:bg-primary-lighter w-full sm:w-7/12"
                @click="addToCart"
              >
                <span v-if="!isAddingToCart">ADD TO CART</span>
                <span v-if="isAddingToCart">
                  <font-awesome-icon :icon="['fas', 'spinner']" class="fa-spin" />
                </span>
              </button>
            </div>
            <div>
              <div class="my-10" v-if="product.meta.description">{{ product.meta.description }}</div>
              <div v-html="product.customizableProduct.preDescription"></div>
            </div>
            <div class="flex items-center mt-8">
              <div class="mr-2 font-bold">Share this product on</div>
              <ShareNetwork
                network="facebook"
                :url="currentUrl"
                title="Hey guys! Check out this product"
                class="cursor-pointer hover:text-primary mx-2"
              >
                <font-awesome-icon :icon="['fab', 'facebook-f']" />
              </ShareNetwork>
              <ShareNetwork
                network="twitter"
                :url="currentUrl"
                title="Hey guys! Check out this product"
                class="cursor-pointer hover:text-primary mx-2"
              >
                <font-awesome-icon :icon="['fab', 'twitter']" />
              </ShareNetwork>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col lg:pt-16 sm:pt-6">
        <div class="flex lg:px-8 font-bold">
          <div class="w-full lg:text-left sm:text-center">YOU MAY ALSO LIKE</div>
        </div>
        <ProductsGrid :products="otherCollectionProducts" />
      </div>
    </div>
  </div>
</template>

<script>
import VueNumericInput from "@/components/VueNumericInput";
import ProductsGrid from "@/components/ProductsGrid";
import ZoomOnHover from "@/components/ZoomOnHover/index";
import VueTailwindModal from "@/components/VueTailwindModal";
import BreadCrumbs from "@/components/BreadCrumbs";
import ColorRegulator from "~/plugins/color-regulator";
import { mapGetters } from "vuex";
import { priceWithVatCeil } from "@/plugins/price-calculator";

export default {
  layout: "marketplace",
  components: {
    ProductsGrid,
    VueNumericInput,
    ZoomOnHover,
    VueTailwindModal,
    BreadCrumbs,
  },
  head(){
    return {
      title: `${this.product?.meta?.name || ''} | Printree Studio`
    }
  },
  async mounted() {
    const res = await this.$store.dispatch(
      "marketplace/getProductsToSell",
      this.query
    );
    if (!res.length) return;
    this.product = _.first(res);
    this.selectedVariant = _.first(this.product.variants);
    this.selectedSize = _.first(this.selectedVariant.sizes).name;
    this._setDisplayMeta();

    this.otherQuery.collectionId = this.product.parent_collection._id;
    this.otherCollectionProducts = await this.$store.dispatch(
      "marketplace/getProductsToSell",
      this.otherQuery
    );

    this.isLoading = false;
  },
  data() {
    return {
      isLoading: true,
      product: null,
      selectedVariant: null,
      selectedSize: null,
      thumbnails: [],
      sides: [],
      selectedThumbnailIndex: 0,
      selectedSide: null,
      otherCollectionProducts: [],
      quantity: 1,
      selectedColor: "#ffffff",
      isAddingToCart: false,
      query: {
        plan: ["Sell"],
        status: ["approved"],
        id: this.$route.params.id,
      },
      otherQuery: {
        plan: ["Sell"],
        status: ["approved"],
        productStatus: ["approved"],
        collectionId: null,
        id: this.$route.params.id,
        pagination: {
          limit: 5,
          page: 0,
        },
      },
    };
  },
  computed: {
    ...mapGetters({
      isLoggedIn: "isLoggedIn",
      user: "user",
    }),
    currentUrl() {
      return window.location.href;
    },
    frontOrFirst() {
      return _.includes(this.sides, "front") ? "front" : this.sides[0];
    },
    selectedVariantSizePrice() {
      const size = _.find(this.selectedVariant.sizes, {
        name: this.selectedSize,
      });
      const preTotal = size.approvedPrice + size.approvedBaseCost;
      return priceWithVatCeil(preTotal);
    },
  },
  methods: {
    _setDisplayMeta() {
      let tmpThumbnails = [];
      this.sides = _.map(this.selectedVariant.contents, "printableArea.side");

      _.map(this.product.variants, (variant, i) => {
        if (!tmpThumbnails[i]) tmpThumbnails.push({});
        _.map(this.selectedVariant.contents, (content) => {
          tmpThumbnails[i][content.printableArea.side] = content.fullThumb;
        });
      });

      this.selectedSide = this.frontOrFirst;
      this.thumbnails = tmpThumbnails;
    },
    async addToCart() {
      if (!this.isLoggedIn) {
        document.getElementById("get-started-btn").click();
        return;
      }
      if (this.isAddingToCart) return;
      this.isAddingToCart = true;
      const item = {
        variant: this.selectedVariant._id,
        quantity: this.quantity || 1,
        size: this.selectedSize,
      };
      await this.$store.dispatch("marketplace/addToCart", item);
      this.$toast.success("Added to cart successfully.", {
        position: "bottom",
      });

      // Find parent with authmodal
      let parent = this.$parent;
      while (!parent.$refs.cartDrawer) {
        parent = parent.$parent;
      }
      parent.$refs.cartDrawer.show();

      this.isAddingToCart = false;
    },
    getContrastOf(color) {
      return ColorRegulator.getContrastOf(color);
    },
    selectVariant(variant) {
      this.selectedVariant = variant;
      this._setDisplayMeta();
    },
  },
};
</script>