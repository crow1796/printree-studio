<template>
  <nav
    class="font-bold mt-6 mb-4 text-sm bg-gray-200 rounded px-6 py-3 w-auto inline-block"
    aria-label="Breadcrumb"
  >
    <ol class="list-none p-0 inline-flex">
      <li v-for="(item, i) in items" :key="i">
        <a href="#" class="text-gray-500" aria-current="page" v-if="item.active">
          {{ item.title }}
          <font-awesome-icon class="w-3 h-3 mx-3" :icon="['fas', 'chevron-right']" v-if="i < (items.length - 1)"/>
        </a>
        <div class="flex items-center" v-if="!item.active">
          <nuxt-link :to="item.link">{{item.title}}</nuxt-link>
          <font-awesome-icon class="w-3 h-3 mx-3" :icon="['fas', 'chevron-right']" v-if="i < (items.length - 1)"/>
        </div>
      </li>
    </ol>
  </nav>
</template>

<script>
export default {
  props: ['items']
}
</script>