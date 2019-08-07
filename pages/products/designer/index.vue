<template>
  <div class="flex h-full w-full">
    <VueTailwindModal ref="artsModal" width="70%">
      <div class="flex">
        <div class="flex w-1/3 flex-col">
          <div class="text-xl font-bold text-gray-600 pb-2 px-1">
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
          <div class="text-xl font-bold text-gray-600 pb-2 px-1">
            Choose an Art
          </div>
          <ArtsList @selected="addObject('svg', $event.value); $refs.artsModal.hide()"/>
        </div>
      </div>
    </VueTailwindModal>
    <simplebar class="flex w-1/4 border-r h-full">
      <div class="p-4 w-full h-full overflow-auto">
        <Tabs :tabs="[{name: 'design', title: 'Design', slot: 'design'}, {name: 'products', title: 'Products', slot: 'products'}]">
          <template v-slot:design>
            <div class="mt-4 w-full">
              <div class="flex w-full">
                <button type="button"
                  class="w-1/2 justify-center focus:outline-none mx-1 outline-none flex flex-grow border p-3 font-bold rounded cursor-pointer text-gray-600 border-grey-lightest hover:bg-gray-100"
                  @click="addObject('text', 'TEXT')">
                  <font-awesome-icon :icon="['fas', 'font']" class="text-lg"/>
                  <span class="ml-2">
                    ADD A TEXT
                  </span>
                </button>
                <button type="button"
                  class="w-1/2 justify-center focus:outline-none mx-1 outline-none flex flex-grow border p-3 font-bold rounded cursor-pointer text-gray-600 border-grey-lightest hover:bg-gray-100"
                  @click="$refs.artsModal.show()">
                  <font-awesome-icon :icon="['fas', 'cubes']" class="text-lg"/>
                  <span class="ml-2">
                    ADD AN ART
                  </span>
                </button>
              </div>

              <div class="mt-4"
                  v-if="activeObject">
                <div class="font-bold text-lg text-gray-600 w-full">
                  Actions
                </div>
                <div class="flex mt-2">
                  <button type="button"
                    class="justify-center focus:outline-none mx-1 outline-none flex border px-4 py-3 font-bold rounded cursor-pointer text-gray-600 border-grey-lightest hover:bg-gray-100"
                    title="Duplicate"
                    v-tippy>
                    <font-awesome-icon :icon="['fas', 'clone']" class="text-xs"/>
                  </button>
                  <button type="button"
                    class="justify-center focus:outline-none mx-1 outline-none flex border px-4 py-3 font-bold rounded cursor-pointer text-gray-600 border-grey-lightest hover:bg-gray-100"
                    title="To Back"
                    v-tippy>
                    <font-awesome-icon :icon="['fas', 'angle-double-down']" class="text-xs"/>
                  </button>
                  <button type="button"
                    class="justify-center focus:outline-none mx-1 outline-none flex border px-4 py-3 font-bold rounded cursor-pointer text-gray-600 border-grey-lightest hover:bg-gray-100"
                    title="Backward"
                    v-tippy>
                    <font-awesome-icon :icon="['fas', 'angle-down']" class="text-xs"/>
                  </button>
                  <button type="button"
                    class="justify-center focus:outline-none mx-1 outline-none flex border px-4 py-3 font-bold rounded cursor-pointer text-gray-600 border-grey-lightest hover:bg-gray-100"
                    title="Forward"
                    v-tippy>
                    <font-awesome-icon :icon="['fas', 'angle-up']" class="text-xs"/>
                  </button>
                  <button type="button"
                    class="justify-center focus:outline-none mx-1 outline-none flex border px-4 py-3 font-bold rounded cursor-pointer text-gray-600 border-grey-lightest hover:bg-gray-100"
                    title="To Front"
                    v-tippy>
                    <font-awesome-icon :icon="['fas', 'angle-double-up']" class="text-xs"/>
                  </button>
                </div>
              </div>

              <div class="mx-1"
                v-if="activeObject && activeObject.type == 'text'">
                <div class="font-bold text-lg text-gray-600 mt-4">
                  Text
                </div>
                <div class="colors mt-2">
                  <textarea class="border rounded border p-3 outline-none w-full resize-none"
                    rows="4"
                    v-model="activeObject.value"
                    @input="changeText"></textarea>
                </div>
              </div>

              <div class="mx-1"
                v-if="activeObjectCanBeColored">
                <div class="font-bold text-lg text-gray-600 mt-4">
                  Choose a color
                </div>
                <div class="colors mt-2 flex flex-wrap">
                  <div class="rounded-full p-1 bg-white border m-1 hover:border-gray-300"
                    v-for="(color, index) in textColors"
                    :key="index"
                    @click="setColorTo(color)"
                    :class="{ 'border-gray-400': activeObject && activeObject.style.color == color.code, 'border-white': !activeObject || activeObject.style.color != color.code }">
                    <div class="justify-center items-center flex rounded-full cursor-pointer w-8 h-8 border border-gray-200"
                      :style="{ 'background-color': color.code }">
                      <font-awesome-icon :icon="['fas', 'check']"
                        :style="{ color: getCorrectTextColor(color.code) }"
                        v-if="activeObject && activeObject.style.color.toLowerCase() == color.code.toLowerCase()"/>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mx-1"
                v-if="activeObject && activeObject.type == 'text'">
                <div class="font-bold text-lg text-gray-600 mt-4">
                  Font options
                </div>
                <div class="colors mt-2 flex flex-wrap">
                  <Select placeholder="Choose a font"
                    class="flex-grow"
                    v-model="selectedFont"
                    :options="[{label: 'Arial', value: 'arial'}, {label: 'Arial 2', value: 'arial2'}, {label: 'Arial', value: 'arial3'}, {label: 'Arial', value: 'arial4'}]"
                    filterable/>
                </div>
                <div class="mt-4 text-gray-600">
                  <div class="font-bold mx-1">
                    Styles & Decorations
                  </div>
                  <div class="flex mt-2">
                    <button type="button"
                      class="justify-center focus:outline-none mx-1 outline-none flex border px-4 py-3 font-bold rounded cursor-pointer text-gray-600 border-grey-lightest hover:bg-gray-100"
                      :class="{ 'bg-gray-300': activeObject.style.fontWeight == 'bold' }"
                      @click="toggleFontWeight(activeObject.style.fontWeight == 'bold' ? 'normal' : 'bold')">
                      <font-awesome-icon :icon="['fas', 'bold']"/>
                    </button>
                    <button type="button"
                      class="justify-center focus:outline-none mx-1 outline-none flex border px-4 py-3 font-bold rounded cursor-pointer text-gray-600 border-grey-lightest hover:bg-gray-100"
                      :class="{ 'bg-gray-300': activeObject.style.fontStyle == 'italic' }"
                      @click="toggleFontStyle(activeObject.style.fontStyle == 'italic' ? 'normal' : 'italic')">
                      <font-awesome-icon :icon="['fas', 'italic']"/>
                    </button>
                    <button type="button"
                      class="justify-center focus:outline-none mx-1 outline-none flex border px-4 py-3 font-bold rounded cursor-pointer text-gray-600 border-grey-lightest hover:bg-gray-100"
                      :class="{ 'bg-gray-300': hasTextDecoration('underline') }"
                      @click="toggleTextDecoration('underline')">
                      <font-awesome-icon :icon="['fas', 'underline']"/>
                    </button>
                    <button type="button"
                      class="justify-center focus:outline-none mx-1 outline-none flex border px-4 py-3 font-bold rounded cursor-pointer text-gray-600 border-grey-lightest hover:bg-gray-100"
                      :class="{ 'bg-gray-300': hasTextDecoration('line-through') }"
                      @click="toggleTextDecoration('line-through')">
                      <font-awesome-icon :icon="['fas', 'strikethrough']"/>
                    </button>
                    <Select :placeholder="activeObject.style.fontSize"
                      class="flex-grow"
                      @change="changeFontSize"
                      :options="fontSizes"
                      flexible/>
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
                    <div class="font-bold text-gray-600">
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
                      <div class="rounded-full p-1 border border-white m-1 hover:border-gray-300">
                        <div class="flex justify-center items-center rounded-full cursor-pointer w-6 h-6 border border-gray-200 bg-white"
                        v-popover="{ name: `availableColors_${product.id}` }">
                          <font-awesome-icon :icon="['fas', 'plus']"
                            class="text-xs text-gray-600"/>
                        </div>
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
        <div class="shirt-canvas select-none relative">
          <div :style="{ 'background-color': currentVariant.color }">
            <img draggable="false"
              class="relative"
              style="z-index: 2"
              :src="currentVariant.placeholder">
          </div>
          <div class="printable-area-surface absolute"
            :style="{ left: `${currentVariant.printable_area.front.left}px`, top: `${currentVariant.printable_area.front.top}px`, width: `${currentVariant.printable_area.front.width}px`, height: `${currentVariant.printable_area.front.height}px`, zIndex: 2 }"
            @mouseenter="printableAreaZ = 3"></div>
          <div class="printable-area absolute"
            :style="{ left: `${currentVariant.printable_area.front.left}px`, top: `${currentVariant.printable_area.front.top}px`, width: `${currentVariant.printable_area.front.width}px`, height: `${currentVariant.printable_area.front.height}px`, zIndex: printableAreaZ }"
            @mouseleave="printableAreaZ = 1">
            <div class="h-full w-full z-10 relative">
              <drr v-for="(obj, index) in currentVariant.objects"
                :key="index"
                :aspectRatio="obj.editorData.aspectRatio"
                :w="obj.bounds.width"
                :h="obj.bounds.height"
                :x="obj.bounds.left"
                :y="obj.bounds.top"
                @select="activated(obj)"
                @deselect="deactivated"
                @dragstop="transformStop($event, obj)"
                @resizestop="transformStop($event, obj)"
                @rotatestop="transformStop($event, obj)"
                @drag="transforming($event, obj)"
                @resize="transforming($event, obj)"
                @rotate="transforming($event, obj)"
                :selected="obj.editorData.isActive"
                :style="{ zIndex: obj.style.zIndex }">
                <div class="flex flex-wrap w-full h-full relative z-1" v-if="obj.type == 'text'"
                  :style="obj.style"
                  @click.stop>
                  <div class="block break-words break-all w-auto h-auto">
                    <pre>{{ obj.value || '' }}</pre>
                  </div>
                </div>
                <div v-if="obj.type == 'svg'"
                v-html="obj.value"
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
                :class="{ '-highlighted': highlightRuler.horizontal }"></div>
              <div class="vert absolute h-full"
                :class="{ '-highlighted': highlightRuler.vertical }"></div>
            </div>
          </div>
          <div class="printable-area-label"
            :style="{ top: `${currentVariant.printable_area.front.top + currentVariant.printable_area.front.height + 5}px`}">Printable Area</div>
        </div>
      </div>
    </div>

    <popover :name="`availableColors_${currentProduct.id}`"
      :width="300">
      <div class="flex flex-col w-full">
        <div class="font-bold text-gray-600 m-2">Choose a color</div>
        <div class="flex">
          <div class="rounded-full p-1 border border-white m-1 hover:border-gray-300"
            v-for="(color, colorIndex) in currentProduct.availableColors"
            :key="colorIndex"
            :class="{ 'border-gray-300 bg-white': _colorIsInVariantsOf(currentProduct, color.color) }">
            <div class="flex justify-center items-center rounded-full cursor-pointer w-6 h-6 border border-gray-200"
              :style="{ 'background-color': color.color }">
              <font-awesome-icon :icon="['fas', 'check']"
                :style="{ color: getCorrectTextColor(color.color), fontSize: '.8em' }"
                v-if="_colorIsInVariantsOf(currentProduct, color.color)"/>
            </div>
          </div>
        </div>
      </div>
    </popover>
  </div>
</template>

<script>
import Tabs from '@/components/Tabs'
import Select from '@/components/Select'
import VueTailwindModal from '@/components/VueTailwindModal'
import ArtsList from '@/components/Designer/ArtsList'
import { mapGetters } from 'vuex'

export default {
  layout: 'designer',
  components: {
    Tabs,
    Select,
    VueTailwindModal,
    ArtsList
  },
  data(){
    return {
      selectedFont: null,
      currentProduct: null,
      currentVariant: null,
      activeObject: null,
      isMoving: false,
      highlightRuler: {
        vertical: false,
        horizontal: false
      },
      printableAreaZ: 2
    }
  },
  computed: {
    ...mapGetters({
      textColors: 'designer/textColors',
      selectedProducts: 'designer/selectedProducts',
      currentProductIndex: 'designer/currentProductIndex',
      currentVariantIndex: 'designer/currentVariantIndex',
      fontSizes: 'designer/fontSizes'
    }),
    activeObjectCanBeColored(){
      if(!this.activeObject) return false
      return _.includes(['text', 'svg'], this.activeObject.type)
    }
  },
  methods: {
    _colorIsInVariantsOf(product, color){
      return _.find(product.variants, (variant) => variant.color.toLowerCase() == color.toLowerCase())
    },
    artAdded(file){
      console.log(file)
      let type = 'image'
      let value = file.dataURL
      // if(file.type == 'image/svg+xml'){
      //   type = 'svg'
      //   value = document.createElementNS("http://www.w3.org/2000/svg", "image")
      //   // new
      //   value.setAttributeNS("http://www.w3.org/1999/xlink", 'xlink:href', file.dataURL)
      //   value = value.outerHTML
      // }
      this.addObject(type, value)
      this.$refs.artsModal.hide()
    },
    async addObject(type, value = ''){
      let newObject = await this.$store.dispatch('designer/addObject', {type, value})
      this.currentVariant.objects.push(JSON.parse(JSON.stringify(newObject)))
    },
    async removeObject(obj){
      let index = await this.$store.dispatch('designer/removeObject', obj)
      this.currentVariant.objects.splice(index, 1)
    },
    hasTextDecoration(decoration){
      return _.includes(this.activeObject.style.textDecoration, decoration)
    },
    toggleFontWeight(fontWeight){
      this._updateActiveObjectProps('style.fontWeight', fontWeight)
      this.$store.dispatch('designer/copyPropsToAllVariantsFrom', this.activeObject)
    },
    toggleFontStyle(fontStyle){
      this._updateActiveObjectProps('style.fontStyle', fontStyle)
      this.$store.dispatch('designer/copyPropsToAllVariantsFrom', this.activeObject)
    },
    toggleTextDecoration(decoration){
      let newDecoration = this.activeObject.style.textDecoration
      newDecoration = this.hasTextDecoration(decoration) ? newDecoration.replace(decoration, '') : newDecoration + ` ${decoration}`
      newDecoration = newDecoration.trim()
      this._updateActiveObjectProps('style.textDecoration', JSON.parse(JSON.stringify(newDecoration)))
      this.$store.dispatch('designer/copyPropsToAllVariantsFrom', this.activeObject)
    },
    changeFontSize(font){
      this._updateActiveObjectProps('style.fontSize', font.value)
      this.$store.dispatch('designer/copyPropsToAllVariantsFrom', this.activeObject)
    },
    changeText(e){
      this._updateActiveObjectProps('value', e.target.value)
      this.$store.dispatch('designer/copyPropsToAllVariantsFrom', this.activeObject)
    },
    activateEditable(e){
      this._updateActiveObjectProps('editorData.isEditing', true)
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
      this._updateActiveObjectProps('editorData.isEditing', false)
    },
    transforming({x, y, w, h, angle}, obj){
      // let gridX = (this.currentVariant.printable_area.front.width / 2) - (w / 2)
      // let gridY = (this.currentVariant.printable_area.front.height / 2) - (h / 2)
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
    getCorrectTextColor(hex){
			let threshold = 130

			let hRed = hexToR(hex)
			let hGreen = hexToG(hex)
			let hBlue = hexToB(hex)

			function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
			function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
			function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
			function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7) : h}

			let cBrightness = ((hRed * 299) + (hGreen * 587) + (hBlue * 114)) / 1000
      if (cBrightness > threshold){return "#000000"} else { return "#ffffff"}
    }
  },
  watch: {
    currentProductIndex: {
      immediate: true,
      handler(to){
        this.currentProduct = JSON.parse(JSON.stringify(this.selectedProducts[to]))
      }
    },
    currentVariantIndex: {
      immediate: true,
      handler(to){
        this.currentVariant = JSON.parse(JSON.stringify(this.selectedProducts[this.currentProductIndex].variants[to]))
      }
    }
  }
}
</script>
