<template>
  <div class="product-thumbnail relative">
    <div class="inline-block relative w-auto h-auto" :style="{ 'background-color': firstVariant.color }">
      <img draggable="false"
        class="relative"
        style="z-index: 2"
        :src="firstVariant.printable_area[firstPrintableArea].placeholder">
    </div>
    <div class="printable-area absolute"
      :style="{ left: `${firstVariant.printable_area[firstPrintableArea].left}px`, top: `${firstVariant.printable_area[firstPrintableArea].top}px`, width: `${firstVariant.printable_area[firstPrintableArea].width}px`, height: `${firstVariant.printable_area[firstPrintableArea].height}px`, zIndex: 1 }">
      <div class="h-full w-full z-10 relative">
        <div v-for="(obj, index) in firstVariant.printable_area[firstPrintableArea].objects"
          :key="index"
          :style="{
            position: 'absolute',
            zIndex: (index + 1),
            width: `${obj.bounds.width}px`,
            height: `${obj.bounds.height}px`,
            left: `${obj.bounds.left - (obj.bounds.width / 2)}px`,
            top: `${obj.bounds.top - (obj.bounds.height / 2)}px`
          }">
          <div class="flex flex-wrap w-full h-full relative z-1"
            v-if="obj.type == 'text'"
            :style="{
              ...obj.style,
              fontSize: `${obj.style.fontSize}px`
            }"
            @click.stop>
            <pre class="w-auto h-auto outline-none focus:outline-none"
              :ref="`textContainer_${obj.id}`"
              :style="{ fontFamily: obj.style.fontFamily }">{{ obj.value || '' }}</pre>
          </div>
          <div v-if="obj.type == 'svg'"
          v-html="obj.value"
          class="svg-object"
          :ref="`svgContainer_${obj.id}`"
          :style="{ fill: obj.style.color }"></div>
          <div class="flex w-full h-full items-center justify-center"
            v-if="obj.type == 'image'">
            <img width="100%" :src="obj.value"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    product: {
      required: true
    }
  },
  computed: {
    firstVariant(){
      return this.product.variants[0]
    },
    firstPrintableArea(){
      let areas = _.keys(this.firstVariant.printable_area)
      return _.includes(areas, 'front') ? 'front' : _.head(areas)
    }
  }
}
</script>
