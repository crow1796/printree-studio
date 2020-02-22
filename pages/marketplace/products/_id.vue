<template>
  <div class="container mx-auto pb-16 pt-0">
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
        <div class="modal-body p-4 text-center">This item has been added to your cart successfully.</div>
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
    <BreadCrumbs :items="[{
      title: 'Products',
      link: '/marketplace/products'
    }, {
      title: 'Category',
      link: '/marketplace/category'
    }, {
      title: 'Product Name',
      active: true
    }]"/>
    <div class="flex lg:flex-row sm:flex-col">
      <div class="flex lg:w-6/12 sm:w-full p-2 sm:p-2 lg:flex-row sm:flex-col">
        <div
          class="flex lg:flex-col sm:flex-row lg:w-3/12 sm:w-full lg:px-2 sm:px-0 overflow-auto sm:mb-4"
        >
          <div
            class="cursor-pointer border hover:border-primary p-2 rounded flex justify-center items-center lg:mb-2 sm:mr-2"
          >
            <img
              src="https://user-images.githubusercontent.com/2805249/64069899-8bdaa180-cc97-11e9-9b19-1a9e1a254c18.png"
              class="lg:w-24 sm:w-16"
            />
          </div>
          <div
            class="cursor-pointer border hover:border-primary p-2 rounded flex justify-center items-center lg:mb-2 sm:mr-2"
          >
            <img
              src="https://user-images.githubusercontent.com/2805249/64069899-8bdaa180-cc97-11e9-9b19-1a9e1a254c18.png"
              class="lg:w-24 sm:w-16"
            />
          </div>
          <div
            class="cursor-pointer border hover:border-primary p-2 rounded flex justify-center items-center lg:mb-2 sm:mr-2"
          >
            <img
              src="https://user-images.githubusercontent.com/2805249/64069899-8bdaa180-cc97-11e9-9b19-1a9e1a254c18.png"
              class="lg:w-24 sm:w-16"
            />
          </div>
        </div>
        <div class="flex lg:w-9/12 sm:w-full">
          <ZoomOnHover
            img="https://user-images.githubusercontent.com/2805249/64069899-8bdaa180-cc97-11e9-9b19-1a9e1a254c18.png"
          />
        </div>
      </div>
      <div class="flex lg:w-6/12 sm:w-full p-2 sm:p-2">
        <div class="flex flex-grow flex-col">
          <div class="text-xs mb-2">
            <span class="bg-primary-lighter rounded px-2 py-1 text-white">Collection Name</span>
          </div>
          <h1 class="text-3xl font-bold leading-none">Takis Shelter</h1>
          <h2 class="text-xl">PHP 499.00</h2>
          <div
            class="mt-3"
          >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Consequuntur minima odio adipisci accusantium temporibus fuga cupiditate similique natus? Deleniti officiis sapiente nobis ut! Sint voluptates odit at suscipit quisquam aliquid!</div>
          <div class="font-bold mt-3">COLOR</div>
          <div class="mt-2 flex">
            <div
              class="w-10 h-10 rounded flex justify-center items-center bg-white cursor-pointer border hover:shadow mr-1"
            ></div>
            <div
              class="w-10 h-10 mx-1 rounded flex justify-center items-center bg-primary cursor-pointer border hover:shadow"
            >
              <font-awesome-icon class="text-white" :icon="['fas', 'check']" />
            </div>
            <div
              class="w-10 h-10 mx-1 rounded flex justify-center items-center bg-blue-600 cursor-pointer border hover:shadow"
            ></div>
          </div>
          <div class="font-bold mt-3">SIZE</div>
          <div class="mt-2 flex">
            <div
              class="w-10 h-10 rounded flex justify-center items-center font-bold text-xs cursor-pointer border hover:border-primary hover:text-primary mr-1"
            >XS</div>
            <div
              class="w-10 h-10 rounded flex justify-center items-center font-bold text-xs cursor-pointer border hover:border-primary hover:text-primary mx-1"
            >S</div>
            <div
              class="w-10 h-10 rounded flex justify-center items-center font-bold text-xs cursor-pointer border hover:border-primary hover:text-primary mx-1"
            >M</div>
            <div
              class="w-10 h-10 rounded flex justify-center items-center font-bold text-xs cursor-pointer border hover:border-primary hover:text-primary mx-1"
            >L</div>
            <div
              class="w-10 h-10 rounded flex justify-center items-center font-bold text-xs cursor-pointer border hover:border-primary hover:text-primary mx-1"
            >XL</div>
            <div
              class="w-10 h-10 rounded flex justify-center items-center font-bold text-xs cursor-pointer border hover:border-primary hover:text-primary mx-1"
            >2XL</div>
          </div>
          <div class="font-bold mt-3">QUANTITY</div>
          <div class="mt-2 flex">
            <VueNumericInput align="center" style="width: 90px" :min="1" v-model="quantity" />
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
</template>

<script>
import VueNumericInput from '@/components/VueNumericInput'
import ProductsGrid from '@/components/ProductsGrid'
import ZoomOnHover from '@/components/ZoomOnHover/index'
import VueTailwindModal from '@/components/VueTailwindModal'
import BreadCrumbs from '@/components/BreadCrumbs'

export default {
  layout: 'marketplace',
  components: {
    ProductsGrid,
    VueNumericInput,
    ZoomOnHover,
    VueTailwindModal,
    BreadCrumbs
  },
  data() {
    return {
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
  methods: {
    addToCart() {
      this.$refs.addedToCartModal.show()
    }
  }
}
</script>