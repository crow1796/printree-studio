<template>
  <div class="flex flex-wrap items-center px-6">
    <nuxt-link
      class="flex-shrink-0 flex-grow sm:flex-grow-0 m-2 relative overflow-hidden hover:shadow-lg border rounded-lg relative"
      v-for="product in products"
      :key="product.id"
      :to="`/marketplace/collections/${product.collectionId}/products/${product.id}`"
      :title="product.name"
    >
      <div class="relative pt-3 px-8 flex items-center justify-center">
        <progressive-img class="relative w-40" :src="product.thumbnail" style="width: 160px" />
      </div>
      <div class="relative text-grey-600 px-3 pb-3">
        <span class="block opacity-75 w-full truncate text-xs leading-none">{{product.collectionName}}</span>
        <div class="flex items-center justify-between">
          <span class="font-black truncate w-11/12">{{product.name}}</span>
        </div>
        <!-- <div
          class="text-primary mb-1 text-xs font-black text-lg leading-none flex items-center"
        >{{product.price.formatMoney('₱ ')}}</div> -->
        <star-rating :increment="0.01" :fixed-points="2" v-model="product.rating" :read-only="true" :show-rating="false" :star-size="15"></star-rating>
      </div>
    </nuxt-link>
  </div>
</template>

<script>
import StarRating from 'vue-star-rating'

export default {
  props: ['products'],
  components: {
    StarRating
  }
}
</script>