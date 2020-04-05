<template>
  <div class="container mx-auto pb-16 pt-0 relative min-h-area-loader">
    <AreaLoader v-if="isLoading" class="my-2" />
    <div class="px-6 flex justify-between items-center" v-if="collection">
      <BreadCrumbs home-link="/marketplace"
        :items="[{
      title: 'Products',
      link: '/marketplace/products'
    }, {
      title: collection.name,
      link: `/marketplace/collections/${collection.id}`
    }]"
      />
        <div class="flex items-center">
          <div class="mr-2 font-bold">
            Share this collection on
          </div>
          <social-sharing :url="currentUrl" inline-template>
            <div>
              <network network="facebook">
                <font-awesome-icon
                  :icon="['fab', 'facebook-f']"
                  class="cursor-pointer hover:text-primary mx-1"
                />
              </network>
              <network network="twitter">
                <font-awesome-icon
                  :icon="['fab', 'twitter']"
                  class="cursor-pointer hover:text-primary mx-1"
                />
              </network>
            </div>
          </social-sharing>
        </div>
    </div>
    <ProductsGrid :products="products" />
  </div>
</template>

<script>
import ProductsGrid from '@/components/ProductsGrid'
import BreadCrumbs from '@/components/BreadCrumbs'
export default {
  layout: 'marketplace',
  components: {
    ProductsGrid,
    BreadCrumbs
  },
  async mounted(){
    this.products = await this.$store.dispatch('marketplace/getProductsToSell', {
      collectionId: this.$route.params.id
    })
    if(this.products.length){
      this.collection = {
        id: _.first(this.products).collectionId,
        name: _.first(this.products).collectionName,
      }
    }
    this.isLoading = false
  },
  data() {
    return {
      isLoading: true,
      collection: null,
      products: []
    }
  },
  computed: {
    currentUrl() {
      return window.location.href
    }
  }
}
</script>