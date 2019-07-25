<template>
  <div class="designer-layout flex flex-col h-screen">
    <div class="w-full bg-primary-blue0 flex justify-between border-b-2 border-gray-900">
			<div class="flex lg:w-1/3 items-center">
				<span class="cursor-pointer text-gray-400 outline-none hover:text-white items-center p-2 w-12 text-center">
					<font-awesome-icon :icon="['fas', 'bars']"/>
				</span>
        <navbar-item :icon="['fas', 'mouse-pointer']" title="Move"/>
        <navbar-item :icon="['far', 'square']"
          title="Shapes"
          :items="shapesNavItems"
          @trigger-click="prepareToDraw('square')"
          @item-click="(item) => prepareToDraw(item.value)"/>
        <navbar-item :icon="['fas', 'font']" title="Text"/>
        <navbar-item :icon="['far', 'folder']" title="Assets"/>
        <navbar-item :icon="['fas', 'search-plus']" title="Zoom"/>
			</div>
			<div class="flex lg:w-1/3 items-center justify-center">
				<span class="text-gray-400 hover:text-white cursor-pointer text-sm py-2 px-4">
					<span class="mr-1">Something Tee</span>
          <font-awesome-icon :icon="['fas', 'caret-down']"/>
				</span>
			</div>
			<div class="flex lg:w-1/3 items-center justify-end mr-4">
        <div class="text-gray-400 hover:text-white outline-none px-4 py-2 text-left cursor-pointer"
          :title="`${isPreviewShown ? 'Hide' : 'Show'} Preview`"
          v-tippy="{ arrow: true, placement: 'bottom' }"
          @click="togglePreviewSection">
          <font-awesome-icon :icon="['far', isPreviewShown ? 'eye-slash' : 'eye']" class="inline-block align-middle"/>
        </div>
        <div class="bg-white border rounded-full w-6 h-6 cursor-pointer"></div>
			</div>
		</div>
    <div class="flex flex-grow h-full">
      <div class="flex flex-shrink-0 w-1/5 h-full bg-primary-blue0 flex-col border-r-2 border-gray-900">
        <Tabs :tabs="tabs">
          <template v-slot:layers>
              <div class="layers h-64 flex flex-col w
              -full">
                <div class="layer p-2 flex cursor-pointer">
                  <div class="flex items-center align-middle pr-2">
                    <font-awesome-icon :icon="['fas', 'chevron-right']" class="text-xs"/>
                  </div>
                  <div class="thumbnail flex w-12 h-12 bg-white rounded">
                    <!-- <img src=""/> -->
                  </div>
                  <div class="flex flex-grow items-center text-white px-2">
                    Layer 1
                  </div>
                </div>
              </div>
          </template>

          <template v-slot:variants>
              <div class="flex flex-col w-full">
                <div class="add-new-variant-btn cursor-pointer border-2 hover:bg-primary-blue1 rounded w-full h-48 flex border-dashed items-center justify-center"
                  @click="$refs.variantsPopup.show()">
                  <div class="flex flex-col items-center">
                    <font-awesome-icon :icon="['fas', 'plus']" class="flex text-3xl"/>
                    <div class="flex mt-4 font-bold">
                      Add New Variant
                    </div>
                  </div>
                </div>
              </div>
              <vue-tailwind-modal ref="variantsPopup" width="60%">
                <div class="top-categories flex w-full rounded justify-center">
                  <div class="flex cursor-pointer mx-2 text-gray-900 bg-gray-400 rounded px-4 py-3 w-1/3">
                    <div class="text-center w-full">
                      Apparel
                    </div>
                  </div>
                  <div class="flex cursor-pointer mx-2 text-gray-600 bg-gray-100 rounded px-4 py-3 w-1/3">
                    <div class="text-center w-full">
                      Home
                    </div>
                  </div>
                  <div class="flex cursor-pointer mx-2 text-gray-600 bg-gray-100 rounded px-4 py-3 w-1/3">
                    <div class="text-center w-full">
                      Accessories
                    </div>
                  </div>
                </div>
                <div class="flex w-full mt-4">
                  <div class="flex w-1/3 mx-2 text-gray-600 p-4 bg-gray-100 rounded">

                  </div>
                  <div class="flex w-1/3 mx-2 text-gray-600 p-4 bg-gray-100 rounded">

                  </div>
                  <div class="flex w-1/3 mx-2 text-gray-600 p-4 bg-gray-100 rounded">

                  </div>
                </div>
              </vue-tailwind-modal>
          </template>
        </Tabs>
      </div>
      <div class="flex flex-grow overflow-hidden canvas-section-container bg-gray-100 outline-none">
        <div class="canvas-section w-full h-full">
          <Paper ref="paper"
            width="16in"
            height="20in"
            name="designer-canvas"
            @mouseDrag="draw"/>
        </div>
        <transition name="slideRight">
          <div class="fixed shadow-lg w-1/3 h-full right-0 bg-white preview-section"
            v-if="isPreviewShown" style="animation-duration: 0.4s">
            <div class="heading text-primary-blue0 p-4 text-sm">
              <font-awesome-icon :icon="['fas', 'eye']"/>
              <span class="font-bold inline-block ml-1">Preview</span>
            </div>
            <div class="content p-4">
              <div class="placeholder w-full relative">
                <div class="placeholder-color bg-primary-blue2">
                  <img src="~/assets/images/shirtplaceholder.png" class="object-contain">
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import Tabs from '@/components/Tabs'
import Paper from '@/components/Designer/Canvas/Paper'
import VueTailwindModal from '@/components/VueTailwindModal'
import { mapGetters } from 'vuex'

export default {
  layout: 'designer',
  components: {
    Tabs,
    VueTailwindModal,
    Paper,
    'navbar-item': () => import('@/components/Designer/Navbar/Item')
  },
  created(){
    this.$store.commit('designer/IS_PREVIEW_SHOWN', (localStorage.getItem('printree:isPreviewShown') == 'true') || false)
  },
  data(){
    return {
      isPreparingToDraw: false,
      stage: null,
      panzoomController: null,
      tabs: [
        {
          name: 'layers',
          title: 'LAYERS',
          slot: 'layers'
        },
        {
          name: 'variants',
          title: 'VARIANTS',
          slot: 'variants'
        }
      ],
      shapesNavItems: [
        {
          icon: ['far', 'square'],
          value: 'square',
          title: 'Square'
        },
        {
          icon: ['far', 'circle'],
          value: 'circle',
          title: 'Ellipse'
        },
        {
          icon: ['far', 'star'],
          value: 'star',
          title: 'Star'
        },
        {
          icon: ['fas', 'paint-brush'],
          value: 'brush',
          title: 'Brush'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      isPreviewShown: 'designer/isPreviewShown'
    })
  },
  methods: {
    togglePreviewSection(){
      this.$store.commit('designer/IS_PREVIEW_SHOWN', !this.isPreviewShown)
    },
    prepareToDraw(object){
      console.log(object)
    },
    draw(event){
      let path = new Path()
      path.strokeColor = 'black'
      let vector = event.delta

      // rotate the vector by 90 degrees:
      vector.angle += 90

      // change its length to 5 pt:
      vector.length = 5

      path.add(event.middlePoint + vector)
      path.add(event.middlePoint - vector)
      this.$refs.paper.draw(path)
    }
  }
}
</script>
