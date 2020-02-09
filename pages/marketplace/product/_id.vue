<template>
  <div class="container mx-auto py-16">
    <div class="flex">
      <div class="flex w-6/12"></div>
      <div class="flex w-6/12">
        <div class="flex flex-grow flex-col">
          <h1 class="text-3xl font-bold leading-none">Takis Shelter</h1>
          <h2 class="text-xl">PHP 499.00</h2>
          <div
            class="mt-3"
          >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Consequuntur minima odio adipisci accusantium temporibus fuga cupiditate similique natus? Deleniti officiis sapiente nobis ut! Sint voluptates odit at suscipit quisquam aliquid!</div>
          <div class="font-bold mt-3">COLOR</div>
          <div class="mt-2 flex">
            <div
              class="w-10 h-10 rounded flex justify-center items-center bg-white cursor-pointer border hover:shadow"
            ></div>
            <div
              class="w-10 h-10 mx-2 rounded flex justify-center items-center bg-primary cursor-pointer border hover:shadow"
            >
              <font-awesome-icon class="text-white" :icon="['fas', 'check']" />
            </div>
            <div
              class="w-10 h-10 mx-2 rounded flex justify-center items-center bg-blue-600 cursor-pointer border hover:shadow"
            ></div>
          </div>
          <div class="font-bold mt-3">SIZE</div>
          <div class="mt-2 flex">
            <div
              class="w-10 h-10 rounded flex justify-center items-center font-bold text-xs cursor-pointer border hover:border-primary hover:text-primary"
            >XS</div>
            <div
              class="w-10 h-10 rounded flex justify-center items-center font-bold text-xs cursor-pointer border hover:border-primary hover:text-primary mx-2"
            >S</div>
            <div
              class="w-10 h-10 rounded flex justify-center items-center font-bold text-xs cursor-pointer border hover:border-primary hover:text-primary mx-2"
            >M</div>
            <div
              class="w-10 h-10 rounded flex justify-center items-center font-bold text-xs cursor-pointer border hover:border-primary hover:text-primary mx-2"
            >L</div>
            <div
              class="w-10 h-10 rounded flex justify-center items-center font-bold text-xs cursor-pointer border hover:border-primary hover:text-primary mx-2"
            >XL</div>
            <div
              class="w-10 h-10 rounded flex justify-center items-center font-bold text-xs cursor-pointer border hover:border-primary hover:text-primary mx-2"
            >2XL</div>
          </div>
          <div class="mt-3">
            <button
              type="button"
              class="border border-white bg-primary px-8 py-2 font-bold rounded text-white hover:bg-primary-lighter"
            >ADD TO CART</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'marketplace'
}
</script>