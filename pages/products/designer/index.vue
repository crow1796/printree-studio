<template>
  <div class="flex h-full w-full">
    <AreaLoader v-if="isLoading" fullscreen />
    <div class="flex h-full w-full relative" v-else>
      <VueTailwindDrawer ref="availableProductsModal" width="70%">
        <div class="flex flex-col h-full">
          <div class="modal-heading border-b w-full p-4 text-gray-600">
            <div class="flex justify-between w-full items-center">
              <div class="flex uppercase">
                <strong>Select Products</strong>
              </div>
              <div class="flex text-right">
                <div
                  class="select-none cursor-pointer w-8 h-8 border rounded-full flex justify-center items-center hover:border-gray-600 hover:text-gray-700"
                  @click="hideAvailableProducts"
                >
                  <font-awesome-icon :icon="['fas', 'times']" class="text-xs" />
                </div>
              </div>
            </div>
          </div>
          <div class="flex modal-body flex-grow">
            <AvailableProducts v-model="tmpProducts" />
          </div>
          <div class="flex modal-footer justify-between p-4 border-t items-center">
            <a
              href="#"
              class="text-blue-400 cursor-help border-dashed border-b hover:border-blue-400"
            >{{ tmpProducts.length }} Products Selected</a>
            <button
              type="button"
              class="border border-white bg-primary px-8 py-2 font-bold rounded text-white hover:bg-primary-lighter"
              @click="manageProducts"
            >CONTINUE</button>
          </div>
        </div>
      </VueTailwindDrawer>
      <VueTailwindDrawer ref="artsModal" width="40%">
        <div class="flex p-4 h-full flex-col w-full">
          <div class="flex w-1/3 flex-col w-full">
            <div class="uppercase font-bold text-gray-600 pb-2 px-1">Upload an Image</div>
            <div class="flex h-full w-full my-1">
              <div class="relative h-full w-full border border-dashed">
                <vue-dropzone
                  class="h-full border-0 flex items-center justify-center"
                  ref="myVueDropzone"
                  id="dropzone"
                  :style="{border: 0}"
                  :options="{
                    url: 'https://httpbin.org/post',
                    thumbnailWidth: 150,
                    maxFiles: 1,
                    acceptedFiles: 'image/svg+xml, image/png, image/jpeg, image/bmp'
                  }"
                  @vdropzone-success="artAdded"
                />
              </div>
            </div>
          </div>
          <div class="flex flex-col w-2/3 w-full">
            <div class="uppercase font-bold text-gray-600 pb-2 px-1">Choose an Art</div>
            <div class="overflow-auto">
              <ArtsList
                @selected="addObject('svg', $event.value, $event.label); $refs.artsModal.hide()"
              />
            </div>
          </div>
        </div>
      </VueTailwindDrawer>
      <div class="flex w-1/4 border-r h-full flex-col">
        <div class="flex overflow-hidden w-full h-full flex-col overflow-auto flex-grow">
          <div
            class="mx-4 mt-4 px-4 h-24 flex-shrink-0 cursor-pointer hover:bg-gray-100 select-none text-gray-600 w-auto justify-center items-center flex border rounded border-dashed"
            @click="showAvailableProducts"
          >
            <font-awesome-icon :icon="['fas', 'cubes']" class="mr-2 text-lg" />
            <span class="font-bold">MANAGE PRODUCTS</span>
          </div>
          <div class="flex h-full w-full flex flex-col">
            <simplebar class="h-full overflow-auto px-4 pb-4">
              <div
                class="px-4 relative mt-4 h-24 cursor-pointer hover:bg-gray-100 select-none text-gray-600 w-auto justify-center items-center flex border rounded"
                v-for="(product, index) in selectedProducts"
                :key="index"
                :class="{ 'bg-gray-100': index == currentProductIndex }"
                @click="selectProduct(index)"
              >
                <div class="flex w-full">
                  <div class="flex justify-center items-center w-1/5">
                    <img
                      :src="product.variants[0].printable_area[_firstPrintableArea(product.variants[0])].placeholder"
                    />
                  </div>
                  <div class="flex-grow flex flex-col px-4 py-2">
                    <div
                      class="font-bold text-gray-600"
                      style="width: 180px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                    >{{ product.name }}</div>
                    <div class="flex">
                      <v-popover class="flex">
                        <div
                          class="rounded-full p-1 border border-white m-1 bg-white border-gray-300 hover:border-gray-400 hover:text-gray-700"
                          v-if="product.availableVariants.length > 1"
                        >
                          <div
                            class="flex justify-center items-center rounded-full cursor-pointer w-6 h-6 bg-white"
                          >
                            <font-awesome-icon :icon="['fas', 'plus']" class="text-xs" />
                          </div>
                        </div>
                        <template slot="popover">
                          <div class="bg-white w-64 border rounded shadow-xl">
                            <div class="flex flex-col w-full">
                              <div class="font-bold text-gray-600 p-2 border-b">Choose a color</div>
                              <div class="flex p-2">
                                <div
                                  class="rounded-full p-1 border border-white m-1 hover:border-gray-300"
                                  v-for="(variant, variantIndex) in currentProduct.availableVariants"
                                  :key="variantIndex"
                                  :class="{ 'border-gray-300 bg-white': _colorIsInVariantsOf(currentProduct, variant.color) }"
                                  @click="addVariant(variant)"
                                >
                                  <div
                                    class="flex justify-center items-center rounded-full cursor-pointer w-6 h-6 border border-gray-200"
                                    :style="{ 'background-color': variant.color }"
                                  >
                                    <font-awesome-icon
                                      :icon="['fas', 'check']"
                                      :style="{ color: getCorrectColor(variant.color), fontSize: '.8em' }"
                                      v-if="_colorIsInVariantsOf(currentProduct, variant.color)"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </template>
                      </v-popover>
                      <div
                        class="rounded-full p-1 border border-white m-1 hover:border-gray-300"
                        v-for="(variant, variantIndex) in product.variants"
                        :key="variantIndex"
                        @click.stop="selectVariant(variantIndex, index)"
                        :class="{ 'border-gray-300 bg-white': index == currentProductIndex && variantIndex == currentVariantIndex }"
                      >
                        <div
                          class="flex justify-center items-center rounded-full cursor-pointer w-6 h-6 border border-gray-200"
                          :style="{ 'background-color': variant.color }"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </simplebar>
          </div>
        </div>
        <div
          class="flex flex-shrink flex-grow-0 flex-col overflow-hidden w-full border-t text-gray-600"
          :style="{ transition: 'all .3s ease', height: !isMarketPlanCollapsed ? (designMeta.plan == 'sell' ? '55rem' : '41rem') : '77px' }"
        >
          <div
            class="flex border-b p-4 justify-between cursor-pointer hover:text-gray-700 hover:bg-gray-100"
            @click="togglePlanSection"
          >
            <div class="flex flex-col">
              <div class="flex items-center mb-1">
                <span class="font-bold mr-1">I WANT TO</span>
                <div @click.stop>
                  <toggle-button
                    :value="designMeta.plan == 'sell'"
                    :labels="{checked: 'SELL', unchecked: 'BUY'}"
                    :color="{ checked: '#E1274E', unchecked: '#63b3ed' }"
                    :width="60"
                    @change="changeCurrentProductPlan"
                  />
                </div>
                <span class="font-bold ml-1">
                  THE PRODUCT
                  <span v-if="selectedProducts.length > 1">S</span> ABOVE
                </span>
              </div>
              <div
                class="text-xs"
              >{{ designMeta.plan == 'sell' ? '100% FREE ● NO INVENTORY' : 'BULK DISCOUNTS ● IMMEDIATE FULFILLMENT' }}</div>
            </div>
            <div class="flex justify-center items-center">
              <font-awesome-icon
                :icon="['fas', !isMarketPlanCollapsed ? 'caret-down' : 'caret-up']"
              />
            </div>
          </div>
          <div class="flex h-full w-full flex flex-col">
            <div class="flex px-4 py-2 border-b">
              <div class="w-2/12 flex-shrink-0 font-bold px-1">Size</div>
              <div
                class="w-3/12 flex-shrink-0 font-bold px-1"
              >{{ designMeta.plan == 'sell' ? 'Base Cost' : 'Price (₱)' }}</div>
              <div class="font-bold flex-grow px-1">Quantity</div>
              <div
                class="w-3/12 flex-shrink-0 font-bold px-1"
                v-if="designMeta.plan == 'sell'"
              >Price (₱)</div>
            </div>
            <simplebar class="h-full overflow-auto px-4 pb-3">
              <div class="flex w-full">
                <div class="flex flex-col w-full">
                  <div
                    class="flex mt-3 items-center"
                    v-for="(size, index) in currentVariant.available_sizes"
                    :key="`${currentVariant.id}_${index}`"
                  >
                    <div class="flex flex-shrink-0 w-2/12 px-1">{{ size.name }}</div>
                    <div
                      class="flex flex-shrink-0 w-3/12 px-1"
                    >{{ size.base_cost.formatMoney('₱ ') }}</div>
                    <div class="flex flex-grow px-1">
                      <VueNumericInput
                        class="h-8"
                        align="center"
                        :min="0"
                        :value="currentVariant.sizes[size.name].quantity"
                        @input="setQuantityAndPrice(size.name, 'quantity', $event)"
                        style="width: 80%"
                      />
                    </div>
                    <div class="flex flex-shrink-0 w-3/12 px-1" v-if="designMeta.plan == 'sell'">
                      <VueNumericInput
                        class="h-8"
                        align="center"
                        :precision="2"
                        :min="size.base_cost"
                        :controls="false"
                        :value="currentVariant.sizes[size.name].price"
                        @blur="setQuantityAndPrice(size.name, 'price', $event)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </simplebar>
            <div
              class="flex justify-between border-t p-4 items-center"
              v-if="designMeta.plan == 'sell'"
            >
              <span class="font-bold ml-1">ESTIMATED PROFIT</span>
              <span class="font-bold ml-1 text-primary">
                <number
                  v-if="estimatedMinProfit"
                  animationPaused
                  ref="estMinProfit"
                  :to="estimatedMinProfit"
                  :format="(num) => num.formatMoney('₱ ')"
                  :duration=".4"
                />
                <font-awesome-icon v-if="estimatedMinProfit" :icon="['fas', 'minus']" />
                <number
                  animationPaused
                  ref="estMaxProfit"
                  :to="estimatedMaxProfit"
                  :format="(num) => num.formatMoney('₱ ')"
                  :duration=".4"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-grow h-full flex-col">
        <div class="panzoom-container flex flex-grow w-full h-full justify-center overflow-hidden">
          <div class="canvas-section outline-none select-none relative w-full h-full text-center">
            <transition name="fade">
              <div
                class="auto-save uppercase font-bold absolute rounded top-0 right-0 w-24 py-1 mt-4 mr-4 text-gray-600 text-xs border"
                v-if="autoSaving"
                style="animation-duration: .3s;"
              >{{ autoSavingText }}</div>
            </transition>
            <div class="top-actions absolute z-10 flex flex-shrink justify-center w-full">
              <div
                class="flex bg-white ml-2 mt-4 py-2 px-1 rounded border items-center"
                v-if="activeObject && (activeObject.type == 'text' || activeObject.type == 'svg')"
              >
                <v-popover class="flex">
                  <button
                    type="button"
                    class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-6 h-6 font-bold rounded-full text-gray-600 border-grey-lightest hover:border-gray-400 text-xs"
                    :style="{ backgroundColor: activeObject.style.color }"
                    title="Color"
                    v-if="activeObjectCanBeColored"
                    v-tippy="{ arrow: true }"
                  ></button>
                  <template slot="popover">
                    <div class="bg-white w-64 border rounded shadow-xl">
                      <div class="colors flex flex-wrap">
                        <div
                          class="rounded-full p-1 bg-white border m-1 hover:border-gray-300"
                          v-for="(color, index) in textColors"
                          :key="index"
                          @click="setColorTo(color)"
                          :class="{ 'border-gray-400': activeObject && activeObject.style.color == color.code, 'border-white': !activeObject || activeObject.style.color != color.code }"
                        >
                          <div
                            class="justify-center items-center flex rounded-full cursor-pointer w-8 h-8 border border-gray-200"
                            :style="{ 'background-color': color.code }"
                          >
                            <font-awesome-icon
                              :icon="['fas', 'check']"
                              :style="{ color: getCorrectColor(color.code) }"
                              v-if="activeObject && activeObject.style.color.toLowerCase() == color.code.toLowerCase()"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </v-popover>
                <div class="flex" v-if="activeObject && activeObject.type == 'text'">
                  <div class="w-48 px-1 h-8 z-10 items-center">
                    <v-select
                      :options="webfonts"
                      class="flex-grow h-full text-sm"
                      :value="activeObject.style.fontFamily"
                      @input="changeFontFamily"
                    >
                      <template slot="option" slot-scope="item">
                        <span :style="{ fontFamily: item.value }">{{ item.label }}</span>
                      </template>
                    </v-select>
                  </div>
                  <button
                    type="button"
                    class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                    :class="{ 'bg-gray-300': activeObject.style.fontWeight == 'bold' }"
                    @click="toggleFontWeight(activeObject.style.fontWeight == 'bold' ? 'normal' : 'bold')"
                    title="Bold (Ctrl + B)"
                    v-tippy="{ arrow: true }"
                  >
                    <font-awesome-icon :icon="['fas', 'bold']" />
                  </button>
                  <button
                    type="button"
                    class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                    :class="{ 'bg-gray-300': activeObject.style.fontStyle == 'italic' }"
                    @click="toggleFontStyle(activeObject.style.fontStyle == 'italic' ? 'normal' : 'italic')"
                    title="Italic (Ctrl + I)"
                    v-tippy="{ arrow: true }"
                  >
                    <font-awesome-icon :icon="['fas', 'italic']" />
                  </button>
                  <button
                    type="button"
                    class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                    :class="{ 'bg-gray-300': hasTextDecoration('underline') }"
                    @click="toggleTextDecoration('underline')"
                    title="Underline (Ctrl + U)"
                    v-tippy="{ arrow: true }"
                  >
                    <font-awesome-icon :icon="['fas', 'underline']" />
                  </button>
                  <button
                    type="button"
                    class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                    :class="{ 'bg-gray-300': hasTextDecoration('line-through') }"
                    @click="toggleTextDecoration('line-through')"
                    title="Strikethrough (Ctrl + K)"
                    v-tippy="{ arrow: true }"
                  >
                    <font-awesome-icon :icon="['fas', 'strikethrough']" />
                  </button>
                  <VueNumericInput
                    :min="0"
                    @input="changeFontSize({value: $event})"
                    v-model="activeObject.style.fontSize"
                    align="center"
                    style="width: 90px"
                    class="ml-1"
                  />
                </div>
              </div>
              <div class="flex bg-white ml-2 mt-4 py-2 px-1 rounded border" v-if="activeObject">
                <button
                  type="button"
                  class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                  title="Align Left"
                  @click="alignObject('left', activeObject.bounds.width / 2)"
                  v-tippy="{ arrow: true }"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 51 54"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="4" height="54" rx="2" fill="#718096" />
                    <rect
                      x="12"
                      y="21"
                      width="11"
                      height="39"
                      rx="2"
                      transform="rotate(-90 12 21)"
                      fill="#718096"
                    />
                    <rect
                      x="12"
                      y="44"
                      width="11"
                      height="27"
                      rx="2"
                      transform="rotate(-90 12 44)"
                      fill="#718096"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                  title="Align Horizontal Center"
                  @click="alignObject('left', (currentVariant.printable_area[currentSide].width / 2))"
                  v-tippy="{ arrow: true }"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 39 54"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="17" width="4" height="54" rx="2" fill="#718096" />
                    <rect
                      y="21"
                      width="11"
                      height="39"
                      rx="2"
                      transform="rotate(-90 0 21)"
                      fill="#718096"
                    />
                    <rect
                      x="6"
                      y="44"
                      width="11"
                      height="27"
                      rx="2"
                      transform="rotate(-90 6 44)"
                      fill="#718096"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                  title="Align Right"
                  @click="alignObject('left', (currentVariant.printable_area[currentSide].width) - (activeObject.bounds.width / 2))"
                  v-tippy="{ arrow: true }"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 51 54"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      width="4"
                      height="54"
                      rx="2"
                      transform="matrix(-1 0 0 1 51 0)"
                      fill="#718096"
                    />
                    <rect
                      width="11"
                      height="39"
                      rx="2"
                      transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 39 21)"
                      fill="#718096"
                    />
                    <rect
                      width="11"
                      height="27"
                      rx="2"
                      transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 39 44)"
                      fill="#718096"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                  title="Align Top"
                  @click="alignObject('top', activeObject.bounds.height / 2)"
                  v-tippy="{ arrow: true }"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 55 52"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="54.5"
                      y="0.5"
                      width="4"
                      height="54"
                      rx="2"
                      transform="rotate(90 54.5 0.5)"
                      fill="#718096"
                    />
                    <rect x="33.5" y="12.5" width="11" height="39" rx="2" fill="#718096" />
                    <rect x="10.5" y="12.5" width="11" height="27" rx="2" fill="#718096" />
                  </svg>
                </button>
                <button
                  type="button"
                  class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                  title="Align Vertical Center"
                  @click="alignObject('top', (currentVariant.printable_area[currentSide].height / 2))"
                  v-tippy="{ arrow: true }"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 55 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="0.5"
                      y="22.5"
                      width="4"
                      height="54"
                      rx="2"
                      transform="rotate(-90 0.5 22.5)"
                      fill="#718096"
                    />
                    <rect
                      x="21.5"
                      y="39.5"
                      width="11"
                      height="39"
                      rx="2"
                      transform="rotate(180 21.5 39.5)"
                      fill="#718096"
                    />
                    <rect
                      x="44.5"
                      y="33.5"
                      width="11"
                      height="27"
                      rx="2"
                      transform="rotate(180 44.5 33.5)"
                      fill="#718096"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                  title="Align Bottom"
                  @click="alignObject('top', (currentVariant.printable_area[currentSide].height) - (activeObject.bounds.height / 2))"
                  v-tippy="{ arrow: true }"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 55 52"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      width="4"
                      height="54"
                      rx="2"
                      transform="matrix(1.19249e-08 -1 -1 -1.19249e-08 54.5 51.5)"
                      fill="#718096"
                    />
                    <rect
                      width="11"
                      height="39"
                      rx="2"
                      transform="matrix(1 5.56363e-08 5.56363e-08 -1 33.5 39.5)"
                      fill="#718096"
                    />
                    <rect
                      width="11"
                      height="27"
                      rx="2"
                      transform="matrix(1 5.56363e-08 5.56363e-08 -1 10.5 39.5)"
                      fill="#718096"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div class="left-actions absolute z-10 flex flex-shrink justify-center flex-col">
              <div class="flex bg-white mb-4 rounded border">
                <div class="flex flex-col py-1">
                  <button
                    type="button"
                    class="justify-center items-center mx-2 my-1 w-8 h-8 focus:outline-none outline-none flex flex-grow border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                    @click="addObject('text', 'Your Text Here', 'Your Text Here')"
                    title="Add a Text"
                    v-tippy="{ arrow: true }"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 37 45"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M36.6309 0V9.74805H31.5449L31.0908 4.69238H21.3125V39.416L26.2471 40.2637V44.0781H10.4141V40.2637L15.3486 39.416V4.69238H5.54004L5.11621 9.74805H0V0H36.6309Z"
                        fill="#718096"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    class="justify-center items-center mx-2 my-1 w-8 h-8 focus:outline-none outline-none flex flex-grow border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                    @click="$refs.artsModal.show()"
                    title="Add an Art"
                    v-tippy="{ arrow: true }"
                  >
                    <font-awesome-icon :icon="['fas', 'image']" />
                  </button>
                </div>
              </div>
              <div class="flex bg-white mb-4 rounded border" v-if="designMeta.plan == 'sell'">
                <div class="flex flex-col py-1">
                  <button
                    type="button"
                    class="justify-center items-center mx-2 my-1 w-8 h-8 focus:outline-none outline-none flex flex-grow border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                    title="Edit Metadata"
                    @click="toggleDrawer('productMetaDrawer')"
                    v-tippy="{ arrow: true }"
                  >
                    <font-awesome-icon :icon="['fas', 'tags']" class="text-xs" />
                  </button>
                  <button
                    type="button"
                    class="justify-center items-center mx-2 my-1 w-8 h-8 focus:outline-none outline-none flex flex-grow border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                    title="Objects"
                    @click="toggleDrawer('layersDrawer')"
                    v-tippy="{ arrow: true }"
                  >
                    <font-awesome-icon :icon="['fas', 'layer-group']" class="text-xs" />
                  </button>
                </div>
              </div>

              <div class="flex bg-white rounded border">
                <div class="flex flex-col py-1">
                  <button
                    type="button"
                    class="justify-center items-center mx-2 my-1 w-8 h-8 focus:outline-none outline-none flex flex-grow border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                    title="Duplicate"
                    v-tippy="{ arrow: true }"
                    @click="duplicate"
                  >
                    <font-awesome-icon :icon="['fas', 'clone']" class="text-xs" />
                  </button>
                  <button
                    type="button"
                    class="justify-center items-center mx-2 my-1 w-8 h-8 focus:outline-none outline-none flex flex-grow border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                    title="To Front"
                    v-tippy="{ arrow: true }"
                    @click="moveObjectPosition(activeObject, currentVariant.printable_area[currentSide].objects.length - 1)"
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 54 54"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="1"
                        y="1"
                        width="52"
                        height="52"
                        rx="2"
                        fill="white"
                        stroke="#718096"
                        stroke-width="2"
                      />
                      <rect
                        x="11"
                        y="11"
                        width="32"
                        height="32"
                        rx="2"
                        fill="#718096"
                        stroke="#718096"
                        stroke-width="2"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    class="justify-center items-center mx-2 my-1 w-8 h-8 focus:outline-none outline-none flex flex-grow border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                    title="Forward"
                    v-tippy="{ arrow: true }"
                    @click="moveObjectPosition(activeObject, activeObjectIndex < (currentVariant.printable_area[currentSide].objects.length - 1) ? activeObjectIndex + 1 : activeObjectIndex)"
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 57 55"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="20"
                        y="18"
                        width="36"
                        height="36"
                        rx="2"
                        fill="white"
                        stroke="#718096"
                        stroke-width="2"
                      />
                      <rect
                        x="1"
                        y="1"
                        width="36"
                        height="36"
                        rx="2"
                        fill="#718096"
                        stroke="#718096"
                        stroke-width="2"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    class="justify-center items-center mx-2 my-1 w-8 h-8 focus:outline-none outline-none flex flex-grow border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                    title="Backward"
                    v-tippy="{ arrow: true }"
                    @click="moveObjectPosition(activeObject, activeObjectIndex > 0 ? activeObjectIndex - 1 : activeObjectIndex)"
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 57 55"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="19" y="17" width="38" height="38" rx="3" fill="#718096" />
                      <rect
                        x="1"
                        y="1"
                        width="36"
                        height="36"
                        rx="2"
                        fill="white"
                        stroke="#718096"
                        stroke-width="2"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    class="justify-center items-center mx-2 my-1 w-8 h-8 focus:outline-none outline-none flex flex-grow border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                    title="To Back"
                    v-tippy="{ arrow: true }"
                    @click="moveObjectPosition(activeObject, 0)"
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 54 54"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="1"
                        y="1"
                        width="52"
                        height="52"
                        rx="2"
                        fill="white"
                        stroke="#718096"
                        stroke-width="2"
                      />
                      <rect
                        x="11"
                        y="11"
                        width="32"
                        height="32"
                        rx="2"
                        fill="white"
                        stroke="#718096"
                        stroke-width="2"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="flex bg-white mt-4 rounded border justify-center">
                <div class="flex flex-col py-1">
                  <button
                    type="button"
                    class="justify-center items-center mx-2 my-1 w-8 h-8 focus:outline-none outline-none flex flex-grow border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                    title="Zoom In"
                    @click="zoomTo(0.1)"
                    v-tippy="{ arrow: true }"
                  >
                    <font-awesome-icon :icon="['fas', 'search-plus']" class="text-xs" />
                  </button>
                  <button
                    type="button"
                    class="justify-center items-center mx-2 my-1 w-8 h-8 focus:outline-none outline-none flex flex-grow border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                    title="Zoom Out"
                    @click="zoomTo(-0.1)"
                    v-tippy="{ arrow: true }"
                  >
                    <font-awesome-icon :icon="['fas', 'search-minus']" class="text-xs" />
                  </button>
                </div>
              </div>

              <div class="flex bg-white mt-4 rounded border justify-center">
                <div class="flex flex-col py-1">
                  <v-popover class="flex">
                    <button
                      type="button"
                      class="justify-center items-center mx-2 my-1 w-8 h-8 focus:outline-none outline-none flex flex-grow border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                      title="Tips"
                      v-tippy="{ arrow: true }"
                    >
                      <font-awesome-icon :icon="['fas', 'question-circle']" class="text-xs" />
                    </button>
                    <template slot="popover">
                      <div class="bg-gray-900 text-xs text-white rounded border p-4 text-left">
                        <div class="font-bold mb-2">Tips:</div>
                        <ul class="tips-list list-disc ml-4">
                          <li>Hold space + drag to start panning</li>
                          <li>Ctrl + "+" to zoom in</li>
                          <li>Ctrl + "-" to zoom out</li>
                          <li>Ctrl + "0" to reset zoom</li>
                        </ul>
                      </div>
                    </template>
                  </v-popover>
                </div>
              </div>
            </div>

            <div class="bottom-actions absolute z-10 flex flex-shrink justify-center">
              <div class="flex bg-white mt-4 rounded border">
                <div class="flex p-4">
                  <ToggleSwitch
                    :options="currentVariantSides"
                    class="mx-1"
                    :value="currentSide"
                    @change="(option) => $store.dispatch('designer/switchSideTo', option.value)"
                  >
                    <template v-slot:default="{ option }">
                      <div class="flex flex-col">
                        <img :src="option.label" width="50" />
                        <div class="text-center mt-1 text-xs">{{ option.value.toUpperCase() }}</div>
                      </div>
                    </template>
                  </ToggleSwitch>
                </div>
              </div>
            </div>
            <div class="inline-block product-section relative w-auto h-auto" id="product-canvas">
              <div
                class="inline-block relative w-auto h-auto"
                :style="{ 'background-color': currentVariant.color }"
              >
                <img
                  draggable="false"
                  class="relative"
                  style="z-index: 2"
                  :src="currentVariant.printable_area[currentSide].placeholder"
                />
              </div>
              <div
                class="printable-area-surface absolute"
                :style="{ left: `${currentVariant.printable_area[currentSide].left}px`, top: `${currentVariant.printable_area[currentSide].top}px`, width: `${currentVariant.printable_area[currentSide].width}px`, height: `${currentVariant.printable_area[currentSide].height}px`, zIndex: 2 }"
                @mouseenter="printableAreaZ = 3"
              ></div>
              <div
                class="printable-area absolute"
                id="printable-area"
                :style="{ left: `${currentVariant.printable_area[currentSide].left}px`, top: `${currentVariant.printable_area[currentSide].top}px`, width: `${currentVariant.printable_area[currentSide].width}px`, height: `${currentVariant.printable_area[currentSide].height}px`, zIndex: printableAreaZ, outlineColor: getCorrectColor(currentVariant.color) }"
                :class="{ '-has-outline': isPrintableAreaHovered || isMoving }"
                @mouseenter="isPrintableAreaHovered = true"
                @mouseleave="printableAreaZ = 1; isPrintableAreaHovered = false"
              >
                <div class="h-full w-full z-10 relative">
                  <drr
                    v-for="(obj, index) in currentVariant.printable_area[currentSide].objects"
                    :key="index"
                    :aspectRatio="obj.editorData.aspectRatio"
                    :w="obj.bounds.width || 50"
                    :h="obj.bounds.height || 50"
                    :x="obj.bounds.left || 0"
                    :y="obj.bounds.top || 0"
                    :angle="obj.bounds.angle || 0"
                    @select="activated(obj)"
                    @deselect="deactivated(obj)"
                    @dragstop="transformStop($event, obj)"
                    @resizestop="transformStop($event, obj)"
                    @rotatestop="transformStop($event, obj)"
                    @drag="transforming($event, obj)"
                    @resize="transforming($event, obj)"
                    @rotate="transforming($event, obj)"
                    @mouseenter="printableAreaZ = 3"
                    :selected="obj.editorData.isActive"
                    :hasActiveContent="obj.editorData.hasActiveContent"
                    @content-active="activateContent(obj)"
                    :resizable="obj.editorData.isResizable"
                    :style="{ zIndex: (index + 1) }"
                    :ref="`obj_${obj.id}_drr`"
                  >
                    <div
                      class="flex flex-wrap w-full h-full relative z-1"
                      v-if="obj.type == 'text'"
                      :style="{
                        ...obj.style,
                        fontSize: `${obj.style.fontSize}px`
                      }"
                      @click.stop
                    >
                      <pre
                        class="w-auto h-auto outline-none focus:outline-none"
                        :ref="`textContainer_${obj.id}`"
                        :style="{ fontFamily: obj.style.fontFamily }"
                        @input="changeText"
                        @blur="deactivateContentOf(obj, $event)"
                      >{{ obj.value || '' }}</pre>
                    </div>
                    <div
                      v-if="obj.type == 'svg'"
                      v-html="obj.value"
                      class="svg-object"
                      :ref="`svgContainer_${obj.id}`"
                      :style="{ fill: obj.style.color }"
                    />
                    <div
                      class="flex w-full h-full items-center justify-center"
                      v-if="obj.type == 'image'"
                    >
                      <img width="100%" :src="obj.value" />
                    </div>
                    <div
                      v-if="obj.editorData.isActive"
                      class="absolute flex rounded-full bg-white w-5 h-5 items-center justify-center"
                      :style="{ fontSize: '.7em', top: '-10px', right: '-10px', zIndex: 1 }"
                      @click="removeObject(obj)"
                    >
                      <font-awesome-icon :icon="['fas', 'times']" class="text-red-600" />
                    </div>
                  </drr>
                </div>
                <div class="absolute top-0 z-1 ruler w-full h-full" v-show="isMoving">
                  <div
                    class="horiz absolute w-full"
                    :style="{ backgroundColor: getCorrectColor(currentVariant.color) }"
                    :class="{ '-highlighted': highlightRuler.horizontal }"
                  ></div>
                  <div
                    class="vert absolute h-full"
                    :style="{ backgroundColor: getCorrectColor(currentVariant.color) }"
                    :class="{ '-highlighted': highlightRuler.vertical }"
                  ></div>
                </div>
              </div>
              <div
                class="printable-area-label"
                v-if="isPrintableAreaHovered"
                :style="{ top: `${currentVariant.printable_area[currentSide].top + currentVariant.printable_area[currentSide].height + 5}px`, color: getCorrectColor(currentVariant.color) }"
              >Printable Area</div>
            </div>
          </div>
        </div>
      </div>

      <VueTailwindDrawer
        position="right"
        ref="layersDrawer"
        :backdrop="false"
        @hidden="rightDrawerHidden"
        width="20%"
      >
        <div class="flex flex-grow flex-col text-gray-600">
          <div class="modal-heading border-b w-full p-4">
            <div class="flex justify-between w-full items-center">
              <div class="flex uppercase">
                <strong>OBJECTS</strong>
              </div>
              <div class="flex text-right">
                <div
                  class="select-none cursor-pointer w-8 h-8 border rounded-full flex justify-center items-center hover:border-gray-600 hover:text-gray-700"
                  @click="toggleDrawer('layersDrawer')"
                >
                  <font-awesome-icon :icon="['fas', 'times']" class="text-xs" />
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-grow">
            <simplebar class="h-full w-full">
              <div class="flex flex-col-reverse w-full">
                <draggable
                  v-model="currentVariant.printable_area[currentSide].objects"
                  @end="layerDragged"
                >
                  <transition-group>
                    <div
                      class="layer items-center py-2 px-4 h-12 select-none flex border"
                      v-for="obj in currentVariant.printable_area[currentSide].objects"
                      :key="obj.id"
                      :class="{ 'bg-gray-100': activeObject && obj.id == activeObject.id }"
                      @click="activated(obj)"
                      @dblclick="(e) => obj.type == 'text' ? activateContent(obj) : false"
                    >
                      <div class="flex flex-grow items-center">
                        <div class="flex">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 37 45"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            v-if="obj.type == 'text'"
                          >
                            <path
                              d="M36.6309 0V9.74805H31.5449L31.0908 4.69238H21.3125V39.416L26.2471 40.2637V44.0781H10.4141V40.2637L15.3486 39.416V4.69238H5.54004L5.11621 9.74805H0V0H36.6309Z"
                              fill="#718096"
                            />
                          </svg>
                          <font-awesome-icon
                            :icon="['far', 'image']"
                            v-if="obj.type == 'image' || obj.type == 'svg'"
                          />
                        </div>
                        <div class="flex pl-3">{{ obj.name }}</div>
                      </div>
                    </div>
                  </transition-group>
                </draggable>
              </div>
            </simplebar>
          </div>
        </div>
      </VueTailwindDrawer>

      <VueTailwindDrawer
        position="right"
        ref="productMetaDrawer"
        @hidden="rightDrawerHidden"
        v-if="designMeta.plan == 'sell'"
      >
        <div class="flex flex-grow flex-col text-gray-600">
          <div class="flex border-b w-full p-4">
            <div class="flex justify-between w-full items-center">
              <div class="flex uppercase">
                <strong>Product Metadata</strong>
              </div>
              <div class="flex text-right">
                <div
                  class="select-none cursor-pointer w-8 h-8 border rounded-full flex justify-center items-center hover:border-gray-600 hover:text-gray-700"
                  @click="toggleDrawer('productMetaDrawer')"
                >
                  <font-awesome-icon :icon="['fas', 'times']" class="text-xs" />
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-grow">
            <simplebar class="h-full w-full">
              <div class="flex p-4">
                <div class="w-full">
                  <div class="mb-3">
                    <label for="product_name" class="font-bold">Product Name</label>
                    <div class="mt-2">
                      <input
                        name="product_name"
                        class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                        type="text"
                        :class="{ 'border-red-400': errors.has('product_name'), 'focus:border-gray-600': !errors.has('name') }"
                        placeholder="Product Name"
                        data-vv-as="Product Name"
                        v-validate="'required'"
                        v-model="tmpProductMetadata.name"
                      />
                    </div>
                    <span
                      class="text-red-700 text-xs pt-1 font-bold inline-block"
                      v-if="errors.has('product_name')"
                    >{{ errors.first('product_name') }}</span>
                  </div>
                  <div>
                    <label for="product_description" class="font-bold">Product Description</label>
                    <div>
                      <WrappedEditor v-model="tmpProductMetadata.description" />
                    </div>
                    <span
                      class="text-red-700 text-xs pt-1 font-bold inline-block"
                      v-if="errors.has('product_description')"
                    >{{ errors.first('product_description') }}</span>
                  </div>
                </div>
              </div>
            </simplebar>
          </div>
          <div class="flex p-4 justify-end border-t">
            <PTButton color="primary" @click="saveProductMetadata">SAVE</PTButton>
          </div>
        </div>
      </VueTailwindDrawer>
    </div>
  </div>
</template>

<script>
import panzoom from 'panzoom'
import Tabs from '@/components/Tabs'
import Select from '@/components/Select'
import ToggleSwitch from '@/components/ToggleSwitch'
import ArtsList from '@/components/Designer/ArtsList'
import ColorRegulator from '~/plugins/color-regulator.js'
import { mapGetters } from 'vuex'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import AvailableProducts from '@/components/Designer/AvailableProducts'
import VueNumericInput from '@/components/VueNumericInput'
import VueTailwindDrawer from '@/components/VueTailwindDrawer'
import VueTailwindAccordion from '@/components/VueTailwindAccordion'
import WrappedEditor from '@/components/WrappedEditor'
import draggable from 'vuedraggable'
let Canvas2Image

let WebFontLoader = null
if (process.client) {
  WebFontLoader = require('webfontloader')
  Canvas2Image = require('~/plugins/canvas2image').default
}

export default {
  layout: 'designer',
  components: {
    Tabs,
    Select,
    ToggleSwitch,
    ArtsList,
    vSelect,
    AvailableProducts,
    VueNumericInput,
    WrappedEditor,
    VueTailwindDrawer,
    VueTailwindAccordion,
    draggable
  },
  async created() {
    WebFontLoader.load({
      google: {
        families: _.map(this.webfonts, 'value')
      }
    })
    this.currentProduct = JSON.parse(JSON.stringify(this.selectedProducts[0]))
    this.currentVariant = this.currentProduct.variants[0]
    this._calculateEstProfit()
    this.isLoading = false
    this.$nextTick(() => {
      this._registerCanvasEvents()
    })
  },
  data() {
    return {
      autoSavingText: 'Saving...',
      autoSaving: false,
      autoSaveTimeout: null,
      isLayersCollapsed: false,
      productDescriptionEditor: null,
      estimatedMinProfit: 0,
      estimatedMaxProfit: 0,
      fontSizeTimeout: null,
      isMarketPlanCollapsed:
        this.$storage.getLocalStorage('is_plan_collapsed') == undefined
          ? true
          : this.$storage.getLocalStorage('is_plan_collapsed'),
      marketPlan: true,
      isLoading: false,
      tmpProducts: [],
      arrowKeysTimeout: null,
      isPrintableAreaHovered: false,
      canvasScale: 1.0,
      selectedFont: null,
      currentProduct: null,
      currentVariant: null,
      activeObject: null,
      isMoving: false,
      highlightRuler: {
        vertical: false,
        horizontal: false
      },
      printableAreaZ: 2,
      isHoldingSpace: false,
      stageCursor: 'initial',
      stageContainer: null,
      panzoomController: null,
      canvasSection: null,
      isPanning: false,
      activeObjectIndex: 0,
      tmpProductMetadata: {
        name: '',
        description: '',
        tags: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      textColors: 'designer/textColors',
      selectedProducts: 'designer/selectedProducts',
      currentProductIndex: 'designer/currentProductIndex',
      currentVariantIndex: 'designer/currentVariantIndex',
      webfonts: 'designer/webfonts',
      currentSide: 'designer/currentSide',
      currentDesignId: 'designer/currentDesignId',
      designMeta: 'designer/designMeta'
    }),
    activeObjectCanBeColored() {
      if (!this.activeObject) return false
      return _.includes(['text', 'svg'], this.activeObject.type)
    },
    currentVariantSides() {
      return _.map(this.currentVariant.printable_area, (area, key) => ({
        label: area.placeholder,
        value: key
      }))
    }
  },
  methods: {
    _reverseObjects(objects) {
      return JSON.parse(JSON.stringify(objects)).reverse()
    },
    layerDragged(e) {
      this.$store.commit(
        'designer/CURRENT_VARIANT_PROPERTIES',
        this.currentVariant.printable_area[this.currentSide].objects
      )
      this.$nextTick(() => {
        this.activated(
          this.currentVariant.printable_area[this.currentSide].objects[
            e.newIndex
          ]
        )
      })
    },
    rightDrawerHidden() {
      this.$nextTick(() => {
        this.tmpProductMetadata = {
          name: '',
          description: '',
          tags: ''
        }
      })
    },
    async saveProductMetadata() {
      let res = await this.$validator.validate()
      if (!res) return
      this.$store.commit(
        'designer/CURRENT_PRODUCT_META',
        this.tmpProductMetadata
      )
      this.$refs.productMetaDrawer.hide()
    },
    toggleDrawer(drawer) {
      if (this.$refs[drawer].isShown) {
        this.$refs[drawer].hide()
        return
      }
      this.$refs[drawer].show()
    },
    changeCurrentProductPlan({ value }) {
      let plan = 'buy'
      if (value) plan = 'sell'
      this.$store.commit('designer/DESIGN_PLAN', plan)
    },
    setQuantityAndPrice(n, p, v) {
      this.$store.commit('designer/CURRENT_VARIANT_PROPERTIES', {
        path: `sizes.${n}.${p}`,
        value: v
      })
      if (this.designMeta.plan == 'buy') return
      this._calculateEstProfit()
    },
    _calculateEstProfit() {
      let totalProfit = 0
      _.map(this.selectedProducts, product => {
        _.map(product.variants, variant => {
          _.map(variant.sizes, (size, k) => {
            let availableSize = _.find(
              variant.available_sizes,
              s => s.name == k
            )
            if (!availableSize) return
            let baseCost = availableSize.base_cost
            let totalForPrintree = baseCost * size.quantity
            let totalWithCustomerPrice = size.price * size.quantity
            let net = totalWithCustomerPrice - totalForPrintree
            totalProfit += net
          })
        })
      })
      let minProfit = totalProfit - totalProfit * 0.05
      let maxProfit = totalProfit + totalProfit * 0.05
      this.estimatedMinProfit = minProfit
      this.estimatedMaxProfit = maxProfit
      this.$nextTick(() => {
        if (this.$refs.estMinProfit) this.$refs.estMinProfit.play()
        this.$refs.estMaxProfit.play()
      })
    },
    togglePlanSection() {
      this.isMarketPlanCollapsed = !this.isMarketPlanCollapsed
      this.$storage.setLocalStorage(
        'is_plan_collapsed',
        this.isMarketPlanCollapsed
      )
    },
    _firstPrintableArea(variant) {
      let areas = _.keys(variant.printable_area)
      return _.includes(areas, 'front') ? 'front' : _.head(areas)
    },
    _registerCanvasEvents() {
      document.firstElementChild.style.zoom = 'reset'
      this.stageContainer = document.querySelector('.panzoom-container')
      this.canvasSection = document.querySelector('.canvas-section')
      this.canvasSection.tabIndex = 1
      this.canvasSection.focus()

      this.panzoomController = panzoom(
        document.querySelector('.product-section'),
        {
          beforeWheel(e) {
            let shouldIgnore = !e.altKey
            return shouldIgnore
          },
          onDoubleClick(e) {
            return false
          }
        }
      )
      this.panzoomController.pause()

      this.canvasSection.addEventListener('dblclick', evt => {
        this.panzoomController.pause()
      })

      this.canvasSection.addEventListener('keypress', evt => {
        if (evt.which == 32) {
          this.isHoldingSpace = true
          this.stageCursor = 'grab'
          return
        }
        this.isHoldingSpace = false
      })

      this.canvasSection.addEventListener('mousemove', e => {
        if (this.isHoldingSpace) {
          this.isPanning = true
          this.panzoomController.resume()
          return
        }
      })

      document.addEventListener('keydown', evt => {
        // Left
        if (evt.which == 37 && this.activeObject) {
          this._updateActiveObjectProps(
            'bounds.left',
            this.activeObject.bounds.left - 1
          )
          this.isMoving = true
          return
        }
        // Up
        if (evt.which == 38 && this.activeObject) {
          this._updateActiveObjectProps(
            'bounds.top',
            this.activeObject.bounds.top - 1
          )
          this.isMoving = true
          return
        }
        // Right
        if (evt.which == 39 && this.activeObject) {
          this._updateActiveObjectProps(
            'bounds.left',
            this.activeObject.bounds.left + 1
          )
          this.isMoving = true
          return
        }
        // Down
        if (evt.which == 40 && this.activeObject) {
          this._updateActiveObjectProps(
            'bounds.top',
            this.activeObject.bounds.top + 1
          )
          this.isMoving = true
          return
        }
      })

      document.addEventListener('keyup', evt => {
        if (_.includes([37, 38, 39, 40], evt.which) && this.activeObject) {
          clearTimeout(this.arrowKeysTimeout)
          this.arrowKeysTimeout = setTimeout(() => {
            this.$nextTick(() => {
              this.isMoving = false
            })
          }, 1000)
          return
        }

        if (evt.which == 46) {
          if (!this.activeObject) return
          this.removeObject(this.activeObject)
          return
        }
      })

      this.canvasSection.addEventListener('keydown', evt => {
        if (evt.ctrlKey && (evt.which == 107 || evt.which == 187)) {
          evt.preventDefault()
          this.zoomTo(0.1)
          return
        }
        if (evt.ctrlKey && (evt.which == 109 || evt.which == 189)) {
          evt.preventDefault()
          this.zoomTo(-0.1)
          return
        }
        if (evt.ctrlKey && (evt.which == 48 || evt.which == 96)) {
          evt.preventDefault()
          this.zoomTo('reset')
          return
        }
        if (evt.ctrlKey && evt.which == 66) {
          evt.preventDefault()
          if (this.activeObject.type != 'text') return
          this.toggleFontWeight(
            this.activeObject.style.fontWeight == 'bold' ? 'normal' : 'bold'
          )
          return
        }
        if (evt.ctrlKey && evt.which == 73) {
          evt.preventDefault()
          if (this.activeObject.type != 'text') return
          this.toggleFontStyle(
            this.activeObject.style.fontStyle == 'italic' ? 'normal' : 'italic'
          )
          return
        }
        if (evt.ctrlKey && evt.which == 85) {
          evt.preventDefault()
          if (this.activeObject.type != 'text') return
          this.toggleTextDecoration('underline')
          return
        }
        if (evt.ctrlKey && evt.which == 75) {
          evt.preventDefault()
          if (this.activeObject.type != 'text') return
          this.toggleTextDecoration('line-through')
          return
        }
      })

      this.canvasSection.addEventListener('keyup', evt => {
        if (evt.which == 32) {
          this.isHoldingSpace = false
          this.stageCursor = 'initial'
          this.isPanning = false
          this.panzoomController.pause()
          return
        }
      })
    },
    manageProducts() {
      let selectedProductIds = _.map(this.selectedProducts, 'id')
      let tmpProductIds = _.map(this.tmpProducts, 'id')
      this.tmpProducts = _.map(this.tmpProducts, product => {
        if (_.includes(selectedProductIds, product.id)) {
          let index = _.indexOf(selectedProductIds, product.id)
          product = JSON.parse(JSON.stringify(this.selectedProducts[index]))
        }
        if (!product.meta)
          product.meta = {
            name: '',
            description: '',
            tags: ''
          }
        return product
      })
      this.$store.dispatch('designer/setSelectedProducts', this.tmpProducts)
      let productIndex = this.currentProductIndex
      if (!this.selectedProducts[productIndex]) productIndex = 0
      this.currentProduct = JSON.parse(
        JSON.stringify(this.selectedProducts[productIndex])
      )
      this.currentVariant = this.currentProduct.variants[0]
      this.tmpProducts = []
      this.$refs.availableProductsModal.hide()
    },
    alignObject(pos, val) {
      if (!this.activeObject) return
      this._updateActiveObjectProps(`bounds.${pos}`, val)
      this.$store.dispatch(
        'designer/copyPropsToAllVariantsFrom',
        this.activeObject
      )
    },
    async moveObjectPosition(obj, newIndex) {
      if (!obj) return
      const newObjects = await this.$store.dispatch(
        'designer/moveObjectPosition',
        {
          obj: obj,
          newIndex
        }
      )
      this.currentVariant.printable_area[this.currentSide].objects = JSON.parse(
        JSON.stringify(newObjects)
      )
    },
    async duplicate() {
      if (!this.activeObject) return
      let newObject = await this.$store.dispatch(
        'designer/duplicate',
        JSON.parse(JSON.stringify(this.activeObject))
      )
      this.currentVariant.printable_area[this.currentSide].objects.push(
        newObject
      )
      this.activated(newObject)
      this.$store.dispatch('designer/copyPropsToAllVariantsFrom', newObject)
    },
    activateContent(obj) {
      this.activated(obj)
      if (obj.type == 'text') {
        this.$refs[`textContainer_${obj.id}`][0].contentEditable = true
        this.$refs[`textContainer_${obj.id}`][0].innerText = ''
        this.$refs[`textContainer_${obj.id}`][0].innerText = obj.value
        this.$refs[`textContainer_${obj.id}`][0].focus()
      }
    },
    async deactivateContentOf(obj, e) {
      if (obj.type == 'text') {
        this.$refs[`textContainer_${obj.id}`][0].contentEditable = false
        this.$refs[`obj_${obj.id}_drr`][0].$emit('content-inactive')
      }
    },
    showAvailableProducts() {
      this.$refs.availableProductsModal.show()
    },
    hideAvailableProducts() {
      this.$refs.availableProductsModal.hide()
    },
    async addVariant(variant) {
      if (
        _.find(this.currentProduct.variants, { color: variant.color }) &&
        this.currentProduct.variants.length == 1
      )
        return
      if (_.find(this.currentProduct.variants, { color: variant.color })) {
        let variantIndex = await this.$store.dispatch(
          'designer/removeVariant',
          variant
        )
        this.currentProduct.variants.splice(variantIndex, 1)
        this.selectVariant(
          variantIndex ? variantIndex - 1 : variantIndex,
          this.currentProductIndex
        )
        return
      }
      let newVariant = await this.$store.dispatch(
        'designer/addVariant',
        variant
      )
      this.currentProduct.variants.push(JSON.parse(JSON.stringify(newVariant)))
      this.selectVariant(
        this.currentProduct.variants.length - 1,
        this.currentProductIndex
      )
    },
    zoomTo(scale) {
      if (scale == 'reset') return (this.canvasScale = 1.0)
      this.canvasScale += scale
    },
    _colorIsInVariantsOf(product, color) {
      return _.find(
        product.variants,
        variant => variant.color.toLowerCase() == color.toLowerCase()
      )
    },
    artAdded(file, res) {
      let type = 'image'
      let value = file.dataURL
      if (file.type == 'image/svg+xml') {
        type = 'svg'
        value = res.files.file
      }
      this.addObject(type, value, file.name)
      this.$refs.artsModal.hide()
    },
    async addObject(type, value = '', name = null) {
      let newObject = await this.$store.dispatch('designer/addObject', {
        type,
        value
      })
      newObject = JSON.parse(JSON.stringify(newObject))
      newObject.name = name
      if (type == 'image') {
        let i = new Image()
        i.onload = () => {
          let ratio = 0
          if (
            i.width > this.currentVariant.printable_area[this.currentSide].width
          ) {
            ratio =
              this.currentVariant.printable_area[this.currentSide].width /
              i.width
            newObject.bounds.width = i.width * ratio
            newObject.bounds.height = i.height * ratio
          }
          if (
            newObject.bounds.height >
            this.currentVariant.printable_area[this.currentSide].height
          ) {
            ratio =
              this.currentVariant.printable_area[this.currentSide].height /
              i.height
            newObject.bounds.width = i.width * ratio
            newObject.bounds.height = i.height * ratio
          }
          newObject.bounds.left = newObject.bounds.width / 2 || 20
          newObject.bounds.top = newObject.bounds.height / 2 || 20
          this.currentVariant.printable_area[this.currentSide].objects.push(
            newObject
          )
          this.activated(newObject)
          this.$store.dispatch('designer/copyPropsToAllVariantsFrom', newObject)
        }
        i.src = value
        return
      }
      if (type == 'text' || type == 'svg') {
        let el = document.createElement('div')
        el.innerHTML = value
        el.style.position = 'absolute'
        el.style.visibility = 'hidden'
        el.style.display = 'block'

        document.body.appendChild(el)
        newObject.bounds.width = el.offsetWidth
        newObject.bounds.height = el.offsetHeight
        let ratio = 0
        if (
          el.offsetWidth >
          this.currentVariant.printable_area[this.currentSide].width
        ) {
          ratio =
            this.currentVariant.printable_area[this.currentSide].width /
            el.offsetWidth
          newObject.bounds.width = el.offsetWidth * ratio
          newObject.bounds.height = el.offsetHeight * ratio
        }
        if (
          newObject.bounds.height >
          this.currentVariant.printable_area[this.currentSide].height
        ) {
          ratio =
            this.currentVariant.printable_area[this.currentSide].height /
            el.offsetHeight
          newObject.bounds.width = el.offsetWidth * ratio
          newObject.bounds.height = el.offsetHeight * ratio
        }

        newObject.bounds.left = newObject.bounds.width / 2 || 20
        newObject.bounds.top = newObject.bounds.height / 2 || 20

        document.body.removeChild(el)
        el = null
      }
      this.currentVariant.printable_area[this.currentSide].objects.push(
        newObject
      )
      this.activated(newObject)
      this.$store.dispatch('designer/copyPropsToAllVariantsFrom', newObject)
    },
    async removeObject(obj) {
      let index = await this.$store.dispatch('designer/removeObject', obj)
      this.currentVariant.printable_area[this.currentSide].objects.splice(
        index,
        1
      )
      this.activeObject = null
    },
    hasTextDecoration(decoration) {
      return _.includes(this.activeObject.style.textDecoration, decoration)
    },
    toggleFontWeight(fontWeight) {
      this._updateActiveObjectProps('style.fontWeight', fontWeight)
      this.$nextTick(() => {
        this._updateActiveObjectProps(
          'bounds.width',
          this.$refs[`textContainer_${this.activeObject.id}`][0].offsetWidth
        )
        this._updateActiveObjectProps(
          'bounds.height',
          this.$refs[`textContainer_${this.activeObject.id}`][0].offsetHeight
        )
        this.$store.dispatch(
          'designer/copyPropsToAllVariantsFrom',
          this.activeObject
        )
      })
    },
    toggleFontStyle(fontStyle) {
      this._updateActiveObjectProps('style.fontStyle', fontStyle)
      this.$nextTick(() => {
        this._updateActiveObjectProps(
          'bounds.width',
          this.$refs[`textContainer_${this.activeObject.id}`][0].offsetWidth
        )
        this._updateActiveObjectProps(
          'bounds.height',
          this.$refs[`textContainer_${this.activeObject.id}`][0].offsetHeight
        )
        this.$store.dispatch(
          'designer/copyPropsToAllVariantsFrom',
          this.activeObject
        )
      })
    },
    toggleTextDecoration(decoration) {
      let newDecoration = this.activeObject.style.textDecoration
      newDecoration = this.hasTextDecoration(decoration)
        ? newDecoration.replace(decoration, '')
        : newDecoration + ` ${decoration}`
      newDecoration = newDecoration.trim()
      this._updateActiveObjectProps(
        'style.textDecoration',
        JSON.parse(JSON.stringify(newDecoration))
      )
      this.$nextTick(() => {
        this._updateActiveObjectProps(
          'bounds.width',
          this.$refs[`textContainer_${this.activeObject.id}`][0].offsetWidth
        )
        this._updateActiveObjectProps(
          'bounds.height',
          this.$refs[`textContainer_${this.activeObject.id}`][0].offsetHeight
        )
        this.$store.dispatch(
          'designer/copyPropsToAllVariantsFrom',
          this.activeObject
        )
      })
    },
    changeFontFamily(font) {
      this._updateActiveObjectProps('style.fontFamily', font.value)
      this.$nextTick(() => {
        this._updateActiveObjectProps(
          'bounds.width',
          this.$refs[`textContainer_${this.activeObject.id}`][0].offsetWidth
        )
        this._updateActiveObjectProps(
          'bounds.height',
          this.$refs[`textContainer_${this.activeObject.id}`][0].offsetHeight
        )
        this.$store.dispatch(
          'designer/copyPropsToAllVariantsFrom',
          this.activeObject
        )
      })
    },
    changeFontSize(fontSize) {
      clearTimeout(this.fontSizeTimeout)

      this.activeObject.bounds.width = this.$refs[
        `textContainer_${this.activeObject.id}`
      ][0].offsetWidth
      this.activeObject.bounds.height = this.$refs[
        `textContainer_${this.activeObject.id}`
      ][0].offsetHeight
      let tmpObj = JSON.parse(JSON.stringify(this.activeObject))

      this.fontSizeTimeout = setTimeout(() => {
        this._updateActiveObjectProps('style.fontSize', fontSize.value, tmpObj)
        this._updateActiveObjectProps(
          'bounds.width',
          this.$refs[`textContainer_${this.activeObject.id}`][0].offsetWidth,
          tmpObj
        )
        this._updateActiveObjectProps(
          'bounds.height',
          this.$refs[`textContainer_${this.activeObject.id}`][0].offsetHeight,
          tmpObj
        )
        this.$store.dispatch('designer/copyPropsToAllVariantsFrom', tmpObj)
      }, 800)
    },
    changeText(e) {
      this._updateActiveObjectProps('name', e.target.innerText)
      this._updateActiveObjectProps('value', e.target.innerText)
      this._updateActiveObjectProps(
        'bounds.width',
        this.$refs[`textContainer_${this.activeObject.id}`][0].offsetWidth
      )
      this._updateActiveObjectProps(
        'bounds.height',
        this.$refs[`textContainer_${this.activeObject.id}`][0].offsetHeight
      )
      this.$store.dispatch(
        'designer/copyPropsToAllVariantsFrom',
        this.activeObject
      )
    },
    selectProduct(index) {
      if (index == this.currentProductIndex) return
      this.$store.commit('designer/CURRENT_PRODUCT_INDEX', index)
      this.$store.commit('designer/CURRENT_VARIANT_INDEX', 0)
    },
    selectVariant(index, productIndex) {
      if (productIndex != this.currentProductIndex) {
        this.selectProduct(productIndex)
        index = 0
      }
      this.$store.commit('designer/CURRENT_VARIANT_INDEX', index)
    },
    activated(obj) {
      this.activeObject = obj
      this.activeObjectIndex = _.findIndex(
        this.currentVariant.printable_area[this.currentSide].objects,
        { id: obj.id }
      )
      _.map(
        this.currentVariant.printable_area[this.currentSide].objects,
        ob => {
          this._updateActiveObjectProps('editorData.isActive', false, ob)
        }
      )
      this._updateActiveObjectProps('editorData.isActive', true)
    },
    _updateActiveObjectProps(path, value, ob = null) {
      if (!ob) ob = this.activeObject
      ob = _.set(ob, path, value)
      this.$store.commit('designer/OBJECT_PROPERTIES', {
        id: ob.id,
        path: path,
        value: value
      })
    },
    deactivated() {
      if (!this.activeObject) return
      this._updateActiveObjectProps('editorData.isActive', false)
    },
    transforming({ x, y, w, h, angle }, obj) {
      // let gridX = (this.currentVariant.printable_area[currentSide].width / 2) - (w / 2)
      // let gridY = (this.currentVariant.printable_area[currentSide].height / 2) - (h / 2)
      // this.highlightRuler.vertical = (gridX == x) || ((x - (w / 2)) == gridX) || ((x + (w / 2)) == gridX)
      // this.highlightRuler.horizontal = (gridY == y) || ((y - (h / 2)) == gridY) || ((y + (h / 2)) == gridY)
      this.isMoving = true
    },
    transformStop({ x, y, w, h, angle }, obj) {
      this._updateActiveObjectProps('bounds.left', x)
      this._updateActiveObjectProps('bounds.top', y)
      this._updateActiveObjectProps('bounds.width', w)
      this._updateActiveObjectProps('bounds.height', h)
      this._updateActiveObjectProps('bounds.angle', angle)
      this.$store.dispatch(
        'designer/copyPropsToAllVariantsFrom',
        this.activeObject
      )
      this.isMoving = false
    },
    setColorTo(color) {
      this._updateActiveObjectProps('style.color', color.code)
    },
    getCorrectColor(hex) {
      return ColorRegulator.getContrastOf(hex)
    }
  },
  watch: {
    currentProduct: {
      immediate: true,
      handler(to) {
        if (!to || (to && !to.meta)) return
        this.tmpProductMetadata = JSON.parse(JSON.stringify(to.meta))
      }
    },
    currentProductIndex: {
      immediate: true,
      handler(to) {
        if (!this.selectedProducts.length) return
        this.currentProduct = JSON.parse(
          JSON.stringify(this.selectedProducts[to])
        )
        this.currentVariant = this.currentProduct.variants[0]
        this.deactivated()
        this.activeObject = null
        this.activeObjectIndex = null
      }
    },
    currentVariantIndex: {
      immediate: true,
      handler(to) {
        if (!this.selectedProducts.length) return
        this.currentVariant = JSON.parse(
          JSON.stringify(
            this.selectedProducts[this.currentProductIndex].variants[to]
          )
        )
        this.deactivated()
        this.activeObject = null
        this.activeObjectIndex = 0
      }
    },
    stageCursor(newCursor) {
      if (!this.stageContainer) return
      this.canvasSection.style.cursor = newCursor
    },
    canvasScale(newScale) {
      if (!this.stageContainer) return
      let transform = this.panzoomController.getTransform()
      let deltaX = transform.x
      let deltaY = transform.y
      let oldScale = transform.scale
      let offsetX = 0.1 + deltaX
      let offsetY = 0.1 + deltaY
      this.panzoomController.zoomAbs(offsetX, offsetY, newScale)
    },
    selectedProducts: {
      deep: true,
      handler(to) {
        clearTimeout(this.autoSaveTimeout)
        this.autoSaveTimeout = setTimeout(async () => {
          this.autoSaving = true
          this.autoSavingText = 'Saving...'
          await this.$store.dispatch('designer/saveData')
          this.autoSavingText = 'Saved!'
          setTimeout(() => {
            this.autoSaving = false
          }, 1000)
        }, 3000)
      }
    }
  }
}
</script>
