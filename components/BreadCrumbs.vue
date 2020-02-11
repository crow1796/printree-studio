<template>
  <nav class="font-bold mt-6 mb-4 text-sm bg-gray-200 rounded px-6 py-3 w-auto inline-block" aria-label="Breadcrumb">
    <ol class="list-none p-0 inline-flex">
      <li class="flex items-center">
        <a href="#">Marketplace</a>
        <font-awesome-icon class="w-3 h-3 mx-3" :icon="['fas', 'chevron-right']"/>
      </li>
      <li class="flex items-center">
        <a href="#">Second Level</a>
        <font-awesome-icon class="w-3 h-3 mx-3" :icon="['fas', 'chevron-right']"/>
      </li>
      <li>
        <a href="#" class="text-gray-500" aria-current="page">Third Level</a>
      </li>
    </ol>
  </nav>
</template>