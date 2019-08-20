<template>
  <no-ssr>
    <div class="w-full h-full flex flex-col text-sm">
      <div class="w-full p-4 flex border-b">
        <div class="flex w-1/3">
          <img src="~/assets/images/logo-nav.png"
            alt="Printree"
            class="w-10">
        </div>
        <div class="flex w-1/3 justify-center items-center font-bold">
          <span class="text-gray-600 uppercase">
            Studio /
          </span>
          &nbsp;
          <span class="parent text-gray-600 cursor-pointer hover:underline hover:text-gray-700">
            Product Name
            <span class="text-xs ml-1 parent:hover:visible invisible">
              <font-awesome-icon :icon="['fas', 'edit']"/>
            </span>
          </span>
        </div>
        <div class="flex w-1/3 items-center justify-end">
          <a href="#" class="text-blue-400">
            Continue Later
          </a>
          <div class="w-4"></div>
          <button type="button"
            class="shadow-xl border border-white bg-primary px-8 py-2 font-bold rounded text-white hover:bg-primary-lighter">
            NEXT
          </button>
        </div>
      </div>
      <nuxt/>
    </div>
  </no-ssr>
</template>


<script>
export default {
  head: {
    title: 'Printree Studio'
  }
}
</script>
