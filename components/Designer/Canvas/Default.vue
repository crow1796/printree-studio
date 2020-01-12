<template>
  <div>
    <VueTailwindDrawer ref="artsModal" width="40%">
      <div class="flex p-4 h-full flex-col w-full">
        <div class="flex w-1/3 flex-col w-full">
          <div class="uppercase font-bold text-gray-600 pb-2 px-1">
            Upload an Image
          </div>
          <div class="flex h-full w-full my-1">
            <div class="relative h-full w-full border border-dashed">
              <vue-dropzone
                class="h-full border-0 flex items-center justify-center"
                ref="myVueDropzone"
                id="dropzone"
                :style="{ border: 0 }"
                :options="{
                  url: 'https://httpbin.org/post',
                  thumbnailWidth: 150,
                  maxFiles: 1,
                  acceptedFiles:
                    'image/svg+xml, image/png, image/jpeg, image/bmp'
                }"
                @vdropzone-success="artAdded"
              />
            </div>
          </div>
        </div>
        <div class="flex flex-col w-2/3 w-full">
          <div class="uppercase font-bold text-gray-600 pb-2 px-1">
            Choose an Art
          </div>
          <div class="overflow-auto">
            <ArtsList
              @selected="
                addObject('svg', $event.value, $event.label)
                $refs.artsModal.hide()
              "
            />
          </div>
        </div>
      </div>
    </VueTailwindDrawer>

    <div class="printable-area absolute bg-white"
      :style="{ width: `${(width)}px`, height: `${(height)}px` }">
      <div class="h-full w-full z-10 relative">
        <drr v-for="(obj, index) in objects"
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
          :selected="obj.editorData.isActive"
          :hasActiveContent="obj.editorData.hasActiveContent"
          @content-active="activateContent(obj)"
          :resizable="obj.editorData.isResizable"
          :style="{ zIndex: (index + 1) }"
          :ref="`obj_${obj.id}_drr`">
          <div class="flex flex-wrap w-full h-full relative z-1"
            v-if="obj.type == 'text'"
            :style="{
              ...obj.style,
              fontSize: `${(obj.style.fontSize)}px`
            }"
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
    </div>
  </div>
</template>

<script>
import ArtsList from '@/components/Designer/ArtsList'
import VueTailwindDrawer from '@/components/VueTailwindDrawer'
const SCALE = 3

export default {
  props: {
    width: {
      required: true
    },
    height: {
      required: true
    },
    value: {
      required: true
    }
  },
  components: {
    VueTailwindDrawer,
    ArtsList
  },
  data(){
    return {
      objects: this.value
    }
  },
  methods: {
    activated(obj){
      this.activeObject = obj
      this.activeObjectIndex = _.findIndex(this.objects, { id: obj.id })
      _.map(this.objects, (ob) => {
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
      // let gridX = (this.currentVariant.printable_area[currentSide].width / 2) - (w / 2)
      // let gridY = (this.currentVariant.printable_area[currentSide].height / 2) - (h / 2)
      // this.highlightRuler.vertical = (gridX == x) || ((x - (w / 2)) == gridX) || ((x + (w / 2)) == gridX)
      // this.highlightRuler.horizontal = (gridY == y) || ((y - (h / 2)) == gridY) || ((y + (h / 2)) == gridY)
      this.isMoving = true
    },
    transformStop({x, y, w, h, angle}, obj){
      this._updateActiveObjectProps('bounds.left', x)
      this._updateActiveObjectProps('bounds.top', y)
      this._updateActiveObjectProps('bounds.width', w)
      this._updateActiveObjectProps('bounds.height', h)
      this._updateActiveObjectProps('bounds.angle', angle)
      this.$store.dispatch('designer/copyPropsToAllVariantsFrom', this.activeObject)
      this.isMoving = false
    },
    setColorTo(color){
      this._updateActiveObjectProps('style.color', color.code)
    },
    getCorrectColor(hex){
			return ColorRegulator.getContrastOf(hex)
    },
    changeText(e){
      this._updateActiveObjectProps('name', e.target.innerText)
      this._updateActiveObjectProps('value', e.target.innerText)
      this._updateActiveObjectProps('bounds.width', this.$refs[`textContainer_${this.activeObject.id}`][0].offsetWidth)
      this._updateActiveObjectProps('bounds.height', this.$refs[`textContainer_${this.activeObject.id}`][0].offsetHeight)
      this.$store.dispatch('designer/copyPropsToAllVariantsFrom', this.activeObject)
    },
    objectScale(b){
      return b * SCALE
    },
    showDrawer(modal){
      this.$refs[modal].show()
    },
    artAdded(file, res){
      let type = 'image'
      let value = file.dataURL
      if(file.type == 'image/svg+xml'){
        type = 'svg'
        value = res.files.file
      }
      this.addObject(type, value, file.name)
      this.$refs.artsModal.hide()
    },
    async addObject(type, value = '', name = null){
      let newObject = await this.$store.dispatch('designer/addObject', {type, value})
      newObject = JSON.parse(JSON.stringify(newObject))
      newObject.name = name
      if(type == 'image'){
        let i = new Image()
        i.onload = () => {
          let ratio = 0
          if(i.width > this.width){
            ratio = this.width / i.width
            newObject.bounds.width = i.width * ratio
            newObject.bounds.height = i.height * ratio
          }
          if(newObject.bounds.height > this.height){
            ratio = this.height / i.height
            newObject.bounds.width = i.width * ratio
            newObject.bounds.height = i.height * ratio
          }
          newObject.bounds.left = (newObject.bounds.width / 2) || 20
          newObject.bounds.top = (newObject.bounds.height / 2) || 20
          this.objects.push(newObject)
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
        if(el.offsetWidth > this.width){
          ratio = this.width / el.offsetWidth
          newObject.bounds.width = el.offsetWidth * ratio
          newObject.bounds.height = el.offsetHeight * ratio
        }
        if(newObject.bounds.height > this.height){
          ratio = this.height / el.offsetHeight
          newObject.bounds.width = el.offsetWidth * ratio
          newObject.bounds.height = el.offsetHeight * ratio
        }

        newObject.bounds.left = (newObject.bounds.width / 2) || 20
        newObject.bounds.top = (newObject.bounds.height / 2) || 20

        document.body.removeChild(el)
        el = null
      }
      this.objects.push(newObject)
      this.activated(newObject)
      this.$store.dispatch('designer/copyPropsToAllVariantsFrom', newObject)
    },
    async removeObject(obj){
      let index = await this.$store.dispatch('designer/removeObject', obj)
      this.objects.splice(index, 1)
      this.activeObject = null
    }
  }
}
</script>