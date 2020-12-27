<template>
  <div class="flex justify-center">
    <button
      type="button"
      @click="$emit('prev')"
      class="justify-center items-center mx-2 my-1 w-8 h-8 focus:outline-none outline-none flex flex-shrink border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
    >
      <font-awesome-icon :icon="['fas', 'caret-left']" />
    </button>
    <button
      type="button"
      @click="$emit('next')"
      class="justify-center items-center mx-2 my-1 w-8 h-8 focus:outline-none outline-none flex flex-shrink border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
    >
      <font-awesome-icon :icon="['fas', 'caret-right']" />
    </button>
  </div>
</template>