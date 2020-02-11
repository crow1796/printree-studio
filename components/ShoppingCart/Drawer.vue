<template>
  <VueTailwindDrawer ref="drawer" width="40%">
    <div class="flex flex-grow flex-col">
      <div class="flex justify-between">
        <span class="font-bold pb-4 border-b flex-grow p-4">SHOPPING CART</span>
        <div
          class="select-none absolute right-0 top-0 mr-3 mt-3 cursor-pointer w-8 h-8 border rounded-full flex justify-center items-center hover:border-gray-600 hover:text-gray-700"
          @click="$refs.drawer.hide()"
        >
          <font-awesome-icon :icon="['fas', 'times']" class="text-xs" />
        </div>
      </div>
      <div class="flex flex-grow flex-col">
        <div class="flex flex-grow-0 border-b px-4 py-6">
          <div class="w-3/12 flex-justify-between">
            <div>
              <img
                class="relative w-20 mx-auto"
                src="https://user-images.githubusercontent.com/2805249/64069899-8bdaa180-cc97-11e9-9b19-1a9e1a254c18.png"
                alt
              />
            </div>
          </div>
          <div class="flex flex-col w-4/12 justify-center">
            <span class="font-bold leading-none">Taskis Shelter</span>
            <span class="text-gray-500 text-sm">#31512</span>
          </div>
          <div class="w-3/12 flex justify-center items-center">
            <VueNumericInput align="center" style="width: 110px; height: 30px" :min="1" />
          </div>
          <div class="w-2/12 flex justify-end items-center">
            <div>
              <div
                class="select-none cursor-pointer w-8 h-8 flex justify-center items-center hover:text-primary"
              >
                <font-awesome-icon :icon="['fas', 'times']" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-between p-4 items-center border-t">
        <div class="flex flex-col">
          <span class="text-xs">Subtotal</span>
          <span class="font-bold text-primary">₱ 1,234.00</span>
        </div>
        <button
          type="button"
          class="border border-white bg-primary px-8 py-2 font-bold rounded text-white hover:bg-primary-lighter"
        >
          <span class="mr-2">CHECKOUT</span>
          <font-awesome-icon :icon="['fas', 'arrow-right']" />
        </button>
      </div>
    </div>
  </VueTailwindDrawer>
</template>

<script>
import VueTailwindDrawer from '@/components/VueTailwindDrawer'
import VueNumericInput from '@/components/VueNumericInput'

export default {
  components: {
    VueTailwindDrawer,
    VueNumericInput
  },
  methods: {
    show() {
      this.$refs.drawer.show()
    }
  }
}
</script>