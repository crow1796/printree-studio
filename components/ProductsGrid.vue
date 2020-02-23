<template>
  <div class="flex flex-wrap items-center justify-center">
    <nuxt-link
      class="flex-shrink-0 my-6 mx-2 relative overflow-hidden hover:shadow-lg border rounded-lg"
      v-for="product in products"
      :key="product.id"
      :to="`/marketplace/products/${product.id}`"
      :title="product.name"
    >
      <div class="relative pt-3 px-8 flex items-center justify-center">
        <img class="relative w-40" :src="product.thumbnail" alt />
      </div>
      <div class="relative text-grey-600 px-3 pb-3">
        <span class="block opacity-75 mb-1 w-full truncate text-xs">{{product.collectionName}}</span>
        <div class="flex items-center justify-between">
          <span class="font-semibold leading-none truncate w-11/12">{{product.name}}</span>
        </div>
        <div
          class="text-primary mt-2 mb-1 text-xs font-bold text-lg leading-none flex items-center"
        >{{product.price.formatMoney('₱ ')}}</div>
        <div class="text-xs text-yellow-500">
          <font-awesome-icon :icon="['fas', 'star']"/>
          <font-awesome-icon :icon="['fas', 'star']"/>
          <font-awesome-icon :icon="['fas', 'star']"/>
        </div>
      </div>
    </nuxt-link>
  </div>
</template>

<script>
export default {
  props: ['products']
}
</script>