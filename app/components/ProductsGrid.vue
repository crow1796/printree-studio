<template>
  <div class="flex flex-wrap items-center px-6">
    <div
      class="flex-shrink-0 flex-grow sm:flex-grow-0 m-2 relative overflow-hidden hover:shadow-lg border rounded-lg relative cursor-pointer"
      v-for="product in products"
      :key="product.id"
      @click="goTo(`/marketplace/collections/${product.collectionId}/products/${product.id}`)"
      :title="product.name"
    >
      <div class="absolute right-0 top-0 z-10 rounded-full mt-3 mr-3 w-10 h-10 bg-white font-black shadow-xl flex justify-center items-center border border-gray-200 text-gray-700 hover:text-primary hover:border-primary select-none cursor-pointer" title="Add to Cart" v-tippy="{arrow: true}" @click.stop="addToCart(product)">
        <font-awesome-icon :icon="['fas', 'plus']"/>
      </div>
      <div class="relative pt-3 px-8 flex items-center justify-center">
        <progressive-img class="relative w-40" :src="product.thumbnail" style="width: 160px" />
      </div>
      <div class="relative text-grey-600 px-3 pb-3">
        <span class="block opacity-75 w-full truncate text-xs leading-none">{{product.collectionName}}</span>
        <div class="flex items-center justify-between">
          <span class="font-black truncate w-11/12">{{product.name}}</span>
        </div>
        <div
          class="text-primary mb-1 text-xs font-black text-lg leading-none flex items-center"
        >{{product.price.formatMoney('₱ ')}}</div>
        <div class="text-xs text-yellow-500">
          <font-awesome-icon :icon="['fas', 'star']"/>
          <font-awesome-icon :icon="['fas', 'star']"/>
          <font-awesome-icon :icon="['fas', 'star']"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['products'],
  methods: {
    addToCart(product){
      console.log(product)
    },
    goTo(link){
      this.$router.push(link)
    }
  }
}
</script>