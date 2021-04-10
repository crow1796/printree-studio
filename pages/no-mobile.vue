<template>
  <div class="my-12">
    <div class="text-center">
      <img src="~/assets/images/broken.png" />
      <div class="text-center my-4">
        We're really sorry to let you know that
        <strong>Printree Studio&rsquo;s</strong> product designer is not working on mobile devices yet.
      </div>
      <div class="mt-2">
        <strong>To start designing, please use a PC.</strong>
      </div>
      <div>
        Or while you are in mobile, you can also...
      </div>
    </div>

    <div class="text-center mt-4">
      <nuxt-link
        to="/marketplace"
        class="bg-gray-200 px-8 py-4 font-bold rounded text-gray-800 hover:bg-gray-500 w-full block"
      >Visit the marketplace</nuxt-link>
    </div>
    <div class="text-center mt-2">
      <nuxt-link
        to="/marketplace"
        class="bg-gray-200 px-8 py-4 font-bold rounded text-gray-800 hover:bg-gray-500 w-full block"
      >Go to homepage</nuxt-link>
    </div>
  </div>
</template>