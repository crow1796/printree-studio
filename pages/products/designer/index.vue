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
          <div
            class="flex modal-footer justify-between p-4 border-t items-center"
          >
            <a
              href="#"
              class="text-blue-400 cursor-help border-dashed border-b hover:border-blue-400"
              >{{ tmpProducts.length }} Products Selected</a
            >
            <button
              type="button"
              class="border border-white bg-primary px-8 py-2 font-bold rounded text-white hover:bg-primary-lighter"
              @click="manageProducts"
            >
              CONTINUE
            </button>
          </div>
        </div>
      </VueTailwindDrawer>

      <div class="flex w-1/4 border-r flex-grow flex-col">
        <div class="flex overflow-hidden w-full flex-grow flex-col overflow-auto flex-grow">
          <div class="mx-4 mt-4 px-4 h-24 flex-shrink-0 cursor-pointer hover:bg-gray-100 select-none text-gray-600 w-auto justify-center items-center flex border rounded border-dashed"
              @click="showAvailableProducts">
            <font-awesome-icon :icon="['fas', 'cubes']"
              class="mr-2 text-lg"/>
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
                      :src="
                        product.variants[0].printable_area[
                          _firstPrintableArea(product.variants[0])
                        ].placeholder
                      "
                    />
                  </div>
                  <div class="flex-grow flex flex-col px-4 py-2">
                    <div
                      class="font-bold text-gray-600"
                      style="width: 180px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                    >
                      {{ product.name }}
                    </div>
                    <div class="flex">
                      <v-popover class="flex">
                        <div
                          class="rounded-full p-1 border border-white m-1 bg-white border-gray-300 hover:border-gray-400 hover:text-gray-700"
                          v-if="product.availableVariants.length > 1"
                        >
                          <div
                            class="flex justify-center items-center rounded-full cursor-pointer w-6 h-6 bg-white"
                          >
                            <font-awesome-icon
                              :icon="['fas', 'plus']"
                              class="text-xs"
                            />
                          </div>
                        </div>
                        <template slot="popover">
                          <div class="bg-white w-64 border rounded shadow-xl">
                            <div class="flex flex-col w-full">
                              <div class="font-bold text-gray-600 p-2 border-b">
                                Choose a color
                              </div>
                              <div class="flex p-2">
                                <div
                                  class="rounded-full p-1 border border-white m-1 hover:border-gray-300"
                                  v-for="(variant,
                                  variantIndex) in currentProduct.availableVariants"
                                  :key="variantIndex"
                                  :class="{
                                    'border-gray-300 bg-white': _colorIsInVariantsOf(
                                      currentProduct,
                                      variant.color
                                    )
                                  }"
                                  @click="addVariant(variant)"
                                >
                                  <div
                                    class="flex justify-center items-center rounded-full cursor-pointer w-6 h-6 border border-gray-200"
                                    :style="{
                                      'background-color': variant.color
                                    }"
                                  >
                                    <font-awesome-icon
                                      :icon="['fas', 'check']"
                                      :style="{
                                        color: getCorrectColor(variant.color),
                                        fontSize: '.8em'
                                      }"
                                      v-if="
                                        _colorIsInVariantsOf(
                                          currentProduct,
                                          variant.color
                                        )
                                      "
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
                        :class="{
                          'border-gray-300 bg-white':
                            index == currentProductIndex &&
                            variantIndex == currentVariantIndex
                        }"
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
        <div class="flex flex-shrink flex-col overflow-hidden w-full border-t text-gray-600"
          :style="{ transition: 'all .3s ease', height: !isMarketPlanCollapsed ? (designMeta.plan == 'sell' ? '25rem' : '22rem') : '77px' }">
          <div class="flex border-b p-4 justify-between cursor-pointer hover:text-gray-700 hover:bg-gray-100"
            @click="togglePlanSection">
            <div class="flex flex-col">
              <div class="flex items-center mb-1">
                <span class="font-bold mr-1">I WANT TO</span>
                <div @click.stop>
                  <toggle-button
                    :value="designMeta.plan == 'sell'"
                    :labels="{ checked: 'SELL', unchecked: 'BUY' }"
                    :color="{ checked: '#E1274E', unchecked: '#63b3ed' }"
                    :width="60"
                    @change="changeCurrentProductPlan"
                  />
                </div>
                <span class="font-bold ml-1">
                  THIS PRODUCT
                </span>
              </div>
              <div class="text-xs">
                {{
                  designMeta.plan == 'sell'
                    ? '100% FREE ● NO INVENTORY'
                    : 'BULK DISCOUNTS ● IMMEDIATE FULFILLMENT'
                }}
              </div>
            </div>
            <div class="flex justify-center items-center">
              <font-awesome-icon
                :icon="[
                  'fas',
                  !isMarketPlanCollapsed ? 'caret-down' : 'caret-up'
                ]"
              />
            </div>
          </div>
          <div class="flex h-full w-full flex flex-col">
            <div class="flex px-4 py-2 border-b">
              <div class="w-2/12 flex-shrink-0 font-bold px-1">Size</div>
              <div class="w-3/12 flex-shrink-0 font-bold px-1">
                {{ designMeta.plan == 'sell' ? 'Base Cost' : 'Price (₱)' }}
              </div>
              <div class="font-bold flex-grow px-1">Quantity</div>
              <div
                class="w-3/12 flex-shrink-0 font-bold px-1"
                v-if="designMeta.plan == 'sell'"
              >
                Price (₱)
              </div>
            </div>
            <simplebar class="overflow-auto px-4 pb-3">
              <div class="flex w-full">
                <div class="flex flex-col w-full">
                  <div
                    class="flex mt-3 items-center"
                    v-for="(size, index) in currentVariant.available_sizes"
                    :key="`${currentVariant.id}_${index}`"
                  >
                    <div class="flex flex-shrink-0 w-2/12 px-1">
                      {{ size.name }}
                    </div>
                    <div class="flex flex-shrink-0 w-3/12 px-1">
                      {{ size.base_cost.formatMoney('₱ ') }}
                    </div>
                    <div class="flex flex-grow px-1">
                      <VueNumericInput
                        class="h-8"
                        align="center"
                        :min="0"
                        :value="currentVariant.sizes[size.name].quantity"
                        @input="
                          setQuantityAndPrice(size.name, 'quantity', $event)
                        "
                        style="width: 80%"
                      />
                    </div>
                    <div
                      class="flex flex-shrink-0 w-3/12 px-1"
                      v-if="designMeta.plan == 'sell'"
                    >
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
                  :format="num => num.formatMoney('₱ ')"
                  :duration="0.4"
                />
                <font-awesome-icon
                  v-if="estimatedMinProfit"
                  :icon="['fas', 'minus']"
                />
                <number
                  animationPaused
                  ref="estMaxProfit"
                  :to="estimatedMaxProfit"
                  :format="num => num.formatMoney('₱ ')"
                  :duration="0.4"
                />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-grow h-full flex-col w-3/4">
        <DesignerTabs v-model="selectedTab"/>
        <PanzoomContainer :class="{'bg-gray-300': selectedTab === 'designer'}" :isEnabled="selectedTab === 'designer'" ref="panzoomController">
          <transition name="fade" v-if="selectedTab === 'designer'">
            <div class="auto-save uppercase font-bold absolute rounded top-0 right-0 w-24 py-1 mt-4 mr-4 text-gray-600 text-xs border bg-white"
              v-if="autoSaving"
              style="animation-duration: .3s;">
              {{ autoSavingText }}
            </div>
          </transition>

          <div class="top-actions absolute z-10 flex flex-shrink justify-center w-full" v-if="selectedTab === 'designer'">
            <div class="flex bg-white ml-2 mt-4 py-2 px-1 rounded border items-center"
              v-if="activeObject && (activeObject.type == 'text' || activeObject.type == 'svg')">
              <v-popover class="flex">
                <button type="button"
                  class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-6 h-6 font-bold rounded-full text-gray-600 border-grey-lightest hover:border-gray-400 text-xs"
                  :style="{ backgroundColor: activeObject.style.color }"
                  title="Color"
                  v-if="activeObjectCanBeColored"
                  v-tippy="{ arrow: true }">
                </button>
                <template slot="popover">
                  <div class="bg-white w-64 border rounded shadow-xl">
                    <div class="colors flex flex-wrap">
                      <div class="rounded-full p-1 bg-white border m-1 hover:border-gray-300"
                        v-for="(color, index) in textColors"
                        :key="index"
                        @click="setColorTo(color)"
                        :class="{ 'border-gray-400': activeObject && activeObject.style.color == color.code, 'border-white': !activeObject || activeObject.style.color != color.code }">
                        <div class="justify-center items-center flex rounded-full cursor-pointer w-8 h-8 border border-gray-200"
                          :style="{ 'background-color': color.code }">
                          <font-awesome-icon :icon="['fas', 'check']"
                            :style="{ color: getCorrectColor(color.code) }"
                            v-if="activeObject && activeObject.style.color.toLowerCase() == color.code.toLowerCase()"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </v-popover>
              <div class="flex" v-if="activeObject && activeObject.type == 'text'">
                <div class="w-48 px-1 h-8 z-10 items-center">
                  <v-select :options="webfonts"
                    class="flex-grow h-full text-sm"
                    :value="activeObject.style.fontFamily"
                    @input="changeFontFamily">
                    <template slot="option" slot-scope="item">
                      <span :style="{ fontFamily: item.value }">
                        {{ item.label }}
                      </span>
                    </template>
                  </v-select>
                </div>
                <button type="button"
                  class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                  :class="{ 'bg-gray-300': activeObject.style.fontWeight == 'bold' }"
                  @click="toggleFontWeight(activeObject.style.fontWeight == 'bold' ? 'normal' : 'bold')"
                  title="Bold (Ctrl + B)"
                  v-tippy="{ arrow: true }">
                  <font-awesome-icon :icon="['fas', 'bold']"/>
                </button>
                <button
                  type="button"
                  class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                  :class="{ 'bg-gray-300': activeObject.style.fontStyle == 'italic' }"
                  @click="toggleFontStyle(activeObject.style.fontStyle == 'italic' ? 'normal' : 'italic')"
                  title="Italic (Ctrl + I)"
                  v-tippy="{ arrow: true }">
                  <font-awesome-icon :icon="['fas', 'italic']"/>
                </button>
                <button
                  type="button"
                  class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                  :class="{ 'bg-gray-300': hasTextDecoration('underline') }"
                  @click="toggleTextDecoration('underline')"
                  title="Underline (Ctrl + U)"
                  v-tippy="{ arrow: true }">
                  <font-awesome-icon :icon="['fas', 'underline']"/>
                </button>
                <button
                  type="button"
                  class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                  :class="{ 'bg-gray-300': hasTextDecoration('line-through') }"
                  @click="toggleTextDecoration('line-through')"
                  title="Strikethrough (Ctrl + K)"
                  v-tippy="{ arrow: true }">
                  <font-awesome-icon :icon="['fas', 'strikethrough']"/>
                </button>
                <VueNumericInput :min="0"
                  @input="changeFontSize({value: $event})"
                  v-model="activeObject.style.fontSize"
                  align="center"
                  style="width: 90px"
                  class="ml-1"/>
              </div>
            </div>
            <div class="flex bg-white ml-2 mt-4 py-2 px-1 rounded border"
              v-if="activeObject">
              <button type="button"
                class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                title="Align Left"
                @click="alignObject('left', activeObject.bounds.width / 2)"
                v-tippy="{ arrow: true }">
                <svg width="13" height="13" viewBox="0 0 51 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="4" height="54" rx="2" fill="#718096"/>
                  <rect x="12" y="21" width="11" height="39" rx="2" transform="rotate(-90 12 21)" fill="#718096"/>
                  <rect x="12" y="44" width="11" height="27" rx="2" transform="rotate(-90 12 44)" fill="#718096"/>
                </svg>
              </button>
              <button type="button"
                class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                title="Align Horizontal Center"
                @click="alignObject('left', (currentVariant.printable_area[currentSide].width / 2))"
                v-tippy="{ arrow: true }">
                <svg width="13" height="13" viewBox="0 0 39 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="17" width="4" height="54" rx="2" fill="#718096"/>
                  <rect y="21" width="11" height="39" rx="2" transform="rotate(-90 0 21)" fill="#718096"/>
                  <rect x="6" y="44" width="11" height="27" rx="2" transform="rotate(-90 6 44)" fill="#718096"/>
                </svg>
              </button>
              <button type="button"
                class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                title="Align Right"
                @click="alignObject('left', (currentVariant.printable_area[currentSide].width) - (activeObject.bounds.width / 2))"
                v-tippy="{ arrow: true }">
                <svg width="13" height="13" viewBox="0 0 51 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="4" height="54" rx="2" transform="matrix(-1 0 0 1 51 0)" fill="#718096"/>
                  <rect width="11" height="39" rx="2" transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 39 21)" fill="#718096"/>
                  <rect width="11" height="27" rx="2" transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 39 44)" fill="#718096"/>
                </svg>
              </button>
              <button type="button"
                class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                title="Align Top"
                @click="alignObject('top', activeObject.bounds.height / 2)"
                v-tippy="{ arrow: true }">
                <svg width="13" height="13" viewBox="0 0 55 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="54.5" y="0.5" width="4" height="54" rx="2" transform="rotate(90 54.5 0.5)" fill="#718096"/>
                  <rect x="33.5" y="12.5" width="11" height="39" rx="2" fill="#718096"/>
                  <rect x="10.5" y="12.5" width="11" height="27" rx="2" fill="#718096"/>
                </svg>
              </button>
              <button type="button"
                class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                title="Align Vertical Center"
                @click="alignObject('top', (currentVariant.printable_area[currentSide].height / 2))"
                v-tippy="{ arrow: true }">
                <svg width="13" height="13" viewBox="0 0 55 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.5" y="22.5" width="4" height="54" rx="2" transform="rotate(-90 0.5 22.5)" fill="#718096"/>
                  <rect x="21.5" y="39.5" width="11" height="39" rx="2" transform="rotate(180 21.5 39.5)" fill="#718096"/>
                  <rect x="44.5" y="33.5" width="11" height="27" rx="2" transform="rotate(180 44.5 33.5)" fill="#718096"/>
                </svg>
              </button>
              <button type="button"
                class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                title="Align Bottom"
                @click="alignObject('top', (currentVariant.printable_area[currentSide].height) - (activeObject.bounds.height / 2))"
                v-tippy="{ arrow: true }">
                <svg width="13" height="13" viewBox="0 0 55 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="4" height="54" rx="2" transform="matrix(1.19249e-08 -1 -1 -1.19249e-08 54.5 51.5)" fill="#718096"/>
                  <rect width="11" height="39" rx="2" transform="matrix(1 5.56363e-08 5.56363e-08 -1 33.5 39.5)" fill="#718096"/>
                  <rect width="11" height="27" rx="2" transform="matrix(1 5.56363e-08 5.56363e-08 -1 10.5 39.5)" fill="#718096"/>
                </svg>
              </button>
            </div>
          </div>

          <LeftActions v-if="selectedTab === 'designer'" @actionClicked="leftActionClicked"/>

          <div class="bottom-actions absolute z-10 flex flex-shrink justify-center" v-if="selectedTab === 'preview'">
            <div class="flex bg-white mt-4 rounded border">
              <div class="flex p-4">
                <ToggleSwitch :options="currentVariantSides"
                  class="mx-1"
                  :value="currentSide"
                  @change="(option) => $store.dispatch('designer/switchSideTo', option.value)">
                  <template v-slot:default="{ option }">
                    <div class="flex flex-col">
                      <img :src="option.label" width="50"/>
                      <div class="text-center mt-1 text-xs">
                        {{ option.value.toUpperCase() }}
                      </div>
                    </div>
                  </template>
                </ToggleSwitch>
              </div>
            </div>
          </div>

          <div class="inline-block product-section outline-none relative w-auto h-auto">
            <div class="relative w-auto h-full" v-if="selectedTab === 'preview'">
              <div class="inline-block relative w-auto h-auto" :style="{ 'background-color': currentVariant.color }">
                <img draggable="false"
                  class="relative"
                  style="z-index: 2"
                  :src="currentVariant.printable_area[currentSide].placeholder"
                />
              </div>
              <div
                class="printable-area-surface absolute"
                :style="{
                  left: `${currentVariant.printable_area[currentSide].left}px`,
                  top: `${currentVariant.printable_area[currentSide].top}px`,
                  width: `${currentVariant.printable_area[currentSide].width}px`,
                  height: `${currentVariant.printable_area[currentSide].height}px`,
                  zIndex: 2
                }"
                @mouseenter="printableAreaZ = 3"
              ></div>
              <div
                class="printable-area absolute"
                id="printable-area"
                :style="{
                  left: `${currentVariant.printable_area[currentSide].left}px`,
                  top: `${currentVariant.printable_area[currentSide].top}px`,
                  width: `${currentVariant.printable_area[currentSide].width}px`,
                  height: `${currentVariant.printable_area[currentSide].height}px`,
                  zIndex: printableAreaZ,
                  outlineColor: getCorrectColor(currentVariant.color)
                }"
                :class="{ '-has-outline': isPrintableAreaHovered || isMoving }"
                @mouseenter="isPrintableAreaHovered = true"
                @mouseleave="
                  printableAreaZ = 1
                  isPrintableAreaHovered = false
                "
              >
                <div class="h-full w-full z-10 relative">
                  <!-- TODO: Output here -->
                </div>
              </div>
              <div
                class="printable-area-label"
                v-if="isPrintableAreaHovered"
                :style="{
                  top: `${currentVariant.printable_area[currentSide].top +
                    currentVariant.printable_area[currentSide].height +
                    5}px`,
                  color: getCorrectColor(currentVariant.color)
                }"
              >
                Printable Area
              </div>
            </div>
            <div class="relative w-auto h-full" v-if="selectedTab === 'designer'">
              <DefaultCanvas ref="canvas" v-model="currentVariant.printable_area[currentSide].objects" :width="currentVariant.printable_area[currentSide].width"
              :height="currentVariant.printable_area[currentSide].height"/>
            </div>
          </div>
        </PanzoomContainer>
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
                      v-for="obj in currentVariant.printable_area[currentSide]
                        .objects"
                      :key="obj.id"
                      :class="{
                        'bg-gray-100': activeObject && obj.id == activeObject.id
                      }"
                      @click="activated(obj)"
                      @dblclick="
                        e => (obj.type == 'text' ? activateContent(obj) : false)
                      "
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
                    <label for="product_name" class="font-bold"
                      >Product Name</label
                    >
                    <div class="mt-2">
                      <input
                        name="product_name"
                        class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                        type="text"
                        :class="{
                          'border-red-400': errors.has('product_name'),
                          'focus:border-gray-600': !errors.has('name')
                        }"
                        placeholder="Product Name"
                        data-vv-as="Product Name"
                        v-validate="'required'"
                        v-model="tmpProductMetadata.name"
                      />
                    </div>
                    <span
                      class="text-red-700 text-xs pt-1 font-bold inline-block"
                      v-if="errors.has('product_name')"
                      >{{ errors.first('product_name') }}</span
                    >
                  </div>
                  <div>
                    <label for="product_description" class="font-bold"
                      >Product Description</label
                    >
                    <div>
                      <WrappedEditor v-model="tmpProductMetadata.description" />
                    </div>
                    <span
                      class="text-red-700 text-xs pt-1 font-bold inline-block"
                      v-if="errors.has('product_description')"
                      >{{ errors.first('product_description') }}</span
                    >
                  </div>
                </div>
              </div>
            </simplebar>
          </div>
          <div class="flex p-4 justify-end border-t">
            <PTButton color="primary" @click="saveProductMetadata"
              >SAVE</PTButton
            >
          </div>
        </div>
      </VueTailwindDrawer>
    </div>
  </div>
</template>

<script>
import Tabs from '@/components/Tabs'
import Select from '@/components/Select'
import ToggleSwitch from '@/components/ToggleSwitch'
import ColorRegulator from '~/plugins/color-regulator.js'
import { mapGetters } from 'vuex'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import AvailableProducts from '@/components/Designer/AvailableProducts'
import ViewToggle from '@/components/Designer/ViewToggle'
import VueNumericInput from '@/components/VueNumericInput'
import VueTailwindDrawer from '@/components/VueTailwindDrawer'
import VueTailwindAccordion from '@/components/VueTailwindAccordion'
import WrappedEditor from '@/components/WrappedEditor'
import DesignerTabs from '@/components/Designer/DesignerTabs'
import draggable from 'vuedraggable'
import Konva from '@/components/Designer/Canvas/Konva'
import DefaultCanvas from '@/components/Designer/Canvas/Default'
import PanzoomContainer from '@/components/Designer/Canvas/PanzoomContainer'
import LeftActions from '@/components/Designer/Canvas/Actions/Left'

let WebFontLoader = null
if (process.client) {
  WebFontLoader = require('webfontloader')
}

export default {
  layout: 'designer',
  components: {
    Tabs,
    Select,
    ToggleSwitch,
    vSelect,
    AvailableProducts,
    VueNumericInput,
    WrappedEditor,
    VueTailwindDrawer,
    VueTailwindAccordion,
    draggable,
    DesignerTabs,
    Konva,
    PanzoomContainer,
    LeftActions,
    DefaultCanvas
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
      selectedTab: 'preview',
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
    leftActionClicked(action){
      switch(action){
        case 'add_text':
          this.$refs.canvas.addObject('text', 'Your Text Here', 'Your Text Here')
          break;
        case 'add_art':
          this.$refs.canvas.showDrawer('artsModal')
          break;
        case 'edit_meta':
          this.toggleDrawer('productMetaDrawer')
          break;
        case 'layers':
          this.toggleDrawer('layersDrawer')
          break;
        case 'duplicate':
          this.duplicate();
          break;
        case 'move_to_front':
          this.moveObjectPosition(this.activeObject, this.currentVariant.printable_area[this.currentSide].objects.length - 1)
          break;
        case 'move_forward':
          this.moveObjectPosition(this.activeObject, this.activeObjectIndex < (this.currentVariant.printable_area[this.currentSide].objects.length - 1) ? this.activeObjectIndex + 1 : this.activeObjectIndex)
          break;
        case 'move_backward':
          this.moveObjectPosition(this.activeObject, this.activeObjectIndex > 0 ? this.activeObjectIndex - 1 : this.activeObjectIndex)
          break;
        case 'move_to_back':
          this.moveObjectPosition(this.activeObject, 0)
          break;
        case 'zoom_in':
          this.$refs.panzoomController.zoomTo(0.1)
          break;
        case 'zoom_out':
          this.$refs.panzoomController.zoomTo(0.1)
          break;
      }
    },
    _reverseObjects(objects){
      return (JSON.parse(JSON.stringify(objects))).reverse()
    },
    startEditingMetadata() {
      this.toggleDrawer('productMetaDrawer')
      this.tmpProductMetadata = JSON.parse(
        JSON.stringify(this.selectedProducts[this.currentProductIndex].meta)
      )
    },
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
    _registerCanvasEvents(){
      document.addEventListener('keydown', (evt) => {
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
    _colorIsInVariantsOf(product, color){
      return _.find(product.variants, (variant) => variant.color.toLowerCase() == color.toLowerCase())
    },
    hasTextDecoration(decoration){
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
    selectProduct(index){
      if(index == this.currentProductIndex) return
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
    selectedTab:{
      immediate: true,
      handler(to, from){
        if(!this.$refs.panzoomController) return
        if(to === 'preview'){
          this.$refs.panzoomController.zoomTo('reset')
          this.$refs.panzoomController.moveTo(0, 0)
          this.$refs.panzoomController.pause()
          return
        }
        if(to !== from && !this.$refs.panzoomController.isHoldingSpace) return
        this.$refs.panzoomController.resume()
      }
    },
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
    selectedProducts: {
      deep: true,
      handler(to) {
        clearTimeout(this.autoSaveTimeout)
        this.autoSaveTimeout = setTimeout(async () => {
          this.autoSaving = true
          this.autoSavingText = 'Saving...'
          await this.$store.dispatch('designer/saveData', {
            shouldGenerateImages: false
          })
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
