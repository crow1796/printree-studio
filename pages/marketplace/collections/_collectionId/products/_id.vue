<template>
  <div class="container mx-auto pb-16 pt-0 relative min-h-area-loader">
    <AreaLoader v-if="isLoading" class="my-2" />
    <div v-if="product">
      <VueTailwindModal
        ref="addedToCartModal"
        width="35%"
        content-class="rounded-none shadow-none text-gray-600"
      >
        <div class="flex flex-col">
          <div class="modal-heading border-b w-full p-4">
            <div class="text-center uppercase font-bold text-primary">
              <span>Added to cart</span>
              <span class="ml-2">
                <font-awesome-icon :icon="['fas', 'check-circle']" />
              </span>
            </div>
          </div>
          <div
            class="modal-body p-4 text-center"
          >This item has been added to your cart successfully.</div>
          <div class="flex modal-footer justify-between flex-shrink p-4 border-t items-center">
            <button
              type="button"
              class="justify-center items-center focus:outline-none outline-none px-3 py-2 font-bold text-blue-400 hover:text-blue-600"
              @click="$refs.addedToCartModal.hide()"
            >Continue Shopping</button>

            <nuxt-link
              class="shadow-xl border border-white bg-primary px-8 py-2 font-bold rounded text-white hover:bg-primary-lighter"
              to="/marketplace/checkout/shipping"
            >Go to Checkout</nuxt-link>
          </div>
        </div>
      </VueTailwindModal>
      <BreadCrumbs
        :items="[{
      title: 'Products',
      link: '/marketplace/products'
    }, {
      title: product.category,
      link: `/marketplace/category/${product.categoryId}`
    }, {
      title: product.collectionName,
      link: `/marketplace/collections/${product.collectionId}`
    }, {
      title: product.name,
      active: true
    }]"
      />
      <div class="flex lg:flex-row sm:flex-col">
        <div class="flex lg:w-6/12 sm:w-full p-2 sm:p-2 lg:flex-row sm:flex-col">
          <div
            class="flex lg:flex-col sm:flex-row lg:w-3/12 sm:w-full lg:px-2 sm:px-0 overflow-auto sm:mb-4"
          >
            <div
              class="cursor-pointer border hover:border-primary p-2 rounded flex justify-center items-center lg:mb-2 sm:mr-2"
              :class="{'border-primary': i === selectedThumbnailIndex}"
              v-for="(thumb, i) in thumbnails"
              :key="i"
              @click="selectedThumbnailIndex = i"
            >
              <progressive-img :src="thumb[frontOrFirst]" class="lg:w-24 sm:w-16" />
            </div>
          </div>
          <div class="flex lg:w-9/12 sm:w-full">
            <ZoomOnHover :img="thumbnails[selectedThumbnailIndex][selectedSide]" />
          </div>
        </div>
        <div class="flex lg:w-6/12 sm:w-full p-2 sm:p-2">
          <div class="flex flex-grow flex-col">
            <div class="text-xs mb-2">
              <span
                class="bg-primary-lighter rounded px-2 py-1 text-white"
              >{{ product.collectionName }}</span>
            </div>
            <h1 class="text-3xl font-bold leading-none">{{ product.name }}</h1>
            <h2 class="text-xl">{{ product.price.formatMoney('₱ ') }}</h2>
            <div class="mt-3" v-if="product.description">{{ product.description }}</div>
            <div class="font-bold mt-3">COLOR</div>
            <div class="mt-2 flex">
              <div
                class="w-10 h-10 rounded flex justify-center items-center cursor-pointer border hover:shadow mr-1"
                v-for="variant in product.variants"
                :key="variant.id"
                :style="{backgroundColor: variant.color}"
                @click="selectVariant(variant)"
              >
                <font-awesome-icon
                  :style="{color: getContrastOf(variant.color)}"
                  :icon="['fas', 'check']"
                  v-if="selectedVariant.id === variant.id"
                />
              </div>
            </div>
            <div class="font-bold mt-3">SIZE</div>
            <div class="mt-2 flex">
              <div
                class="w-10 h-10 rounded flex justify-center items-center font-bold text-xs mr-1 border"
                v-for="(size, i) in selectedVariant.sizes"
                :class="{'opacity-50': !size.quantity, 'cursor-pointer hover:border-primary hover:text-primary': size.quantity, 'text-primary border-primary': i === selectedSize}"
                :key="i"
                @click="() => size.quantity ? selectedSize = i : false"
              >{{i}}</div>
            </div>
            <div
              class="text-xs text-red-600 font-bold mt-2"
            >Only {{ selectedVariant.sizes[selectedSize].quantity }} stock(s) left!</div>
            <div class="font-bold mt-3">QUANTITY</div>
            <div class="mt-2 flex">
              <VueNumericInput
                align="center"
                style="width: 90px; height: 40px;"
                :min="1"
                v-model="quantity"
                :max="selectedVariant.sizes[selectedSize].quantity"
              />
            </div>
            <div class="mt-3">
              <button
                type="button"
                class="border border-white bg-primary px-8 py-4 font-bold rounded text-white hover:bg-primary-lighter w-full"
                @click="addToCart"
              >ADD TO CART</button>
            </div>
          </div>
        </div>
      </div>
      <!-- Other collection products START-->
      <div class="flex flex-col lg:pt-16 sm:pt-6">
        <div class="flex lg:px-8 font-bold">
          <div class="w-full lg:text-left sm:text-center">OTHER PRODUCTS IN THIS COLLECTION</div>
        </div>
        <ProductsGrid :products="otherCollectionProducts" />
      </div>
      <!-- Other collection products END -->
    </div>
  </div>
</template>

<script>
import VueNumericInput from '@/components/VueNumericInput'
import ProductsGrid from '@/components/ProductsGrid'
import ZoomOnHover from '@/components/ZoomOnHover/index'
import VueTailwindModal from '@/components/VueTailwindModal'
import BreadCrumbs from '@/components/BreadCrumbs'
import ColorRegulator from '~/plugins/color-regulator'
import { mapGetters } from 'vuex'

export default {
  layout: 'marketplace',
  components: {
    ProductsGrid,
    VueNumericInput,
    ZoomOnHover,
    VueTailwindModal,
    BreadCrumbs
  },
  async created() {
    this.product = await this.$store.dispatch(
      'marketplace/getProductFromCollection',
      {
        collection: this.$route.params.collectionId,
        product: this.$route.params.id
      }
    )
    this.selectedVariant = _.first(this.product.variants)
    this.selectedSize = _.first(
      _.filter(
        _.keys(this.selectedVariant.sizes),
        k => this.selectedVariant.sizes[k].quantity
      )
    )
    this.thumbnails = _.map(this.product.variants, 'thumbnails')
    this.sides = _.keys(this.selectedVariant.thumbnails)
    this.selectedSide = this.frontOrFirst
    this.isLoading = false
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
      otherCollectionProducts: [
        {
          id: 1,
          name: 'Printree T-Shirt',
          collectionName: 'Printree Uniforms',
          price: 499,
          thumbnail:
            'https://user-images.githubusercontent.com/2805249/64069899-8bdaa180-cc97-11e9-9b19-1a9e1a254c18.png'
        },
        {
          id: 2,
          name: 'Printree T-Shirt',
          collectionName: 'Printree Uniforms',
          price: 499,
          thumbnail:
            'https://user-images.githubusercontent.com/2805249/64069899-8bdaa180-cc97-11e9-9b19-1a9e1a254c18.png'
        },
        {
          id: 3,
          name: 'Printree T-Shirt',
          collectionName: 'Printree Uniforms',
          price: 499,
          thumbnail:
            'https://user-images.githubusercontent.com/2805249/64069899-8bdaa180-cc97-11e9-9b19-1a9e1a254c18.png'
        },
        {
          id: 4,
          name: 'Printree T-Shirt',
          collectionName: 'Printree Uniforms',
          price: 499,
          thumbnail:
            'https://user-images.githubusercontent.com/2805249/64069899-8bdaa180-cc97-11e9-9b19-1a9e1a254c18.png'
        }
      ],
      quantity: 1,
      selectedSize: 'xs',
      selectedColor: '#ffffff'
    }
  },
  computed: {
    ...mapGetters({
      'user': 'user/user'
    }),
    frontOrFirst() {
      return _.includes(this.sides, 'front') ? 'front' : this.sides[0]
    }
  },
  methods: {
    async addToCart() {
      const item = {
        variant: this.selectedVariant,
        quantity: this.quantity,
        size: this.selectedSize
      }
      await this.$store.dispatch('marketplace/addToCartOf', {
        item,
        user: this.user
      })
      this.$refs.addedToCartModal.show()
    },
    getContrastOf(color) {
      return ColorRegulator.getContrastOf(color)
    },
    selectVariant(variant) {
      this.selectedVariant = variant
      this.sides = _.keys(variant.thumbnails)
      this.selectedSize = _.first(
        _.filter(_.keys(variant.sizes), k => variant.sizes[k].quantity)
      )
      this.selectedSide = this.frontOrFirst
    }
  }
}
</script>