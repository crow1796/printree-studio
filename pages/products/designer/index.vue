<template>
  <div class="flex h-full w-full">
    <VueTailwindModal ref="availableProductsModal"
      width="80%"
      content-class="rounded-none shadow-none text-gray-600">
      <div class="flex flex-col">
        <div class="modal-heading border-b w-full p-4">
          <div class="flex justify-between w-full items-center">
            <div class="flex uppercase">
              <strong>Select Products</strong>
            </div>
            <div class="flex text-right">
              <div class="select-none cursor-pointer w-8 h-8 border rounded-full flex justify-center items-center hover:border-gray-600 hover:text-gray-700"
                  @click="hideAvailableProducts">
                <font-awesome-icon :icon="['fas', 'times']"
                  class="text-xs"/>
              </div>
            </div>
          </div>
        </div>
        <div class="flex modal-body" style="height: 36rem">
          <simplebar class="h-full w-full">
            <div class="flex flex-wrap p-4">
              <div class="flex w-1/3 p-1">
                <div class="select-product flex border rounded cursor-pointer select-none hover:border-gray-500">
                  <div class="flex flex-shrink-0 w-1/3 product-thumb p-4">
                    <img src="~/assets/images/shirtplaceholder.png"
                      class="w-full"/>
                  </div>
                  <div class="flex flex-grow flex-col product-desc p-4 relative">
                    <div class="font-bold text-lg mb-4">
                      Premium Unisex Tee
                    </div>
                    <div class="flex flex-col">
                      <div class="flex py-1 items-center">
                        <font-awesome-icon :icon="['fas', 'tag']"/>
                        <div class="pl-2">
                          Sizes - XS to XL
                        </div>
                      </div>
                      <div class="flex py-1 items-center">
                        <font-awesome-icon :icon="['far', 'circle']"/>
                        <div class="pl-2">
                          4 Colors
                        </div>
                      </div>
                    </div>
                    <div class="absolute outline-none focus:outline-none bg-white select-icon rounded-full border w-10 flex h-10 items-center justify-center"
                      style="right: 10px; bottom: 10px;">
                      <font-awesome-icon :icon="['fas', 'plus']"/>
                      <!-- <font-awesome-icon :icon="['fas', 'check']"/> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </simplebar>
        </div>
      </div>
    </VueTailwindModal>
    <VueTailwindModal ref="artsModal"
      width="70%">
      <div class="flex">
        <div class="flex w-1/3 flex-col">
          <div class="uppercase font-bold text-gray-600 pb-2 px-1">
            Upload an Image
          </div>
          <div class="flex h-full w-full my-1">
            <div class="relative h-full w-full border border-dashed">
              <vue-dropzone class="h-full border-0 flex items-center justify-center"
                ref="myVueDropzone"
                id="dropzone"
                :style="{border: 0, height: '550px'}"
                :options="{
                  url: 'https://httpbin.org/post',
                  thumbnailWidth: 150,
                  maxFiles: 1,
                  acceptedFiles: 'image/svg+xml, image/png, image/jpeg, image/bmp'
                }"
                @vdropzone-success="artAdded"/>
            </div>

            <div class="relative h-full ml-3 mr-2 or-divider">
              <span class="text-gray-400">OR</span>
            </div>
          </div>
        </div>
        <div class="flex flex-col w-2/3">
          <div class="uppercase font-bold text-gray-600 pb-2 px-1">
            Choose an Art
          </div>
          <ArtsList @selected="addObject('svg', $event.value); $refs.artsModal.hide()"/>
        </div>
      </div>
    </VueTailwindModal>
    <simplebar class="flex w-1/4 border-r h-full">
      <div class="p-4 w-full h-full overflow-auto">
          <div class="w-full">
            <div class="px-4 h-24 cursor-pointer hover:bg-gray-100 select-none text-gray-600 w-full justify-center items-center flex border rounded border-dashed"
                @click="showAvailableProducts">
              <font-awesome-icon :icon="['fas', 'cubes']"
                class="mr-2 text-lg"/>
              <span class="font-bold">ADD PRODUCTS</span>
            </div>
            <div class="px-4 relative mt-4 h-24 cursor-pointer hover:bg-gray-100 select-none text-gray-600 w-full justify-center items-center flex border rounded"
              v-for="(product, index) in selectedProducts"
              :key="index"
              :class="{ 'bg-gray-100': index == currentProductIndex }"
              @click="selectProduct(index)">
              <div class="flex">
                <div class="w-1/5">
                  <img :src="index == currentProductIndex ? currentVariant.placeholder : product.variants[0].placeholder"
                    :style="{ 'background-color': index == currentProductIndex ? currentVariant.color : product.variants[0].color }">
                </div>
                <div class="flex-grow flex flex-col px-4 py-2">
                  <div class="font-bold text-gray-600" style="width: 180px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    {{ product.name }}
                  </div>
                  <div class="flex">
                    <div class="rounded-full p-1 border border-white m-1 hover:border-gray-300"
                      v-for="(variant, variantIndex) in product.variants"
                      :key="variantIndex"
                      @click.stop="selectVariant(variantIndex, index)"
                      :class="{ 'border-gray-300 bg-white': index == currentProductIndex && variantIndex == currentVariantIndex }">
                      <div class="flex justify-center items-center rounded-full cursor-pointer w-6 h-6 border border-gray-200"
                        :style="{ 'background-color': variant.color }">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="selectedProducts.length > 1"
                class="absolute hover:text-gray-700"
                style="top: 15px; right: 15px;">
                <font-awesome-icon :icon="['fas', 'trash']"/>
              </div>
              <div class="absolute hover:text-gray-700"
                style="top: 50px; right: 15px;"
                v-popover="{ name: `availableVariants_${product.id}` }">
                <font-awesome-icon :icon="['fas', 'plus']"/>
              </div>
            </div>
          </div>
      </div>
    </simplebar>
    <div class="flex flex-grow h-full flex-col">
      <div class="panzoom-container flex flex-grow w-full h-full justify-center overflow-hidden">
        <div class="canvas-section outline-none select-none relative w-full h-full text-center">
          <div class="top-actions absolute z-10 flex flex-shrink justify-center w-full">
            <div class="flex bg-white mt-4 p-4 rounded shadow-xl border">
              <button type="button"
                class="justify-center h-8 items-center focus:outline-none mx-1 outline-none flex flex-grow border px-3 py-2 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
                @click="addObject('text', 'TEXT')"
                title="Add a Text"
                v-tippy>
                <svg width="12" height="12" viewBox="0 0 37 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M36.6309 0V9.74805H31.5449L31.0908 4.69238H21.3125V39.416L26.2471 40.2637V44.0781H10.4141V40.2637L15.3486 39.416V4.69238H5.54004L5.11621 9.74805H0V0H36.6309Z" fill="#718096"/>
                </svg>
              </button>
              <button type="button"
                class="justify-center h-8 items-center focus:outline-none mx-1 outline-none flex flex-grow border px-3 py-2 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
                @click="$refs.artsModal.show()"
                title="Add an Art"
                v-tippy>
                <font-awesome-icon :icon="['fas', 'image']"/>
              </button>
            </div>
            <div class="flex bg-white ml-2 mt-4 p-4 rounded shadow-xl border items-center"
              v-if="activeObject && (activeObject.type == 'text' || activeObject.type == 'svg')">
              <button type="button"
                class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-6 h-6 font-bold rounded-full text-gray-600 border-grey-lightest hover:border-gray-400 text-xs"
                :style="{ backgroundColor: activeObject.style.color }"
                title="Color"
                v-if="activeObjectCanBeColored"
                v-tippy
                v-popover="{ name: 'availableTextColors' }">
              </button>
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
                  title="Bold"
                  v-tippy>
                  <font-awesome-icon :icon="['fas', 'bold']"/>
                </button>
                <button type="button"
                  class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                  :class="{ 'bg-gray-300': activeObject.style.fontStyle == 'italic' }"
                  @click="toggleFontStyle(activeObject.style.fontStyle == 'italic' ? 'normal' : 'italic')"
                  title="Italic"
                  v-tippy>
                  <font-awesome-icon :icon="['fas', 'italic']"/>
                </button>
                <button type="button"
                  class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                  :class="{ 'bg-gray-300': hasTextDecoration('underline') }"
                  @click="toggleTextDecoration('underline')"
                  title="Underline"
                  v-tippy>
                  <font-awesome-icon :icon="['fas', 'underline']"/>
                </button>
                <button type="button"
                  class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                  :class="{ 'bg-gray-300': hasTextDecoration('line-through') }"
                  @click="toggleTextDecoration('line-through')"
                  title="Strikethrough"
                  v-tippy>
                  <font-awesome-icon :icon="['fas', 'strikethrough']"/>
                </button>
                <Select :placeholder="activeObject.style.fontSize"
                  class="flex-grow text-xs h-8"
                  @change="changeFontSize"
                  :options="fontSizes"
                  flexible/>
              </div>
            </div>
            <div class="flex bg-white ml-2 mt-4 p-4 rounded shadow-xl border"
              v-if="activeObject">
              <button type="button"
                class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                title="Align Left"
                @click="alignObject('left', activeObject.bounds.width / 2)"
                v-tippy>
                <svg width="13" height="13" viewBox="0 0 51 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="4" height="54" rx="2" fill="#718096"/>
                  <rect x="12" y="21" width="11" height="39" rx="2" transform="rotate(-90 12 21)" fill="#718096"/>
                  <rect x="12" y="44" width="11" height="27" rx="2" transform="rotate(-90 12 44)" fill="#718096"/>
                </svg>
              </button>
              <button type="button"
                class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                title="Align Horizontal Center"
                @click="alignObject('left', (currentVariant.printable_area['front'].width / 2))"
                v-tippy>
                <svg width="13" height="13" viewBox="0 0 39 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="17" width="4" height="54" rx="2" fill="#718096"/>
                  <rect y="21" width="11" height="39" rx="2" transform="rotate(-90 0 21)" fill="#718096"/>
                  <rect x="6" y="44" width="11" height="27" rx="2" transform="rotate(-90 6 44)" fill="#718096"/>
                </svg>
              </button>
              <button type="button"
                class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                title="Align Right"
                @click="alignObject('left', (currentVariant.printable_area['front'].width) - (activeObject.bounds.width / 2))"
                v-tippy>
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
                v-tippy>
                <svg width="13" height="13" viewBox="0 0 55 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="54.5" y="0.5" width="4" height="54" rx="2" transform="rotate(90 54.5 0.5)" fill="#718096"/>
                  <rect x="33.5" y="12.5" width="11" height="39" rx="2" fill="#718096"/>
                  <rect x="10.5" y="12.5" width="11" height="27" rx="2" fill="#718096"/>
                </svg>
              </button>
              <button type="button"
                class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                title="Align Vertical Center"
                @click="alignObject('top', (currentVariant.printable_area['front'].height / 2))"
                v-tippy>
                <svg width="13" height="13" viewBox="0 0 55 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.5" y="22.5" width="4" height="54" rx="2" transform="rotate(-90 0.5 22.5)" fill="#718096"/>
                  <rect x="21.5" y="39.5" width="11" height="39" rx="2" transform="rotate(180 21.5 39.5)" fill="#718096"/>
                  <rect x="44.5" y="33.5" width="11" height="27" rx="2" transform="rotate(180 44.5 33.5)" fill="#718096"/>
                </svg>
              </button>
              <button type="button"
                class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                title="Align Bottom"
                @click="alignObject('top', (currentVariant.printable_area['front'].height) - (activeObject.bounds.height / 2))"
                v-tippy>
                <svg width="13" height="13" viewBox="0 0 55 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="4" height="54" rx="2" transform="matrix(1.19249e-08 -1 -1 -1.19249e-08 54.5 51.5)" fill="#718096"/>
                  <rect width="11" height="39" rx="2" transform="matrix(1 5.56363e-08 5.56363e-08 -1 33.5 39.5)" fill="#718096"/>
                  <rect width="11" height="27" rx="2" transform="matrix(1 5.56363e-08 5.56363e-08 -1 10.5 39.5)" fill="#718096"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="left-actions absolute z-10 flex flex-shrink justify-center">
            <div class="flex bg-white rounded shadow-xl border">
              <div class="flex flex-col py-4">
                <button type="button"
                  class="justify-center items-center mx-4 my-1 mt-0 w-8 h-8 focus:outline-none outline-none flex flex-grow border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                  title="Duplicate"
                  v-tippy
                  @click="duplicate">
                  <font-awesome-icon :icon="['fas', 'clone']" class="text-xs"/>
                </button>
                <button type="button"
                  class="justify-center items-center mx-4 my-1 mb-0 w-8 h-8 focus:outline-none outline-none flex flex-grow border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                  title="To Front"
                  v-tippy
                  @click="moveObjectPosition(currentVariant.objects.length - 1)">
                  <svg width="13" height="13" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="1" width="52" height="52" rx="2" fill="white" stroke="#718096" stroke-width="2"/>
                    <rect x="11" y="11" width="32" height="32" rx="2" fill="#718096" stroke="#718096" stroke-width="2"/>
                  </svg>
                </button>
                <button type="button"
                  class="justify-center items-center mx-4 my-1 w-8 h-8 focus:outline-none outline-none flex flex-grow border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                  title="Forward"
                  v-tippy
                  @click="moveObjectPosition(activeObjectIndex < (currentVariant.objects.length - 1) ? activeObjectIndex + 1 : activeObjectIndex)">
                  <svg width="13" height="13" viewBox="0 0 57 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="20" y="18" width="36" height="36" rx="2" fill="white" stroke="#718096" stroke-width="2"/>
                    <rect x="1" y="1" width="36" height="36" rx="2" fill="#718096" stroke="#718096" stroke-width="2"/>
                  </svg>
                </button>
                <button type="button"
                  class="justify-center items-center mx-4 my-1 w-8 h-8 focus:outline-none outline-none flex flex-grow border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                  title="Backward"
                  v-tippy
                  @click="moveObjectPosition(activeObjectIndex > 0 ? activeObjectIndex - 1 : activeObjectIndex)">
                  <svg width="13" height="13" viewBox="0 0 57 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="1" width="36" height="36" rx="2" fill="white" stroke="#718096" stroke-width="2"/>
                    <rect x="19" y="17" width="38" height="38" rx="3" fill="#718096"/>
                  </svg>
                </button>
                <button type="button"
                  class="justify-center items-center mx-4 my-1 w-8 h-8 focus:outline-none outline-none flex flex-grow border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
                  title="To Back"
                  v-tippy
                  @click="moveObjectPosition(0)">
                  <svg width="13" height="13" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="1" width="52" height="52" rx="2" fill="white" stroke="#718096" stroke-width="2"/>
                    <rect x="11" y="11" width="32" height="32" rx="2" fill="white" stroke="#718096" stroke-width="2"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="bottom-actions absolute z-10 flex flex-shrink justify-center">
            <div class="flex bg-white mt-4 rounded shadow-xl border">
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
                  @click="zoomTo(-0.1)"
                  v-tippy>
                  <font-awesome-icon :icon="['fas', 'minus']" class="text-xs"/>
                </button>
                <span class="flex items-center font-bold text-gray-600 mx-2">
                  {{ parseInt(canvasScale * 100) }}%
                </span>
                <button type="button"
                  class="w-10 flex justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border px-3 py-2 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
                  title="Zoom In"
                  @click="zoomTo(0.1)"
                  v-tippy>
                  <font-awesome-icon :icon="['fas', 'plus']" class="text-xs"/>
                </button>
              </div>
            </div>
          </div>
          <div class="bottom-tips absolute z-10 flex flex-shrink">
            <div class="bg-gray-900 text-xs text-white mt-4 rounded shadow-xl border p-4 text-left">
              <div class="font-bold mb-2">Tips:</div>
              <ul class="tips-list">
                <li>
                  Hold space + drag to start panning
                </li>
                <li>
                  Ctrl + "+" to zoom in
                </li>
                <li>
                  Ctrl + "-" to zoom out
                </li>
                <li>
                  Ctrl + "0" to reset zoom
                </li>
              </ul>
            </div>
          </div>
          <div class="inline-block product-section relative w-auto h-auto">
            <div class="inline-block relative w-auto h-auto" :style="{ 'background-color': currentVariant.color }">
              <img draggable="false"
                class="relative"
                style="z-index: 2"
                :src="currentVariant.placeholder">
            </div>
            <div class="printable-area-surface absolute"
              :style="{ left: `${currentVariant.printable_area['front'].left}px`, top: `${currentVariant.printable_area['front'].top}px`, width: `${currentVariant.printable_area['front'].width}px`, height: `${currentVariant.printable_area['front'].height}px`, zIndex: 2 }"
              @mouseenter="printableAreaZ = 3"></div>
            <div class="printable-area absolute"
              :style="{ left: `${currentVariant.printable_area['front'].left}px`, top: `${currentVariant.printable_area['front'].top}px`, width: `${currentVariant.printable_area['front'].width}px`, height: `${currentVariant.printable_area['front'].height}px`, zIndex: printableAreaZ, outlineColor: getCorrectColor(currentVariant.color) }"
              :class="{ '-has-outline': isPrintableAreaHovered || isMoving }"
              @mouseenter="isPrintableAreaHovered = true"
              @mouseleave="printableAreaZ = 1; isPrintableAreaHovered = false">
              <div class="h-full w-full z-10 relative">
                <drr v-for="(obj, index) in currentVariant.objects"
                  :key="index"
                  :aspectRatio="obj.editorData.aspectRatio"
                  :w="obj.bounds.width || 50"
                  :h="obj.bounds.height || 50"
                  :x="obj.bounds.left || 0"
                  :y="obj.bounds.top || 0"
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
                  :ref="`obj_${obj.id}_drr`">
                  <div class="flex flex-wrap w-full h-full relative z-1"
                    v-if="obj.type == 'text'"
                    :style="obj.style"
                    @click.stop>
                    <pre class="w-auto h-auto outline-none focus:outline-none"
                      :ref="`textContainer_${obj.id}`"
                      :style="{ fontFamily: obj.style.fontFamily }"
                      @input="changeText"
                      @blur="deactivateContentOf(obj, $event)">{{ obj.value || '' }}</pre>
                  </div>
                  <div v-if="obj.type == 'svg'"
                  v-html="obj.value"
                  class="svg-object"
                  :ref="`svgContainer_${obj.id}`"
                  :style="{ fill: obj.style.color }"></div>
                  <div class="flex w-full h-full items-center justify-center" v-if="obj.type == 'image'">
                    <img width="100%" :src="obj.value"/>
                  </div>
                  <div v-if="obj.editorData.isActive" class="absolute flex rounded-full bg-white w-5 h-5 items-center justify-center"
                    :style="{ fontSize: '.7em', top: '-10px', right: '-10px', zIndex: 1 }"
                    @click="removeObject(obj)">
                    <font-awesome-icon :icon="['fas', 'times']"
                      class="text-red-600"/>
                  </div>
                </drr>
              </div>
              <div class="absolute top-0 z-1 ruler w-full h-full"
                v-show="isMoving">
                <div class="horiz absolute w-full"
                  :style="{ backgroundColor: getCorrectColor(currentVariant.color) }"
                  :class="{ '-highlighted': highlightRuler.horizontal }"></div>
                <div class="vert absolute h-full"
                  :style="{ backgroundColor: getCorrectColor(currentVariant.color) }"
                  :class="{ '-highlighted': highlightRuler.vertical }"></div>
              </div>
            </div>
            <div class="printable-area-label"
              v-if="isPrintableAreaHovered"
              :style="{ top: `${currentVariant.printable_area['front'].top + currentVariant.printable_area['front'].height + 5}px`, color: getCorrectColor(currentVariant.color) }">
              Printable Area
            </div>
          </div>
        </div>
      </div>
    </div>

    <popover :name="`availableVariants_${currentProduct.id}`"
      :width="300">
      <div class="flex flex-col w-full">
        <div class="font-bold text-gray-600 m-2">Choose a color</div>
        <div class="flex">
          <div class="rounded-full p-1 border border-white m-1 hover:border-gray-300"
            v-for="(variant, variantIndex) in currentProduct.availableVariants"
            :key="variantIndex"
            :class="{ 'border-gray-300 bg-white': _colorIsInVariantsOf(currentProduct, variant.color) }"
            @click="addVariant(variant)">
            <div class="flex justify-center items-center rounded-full cursor-pointer w-6 h-6 border border-gray-200"
              :style="{ 'background-color': variant.color }">
              <font-awesome-icon :icon="['fas', 'check']"
                :style="{ color: getCorrectColor(variant.color), fontSize: '.8em' }"
                v-if="_colorIsInVariantsOf(currentProduct, variant.color)"/>
            </div>
          </div>
        </div>
      </div>
    </popover>

    <popover name="availableTextColors"
      :width="310">
      <div class="colors mt-2 flex flex-wrap">
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
    </popover>
  </div>
</template>

<script>
import panzoom from 'panzoom'
import Tabs from '@/components/Tabs'
import Select from '@/components/Select'
import VueTailwindModal from '@/components/VueTailwindModal'
import ArtsList from '@/components/Designer/ArtsList'
import ColorRegulator from '~/plugins/color-regulator.js'
import { mapGetters } from 'vuex'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
let WebFontLoader = null
if(process.client){
  WebFontLoader = require('webfontloader')
}

export default {
  layout: 'designer',
  components: {
    Tabs,
    Select,
    VueTailwindModal,
    ArtsList,
    vSelect
  },
  created(){
    WebFontLoader.load({
      google: {
        families: _.map(this.webfonts, 'value')
      }
    })
  },
  data(){
    return {
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
      activeObjectIndex: 0
    }
  },
  computed: {
    ...mapGetters({
      textColors: 'designer/textColors',
      selectedProducts: 'designer/selectedProducts',
      currentProductIndex: 'designer/currentProductIndex',
      currentVariantIndex: 'designer/currentVariantIndex',
      fontSizes: 'designer/fontSizes',
      webfonts: 'designer/webfonts'
    }),
    activeObjectCanBeColored(){
      if(!this.activeObject) return false
      return _.includes(['text', 'svg'], this.activeObject.type)
    }
  },
  mounted(){
    document.firstElementChild.style.zoom = "reset"
    this.stageContainer = document.querySelector('.panzoom-container')
    this.canvasSection = document.querySelector('.canvas-section')
    this.canvasSection.tabIndex = 1
    this.canvasSection.focus()

    this.panzoomController = panzoom(document.querySelector('.product-section'))
    this.panzoomController.pause()

    this.canvasSection.addEventListener('keypress', (evt) => {
      if (evt.which == 32) {
        this.isHoldingSpace = true
        this.stageCursor = 'grab'
        return
      }
      this.isHoldingSpace = false
    })

    this.canvasSection.addEventListener('mousemove', (e) => {
      if(this.isHoldingSpace){
        this.isPanning = true
        this.panzoomController.resume()
        return
      }
    })

    this.canvasSection.addEventListener('keydown', (evt) => {
      // Left
      if(evt.which == 37 && this.activeObject){
        this._updateActiveObjectProps('bounds.left', (this.activeObject.bounds.left - 1))
        this.isMoving = true
        return
      }
      // Up
      if(evt.which == 38 && this.activeObject){
        this._updateActiveObjectProps('bounds.top', (this.activeObject.bounds.top - 1))
        this.isMoving = true
        return
      }
      // Right
      if(evt.which == 39 && this.activeObject){
        this._updateActiveObjectProps('bounds.left', (this.activeObject.bounds.left + 1))
        this.isMoving = true
        return
      }
      // Down
      if(evt.which == 40 && this.activeObject){
        this._updateActiveObjectProps('bounds.top', (this.activeObject.bounds.top + 1))
        this.isMoving = true
        return
      }

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
    })

    this.canvasSection.addEventListener('keyup', (evt) => {
      if(_.includes([37, 38, 39, 40], evt.which) && this.activeObject){
        clearTimeout(this.arrowKeysTimeout)
        this.arrowKeysTimeout = setTimeout(() => {
          this.isMoving = false
        }, 1000)
        return
      }

      if (evt.which == 32) {
        this.isHoldingSpace = false
        this.stageCursor = 'initial'
        this.isPanning = false
        this.panzoomController.pause()
        return
      }
    })
  },
  methods: {
    alignObject(pos, val){
      if(!this.activeObject) return
      this._updateActiveObjectProps(`bounds.${pos}`, val)
      this.$store.dispatch('designer/copyPropsToAllVariantsFrom', this.activeObject)
    },
    async moveObjectPosition(newIndex){
      if(!this.activeObject || (this.activeObjectIndex == newIndex)) return
      const newObjects = await this.$store.dispatch('designer/moveObjectPosition', {
        obj: this.activeObject,
        newIndex
      })
      this.currentVariant.objects = JSON.parse(JSON.stringify(newObjects))
    },
    async duplicate(){
      if(!this.activeObject) return
      let newObject = await this.$store.dispatch('designer/duplicate', JSON.parse(JSON.stringify(this.activeObject)))
      this.currentVariant.objects.push(newObject)
      this.activated(newObject)
      this.$store.dispatch('designer/copyPropsToAllVariantsFrom', newObject)
    },
    activateContent(obj){
      this.activated(obj)
      if(obj.type == 'text'){
        this.$refs[`textContainer_${obj.id}`][0].contentEditable = true
        this.$refs[`textContainer_${obj.id}`][0].innerText = ''
        this.$refs[`textContainer_${obj.id}`][0].innerText = obj.value
        this.$refs[`textContainer_${obj.id}`][0].focus()
      }
    },
    deactivateContentOf(obj, e){
      if(obj.type == 'text'){
        this.$refs[`textContainer_${obj.id}`][0].contentEditable = false
        this.$refs[`obj_${obj.id}_drr`][0].$emit('content-inactive')
      }
    },
    showAvailableProducts(){
      this.$refs.availableProductsModal.show()
    },
    hideAvailableProducts(){
      this.$refs.availableProductsModal.hide()
    },
    async addVariant(variant){
      if(_.find(this.currentProduct.variants, { color: variant.color }) && this.currentProduct.variants.length == 1) return
      if(_.find(this.currentProduct.variants, { color: variant.color })){
        let variantIndex = await this.$store.dispatch('designer/removeVariant', variant)
        this.currentProduct.variants.splice(variantIndex, 1)
        this.selectVariant(variantIndex ? variantIndex - 1 : variantIndex, this.currentProductIndex)
        return
      }
      let newVariant = await this.$store.dispatch('designer/addVariant', variant)
      this.currentProduct.variants.push(newVariant)
      this.selectVariant((this.currentProduct.variants.length - 1), this.currentProductIndex)
    },
    zoomTo(scale){
      if(scale == 'reset') return this.canvasScale = 1.0
      this.canvasScale += scale
    },
    _colorIsInVariantsOf(product, color){
      return _.find(product.variants, (variant) => variant.color.toLowerCase() == color.toLowerCase())
    },
    artAdded(file, res){
      let type = 'image'
      let value = file.dataURL
      if(file.type == 'image/svg+xml'){
        type = 'svg'
        value = res.files.file
      }
      this.addObject(type, value)
      this.$refs.artsModal.hide()
    },
    async addObject(type, value = ''){
      let newObject = await this.$store.dispatch('designer/addObject', {type, value})
      newObject = JSON.parse(JSON.stringify(newObject))
      if(type == 'image'){
        let i = new Image()
        i.onload = () => {
          let ratio = 0
          if(i.width > this.currentVariant.printable_area['front'].width){
            ratio = this.currentVariant.printable_area['front'].width / i.width
            newObject.bounds.width = i.width * ratio
            newObject.bounds.height = i.height * ratio
          }
          if(newObject.bounds.height > this.currentVariant.printable_area['front'].height){
            ratio = this.currentVariant.printable_area['front'].height / i.height
            newObject.bounds.width = i.width * ratio
            newObject.bounds.height = i.height * ratio
          }

          newObject.bounds.left = (newObject.bounds.width / 2) || 20
          newObject.bounds.top = (newObject.bounds.height / 2) || 20
          this.currentVariant.objects.push(newObject)
          this.activated(newObject)
          this.$store.dispatch('designer/copyPropsToAllVariantsFrom', newObject)
        }
        i.src = value
        return
      }
      if(type == 'text' || type == 'svg'){
        let el = document.createElement('div')
        el.innerHTML = value
        el.style.position = 'absolute'
        el.style.visibility = 'hidden'
        el.style.display = 'block'

        document.body.appendChild(el)
        newObject.bounds.width = el.offsetWidth
        newObject.bounds.height = el.offsetHeight
        let ratio = 0
        if(el.offsetWidth > this.currentVariant.printable_area['front'].width){
          ratio = this.currentVariant.printable_area['front'].width / el.offsetWidth
          newObject.bounds.width = el.offsetWidth * ratio
          newObject.bounds.height = el.offsetHeight * ratio
        }
        if(newObject.bounds.height > this.currentVariant.printable_area['front'].height){
          ratio = this.currentVariant.printable_area['front'].height / el.offsetHeight
          newObject.bounds.width = el.offsetWidth * ratio
          newObject.bounds.height = el.offsetHeight * ratio
        }

        newObject.bounds.left = (newObject.bounds.width / 2) || 20
        newObject.bounds.top = (newObject.bounds.height / 2) || 20

        document.body.removeChild(el)
        el = null
      }
      this.currentVariant.objects.push(newObject)
      this.activated(newObject)
      this.$store.dispatch('designer/copyPropsToAllVariantsFrom', newObject)
    },
    async removeObject(obj){
      let index = await this.$store.dispatch('designer/removeObject', obj)
      this.currentVariant.objects.splice(index, 1)
      this.activeObject = null
    },
    hasTextDecoration(decoration){
      return _.includes(this.activeObject.style.textDecoration, decoration)
    },
    toggleFontWeight(fontWeight){
      this._updateActiveObjectProps('style.fontWeight', fontWeight)
      this.$nextTick(() => {
        this._updateActiveObjectProps('bounds.width', this.$refs[`textContainer_${this.activeObject.id}`][0].offsetWidth)
        this._updateActiveObjectProps('bounds.height', this.$refs[`textContainer_${this.activeObject.id}`][0].offsetHeight)
        this.$store.dispatch('designer/copyPropsToAllVariantsFrom', this.activeObject)
      })
    },
    toggleFontStyle(fontStyle){
      this._updateActiveObjectProps('style.fontStyle', fontStyle)
      this.$nextTick(() => {
        this._updateActiveObjectProps('bounds.width', this.$refs[`textContainer_${this.activeObject.id}`][0].offsetWidth)
        this._updateActiveObjectProps('bounds.height', this.$refs[`textContainer_${this.activeObject.id}`][0].offsetHeight)
        this.$store.dispatch('designer/copyPropsToAllVariantsFrom', this.activeObject)
      })
    },
    toggleTextDecoration(decoration){
      let newDecoration = this.activeObject.style.textDecoration
      newDecoration = this.hasTextDecoration(decoration) ? newDecoration.replace(decoration, '') : newDecoration + ` ${decoration}`
      newDecoration = newDecoration.trim()
      this._updateActiveObjectProps('style.textDecoration', JSON.parse(JSON.stringify(newDecoration)))
      this.$nextTick(() => {
        this._updateActiveObjectProps('bounds.width', this.$refs[`textContainer_${this.activeObject.id}`][0].offsetWidth)
        this._updateActiveObjectProps('bounds.height', this.$refs[`textContainer_${this.activeObject.id}`][0].offsetHeight)
        this.$store.dispatch('designer/copyPropsToAllVariantsFrom', this.activeObject)
      })
    },
    changeFontFamily(font){
      this._updateActiveObjectProps('style.fontFamily', font.value)
      this.$nextTick(() => {
        this._updateActiveObjectProps('bounds.width', this.$refs[`textContainer_${this.activeObject.id}`][0].offsetWidth)
        this._updateActiveObjectProps('bounds.height', this.$refs[`textContainer_${this.activeObject.id}`][0].offsetHeight)
        this.$store.dispatch('designer/copyPropsToAllVariantsFrom', this.activeObject)
      })
    },
    changeFontSize(fontSize){
      this._updateActiveObjectProps('style.fontSize', fontSize.value)
      this.$nextTick(() => {
        this._updateActiveObjectProps('bounds.width', this.$refs[`textContainer_${this.activeObject.id}`][0].offsetWidth)
        this._updateActiveObjectProps('bounds.height', this.$refs[`textContainer_${this.activeObject.id}`][0].offsetHeight)
        this.$store.dispatch('designer/copyPropsToAllVariantsFrom', this.activeObject)
      })
    },
    changeText(e){
      this._updateActiveObjectProps('value', e.target.innerText)
      this._updateActiveObjectProps('bounds.width', this.$refs[`textContainer_${this.activeObject.id}`][0].offsetWidth)
      this._updateActiveObjectProps('bounds.height', this.$refs[`textContainer_${this.activeObject.id}`][0].offsetHeight)
      this.$store.dispatch('designer/copyPropsToAllVariantsFrom', this.activeObject)
    },
    selectProduct(index){
      if(index == this.currentProductIndex) return
      this.$store.commit('designer/CURRENT_PRODUCT_INDEX', index)
      this.$store.commit('designer/CURRENT_VARIANT_INDEX', 0)
    },
    selectVariant(index, productIndex){
      if(productIndex != this.currentProductIndex) {
        this.selectProduct(productIndex)
        index = 0
      }
      this.$store.commit('designer/CURRENT_VARIANT_INDEX', index)
    },
    activated(obj){
      this.activeObject = obj
      this.activeObjectIndex = _.findIndex(this.currentVariant.objects, { id: obj.id })
      _.map(this.currentVariant.objects, (ob) => {
        this._updateActiveObjectProps('editorData.isActive', false, ob)
      })
      this._updateActiveObjectProps('editorData.isActive', true)
    },
    _updateActiveObjectProps(path, value, ob = null){
      if(!ob) ob = this.activeObject
      ob = _.set(ob, path, value)
      this.$store.commit('designer/OBJECT_PROPERTIES', {
        id: ob.id,
        path: path,
        value: value
      })
    },
    deactivated(){
      if(!this.activeObject) return
      this._updateActiveObjectProps('editorData.isActive', false)
    },
    transforming({x, y, w, h, angle}, obj){
      // let gridX = (this.currentVariant.printable_area['front'].width / 2) - (w / 2)
      // let gridY = (this.currentVariant.printable_area['front'].height / 2) - (h / 2)
      // this.highlightRuler.vertical = (gridX == x) || ((x - (w / 2)) == gridX) || ((x + (w / 2)) == gridX)
      // this.highlightRuler.horizontal = (gridY == y) || ((y - (h / 2)) == gridY) || ((y + (h / 2)) == gridY)
      this._updateActiveObjectProps('bounds.left', x)
      this._updateActiveObjectProps('bounds.top', y)
      this._updateActiveObjectProps('bounds.width', w)
      this._updateActiveObjectProps('bounds.height', h)
      this._updateActiveObjectProps('bounds.angle', angle)
      this.$store.dispatch('designer/copyPropsToAllVariantsFrom', this.activeObject)
      this.isMoving = true
    },
    transformStop(e, obj){
      this.isMoving = false
    },
    setColorTo(color){
      this._updateActiveObjectProps('style.color', color.code)
    },
    getCorrectColor(hex){
			return ColorRegulator.getContrastOf(hex)
    }
  },
  watch: {
    currentProductIndex: {
      immediate: true,
      handler(to){
        this.currentProduct = JSON.parse(JSON.stringify(this.selectedProducts[to]))
        this.deactivated()
        this.activeObject = null
        this.activeObjectIndex = null
      }
    },
    currentVariantIndex: {
      immediate: true,
      handler(to){
        this.currentVariant = JSON.parse(JSON.stringify(this.selectedProducts[this.currentProductIndex].variants[to]))
        this.deactivated()
        this.activeObject = null
        this.activeObjectIndex = 0
      }
    },
    stageCursor(newCursor){
      if(!this.stageContainer) return
      this.canvasSection .style.cursor = newCursor
    },
    canvasScale(newScale){
      if(!this.stageContainer) return
      let transform = this.panzoomController.getTransform()
      let deltaX = transform.x
      let deltaY = transform.y
      let oldScale = transform.scale
      let offsetX = 0.1 + deltaX
      let offsetY = 0.1 + deltaY
      this.panzoomController.zoomAbs(offsetX, offsetY, newScale)
    }
  }
}
</script>
