<template>
  <div class="flex h-full w-full">
    <simplebar class="flex w-1/4 border-r h-full">
      <div class="p-4 w-full h-full overflow-auto">
        <Tabs :tabs="[{name: 'design', title: 'Design', slot: 'design'}, {name: 'products', title: 'Products', slot: 'products'}]">
          <template v-slot:design>
            <div class="mt-4 w-full">
              <div class="flex w-full">
                <button type="button"
                  class="w-1/2 justify-center focus:outline-none mx-1 outline-none flex flex-grow border px-6 py-3 font-bold rounded cursor-pointer text-gray-600 border-grey-lightest hover:bg-gray-100">
                  <font-awesome-icon :icon="['fas', 'font']" class="text-lg"/>
                  <span class="ml-2">
                    ADD A TEXT
                  </span>
                </button>
                <button type="button"
                  class="w-1/2 justify-center focus:outline-none mx-1 outline-none flex flex-grow border px-6 py-3 font-bold rounded cursor-pointer text-gray-600 border-grey-lightest hover:bg-gray-100">
                  <font-awesome-icon :icon="['fas', 'cubes']" class="text-lg"/>
                  <span class="ml-2">
                    ADD AN ART
                  </span>
                </button>
              </div>

              <div class="mx-1">
                <div class="font-bold text-lg text-gray-600 mt-4">
                  Choose a color
                </div>
                <div class="colors mt-2 flex flex-wrap">
                  <div class="rounded-full p-1 bg-white border border-gray-400 m-1 hover:border-gray-300">
                    <div class="rounded-full cursor-pointer w-8 h-8 bg-primary border border-gray-200"></div>
                  </div>
                  <div class="rounded-full p-1 bg-white border border-white m-1 hover:border-gray-300"
                    v-for="(color, index) in textColors"
                    :key="index">
                    <div class="rounded-full cursor-pointer w-8 h-8 border border-gray-200"
                      :style="{ 'background-color': color.hex }"></div>
                  </div>
                </div>
              </div>

              <div class="mx-1">
                <div class="font-bold text-lg text-gray-600 mt-4">
                  Font options
                </div>
                <div class="colors mt-2 flex flex-wrap">
                  <Select placeholder="Choose a font"
                    class="w-full"
                    v-model="selectedFont"
                    :options="[{label: 'Arial', value: 'arial'}, {label: 'Arial 2', value: 'arial2'}, {label: 'Arial', value: 'arial3'}, {label: 'Arial', value: 'arial4'}]"
                    filterable/>
                </div>
                <div class="mt-4 text-gray-600">
                  <div class="font-bold mx-1">
                    Alignment
                  </div>
                  <div class="flex mt-2">
                    <button type="button"
                      class="justify-center focus:outline-none mx-1 outline-none flex border px-4 py-3 font-bold rounded cursor-pointer text-gray-600 border-grey-lightest hover:bg-gray-100">
                      <font-awesome-icon :icon="['fas', 'align-left']"/>
                    </button>
                    <button type="button"
                      class="justify-center focus:outline-none mx-1 outline-none flex border px-4 py-3 font-bold rounded cursor-pointer text-gray-600 border-grey-lightest hover:bg-gray-100">
                      <font-awesome-icon :icon="['fas', 'align-center']"/>
                    </button>
                    <button type="button"
                      class="justify-center focus:outline-none mx-1 outline-none flex border px-4 py-3 font-bold rounded cursor-pointer text-gray-600 border-grey-lightest hover:bg-gray-100">
                      <font-awesome-icon :icon="['fas', 'align-right']"/>
                    </button>
                    <button type="button"
                      class="justify-center focus:outline-none mx-1 outline-none flex border px-4 py-3 font-bold rounded cursor-pointer text-gray-600 border-grey-lightest hover:bg-gray-100">
                      <font-awesome-icon :icon="['fas', 'align-justify']"/>
                    </button>
                  </div>
                </div>
                <div class="mt-4 text-gray-600">
                  <div class="font-bold mx-1">
                    Styles & Decorations
                  </div>
                  <div class="flex mt-2">
                    <button type="button"
                      class="justify-center focus:outline-none mx-1 outline-none flex border px-4 py-3 font-bold rounded cursor-pointer text-gray-600 border-grey-lightest hover:bg-gray-100">
                      <font-awesome-icon :icon="['fas', 'bold']"/>
                    </button>
                    <button type="button"
                      class="justify-center focus:outline-none mx-1 outline-none flex border px-4 py-3 font-bold rounded cursor-pointer text-gray-600 border-grey-lightest hover:bg-gray-100">
                      <font-awesome-icon :icon="['fas', 'italic']"/>
                    </button>
                    <button type="button"
                      class="justify-center focus:outline-none mx-1 outline-none flex border px-4 py-3 font-bold rounded cursor-pointer text-gray-600 border-grey-lightest hover:bg-gray-100">
                      <font-awesome-icon :icon="['fas', 'underline']"/>
                    </button>
                    <button type="button"
                      class="justify-center focus:outline-none mx-1 outline-none flex border px-4 py-3 font-bold rounded cursor-pointer text-gray-600 border-grey-lightest hover:bg-gray-100">
                      <font-awesome-icon :icon="['fas', 'strikethrough']"/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-slot:products>
            <div class="mt-4 w-full">
              <div class="px-4 h-24 cursor-pointer hover:bg-gray-100 select-none text-gray-600 w-full justify-center items-center flex border rounded border-dashed">
                <font-awesome-icon :icon="['fas', 'cubes']" class="mr-2 text-lg"/>
                <span class="font-bold">ADD PRODUCTS</span>
              </div>
              <div class="px-4 relative mt-4 h-24 cursor-pointer hover:bg-gray-100 select-none text-gray-600 w-full justify-center items-center flex border rounded border-dashed">
                <div class="flex">
                  <div class="w-1/5">
                    <img src="~/assets/images/shirtplaceholder.png">
                  </div>
                  <div class="flex-grow flex flex-col px-4 py-2">
                    <div class="font-bold text-gray-600">
                      Classic Tee
                    </div>
                    <div class="flex">
                      <div class="rounded-full p-1 bg-white border border-white m-1 hover:border-gray-300">
                        <div class="rounded-full cursor-pointer w-6 h-6 border border-gray-200"
                          :style="{ 'background-color': '#000000' }"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="absolute hover:text-gray-700" style="top: 15px; right: 15px;">
                  <font-awesome-icon :icon="['fas', 'trash']"/>
                </div>
              </div>
            </div>
          </template>
        </Tabs>
      </div>
    </simplebar>
    <div class="flex flex-grow h-full flex-col">
      <div class="actions relative z-10 flex flex-shrink justify-center w-full">
        <div class="flex mt-4 rounded shadow-xl border">
          <div class="flex p-4 border-r">
            <button type="button"
              class="w-10 flex justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border px-3 py-2 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
              title="Duplicate"
              v-tippy>
              <font-awesome-icon :icon="['fas', 'clone']" class="text-xs"/>
            </button>
            <button type="button"
              class="w-10 flex justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border px-3 py-2 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
              title="To Back"
              v-tippy>
              <font-awesome-icon :icon="['fas', 'angle-double-left']" class="text-xs"/>
            </button>
            <button type="button"
              class="w-10 flex justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border px-3 py-2 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
              title="Backward"
              v-tippy>
              <font-awesome-icon :icon="['fas', 'angle-left']" class="text-xs"/>
            </button>
            <button type="button"
              class="w-10 flex justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border px-3 py-2 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
              title="Forward"
              v-tippy>
              <font-awesome-icon :icon="['fas', 'angle-right']" class="text-xs"/>
            </button>
            <button type="button"
              class="w-10 flex justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border px-3 py-2 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
              title="To Front"
              v-tippy>
              <font-awesome-icon :icon="['fas', 'angle-double-right']" class="text-xs"/>
            </button>
          </div>
          <div class="flex p-4 pr-0">
            <button type="button"
              class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border px-3 py-2 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100">
              <font-awesome-icon :icon="['fas', 'sync-alt']" class="text-xs"/>
              <span class="ml-2 text-xs">
                SHOW BACK
              </span>
            </button>
          </div>
          <div class="flex item-center p-4 pl-0">
            <button type="button"
              class="w-10 flex justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border px-3 py-2 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
              title="Zoom Out"
              v-tippy>
              <font-awesome-icon :icon="['fas', 'minus']" class="text-xs"/>
            </button>
            <span class="flex items-center font-bold text-gray-600 mx-2">100%</span>
            <button type="button"
              class="w-10 flex justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border px-3 py-2 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
              title="Zoom In"
              v-tippy>
              <font-awesome-icon :icon="['fas', 'plus']" class="text-xs"/>
            </button>
          </div>
        </div>
      </div>
      <div class="flex flex-grow w-full h-full justify-center mt-8">
        <div class="shirt-canvas select-none">
          <img draggable="false" src="~/assets/images/shirtplaceholder.png">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Tabs from '@/components/Tabs'
import Select from '@/components/Select'

export default {
  layout: 'designer',
  components: {
    Tabs,
    Select
  },
  data(){
    return {
      textColors: [
        {
          hex: '#6AF6FF'
        },
        {
          hex: '#3A5DAB'
        },
        {
          hex: '#2023A8'
        },
        {
          hex: '#012F56'
        },
        {
          hex: '#40263A'
        },
        {
          hex: '#6B3076'
        },
        {
          hex: '#BB19A1'
        },
        {
          hex: '#9595D2'
        },

        {
          hex: '#327FE0'
        },
        {
          hex: '#E7B2C2'
        },
        {
          hex: '#EE6078'
        },
        {
          hex: '#EF4E97'
        },
        {
          hex: '#CD1168'
        },
        {
          hex: '#7E2E2C'
        },
        {
          hex: '#AA2227'
        },
        {
          hex: '#D1272F'
        },

        {
          hex: '#D58BC8'
        },
        {
          hex: '#E7B2C2'
        },
        {
          hex: '#EE6078'
        },
        {
          hex: '#EF4E97'
        },
        {
          hex: '#CD1168'
        },
        {
          hex: '#7E2E2C'
        },
        {
          hex: '#AA2227'
        },
        {
          hex: '#D1272F'
        },

        {
          hex: '#E0513D'
        },
        {
          hex: '#FE6917'
        },
        {
          hex: '#FE8574'
        },
        {
          hex: '#F2CEB3'
        },
        {
          hex: '#EDD385'
        },
        {
          hex: '#F5EA64'
        },
        {
          hex: '#F2E41A'
        },
        {
          hex: '#EFB229'
        },

        {
          hex: '#CB890B'
        },
        {
          hex: '#9D6938'
        },
        {
          hex: '#664635'
        },
        {
          hex: '#974755'
        },
        {
          hex: '#D3B49E'
        },
        {
          hex: '#AFA97E'
        },
        {
          hex: '#00C6B1'
        },
        {
          hex: '#70CB98'
        },

        {
          hex: '#C1E08A'
        },
        {
          hex: '#76D54E'
        },
        {
          hex: '#1F8748'
        },
        {
          hex: '#1F5632'
        },
        {
          hex: '#005D5C'
        },
        {
          hex: '#017580'
        },
        {
          hex: '#93B6BA'
        },
        {
          hex: '#FEFEFE'
        }
      ],
      selectedFont: null
    }
  }
}
</script>
