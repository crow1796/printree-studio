<template>
  <div class="flex flex-wrap items-center justify-center">
    <nuxt-link
      class="flex-shrink-0 m-6 relative overflow-hidden bg-teal-500 rounded-lg max-w-xs shadow-lg" v-for="product in products" :key="product.id"
      :to="`/marketplace/products/${product.id}`" :title="product.name"
    >
      <svg
        class="absolute bottom-0 left-0 mb-8"
        viewBox="0 0 375 283"
        fill="none"
        style="transform: scale(1.5); opacity: 0.1;"
      >
        <rect
          x="159.52"
          y="175"
          width="152"
          height="152"
          rx="8"
          transform="rotate(-45 159.52 175)"
          fill="white"
        />
        <rect
          y="107.48"
          width="152"
          height="152"
          rx="8"
          transform="rotate(-45 0 107.48)"
          fill="white"
        />
      </svg>
      <div class="relative pt-10 px-10 flex items-center justify-center">
        <img
          class="relative w-40"
          :src="product.thumbnail"
          alt
        />
      </div>
      <div class="relative text-white px-6 pb-6 mt-6">
        <span class="block opacity-75 -mb-1 w-full truncate">{{product.collection_name}}</span>
        <div class="flex items-center justify-between">
          <span class="font-semibold text-lg leading-none w-6/12 truncate">{{product.name}}</span>
          <span
            class="bg-white h-8 rounded-full text-teal-500 text-xs font-bold px-3 py-2 leading-none flex items-center"
          >{{product.price.formatMoney('₱ ')}}</span>
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