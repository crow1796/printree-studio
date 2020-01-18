<template>
  <div class="h-full w-full z-10 relative">
    <div
      v-for="(obj, index) in objects"
      :key="index"
      :style="{
        left: `${obj.bounds.left - (obj.bounds.width / 2)}px`,
        top: `${obj.bounds.top - (obj.bounds.height / 2)}px`,
        width: `${obj.bounds.width}px`,
        height: `${obj.bounds.height}px`,
        transform: `rotate(${obj.bounds.angle}deg)`,
        zIndex: (index + 1),
        position: 'absolute'
      }"
    >
      <div
        class="flex flex-wrap w-full h-full relative z-1"
        v-if="obj.type == 'text'"
        :style="{
          ...obj.style,
          fontSize: `${(obj.style.fontSize)}px`
        }"
      >
        <pre
          class="w-auto h-auto outline-none focus:outline-none"
          :style="{ fontFamily: obj.style.fontFamily }"
        >{{ obj.value || '' }}</pre>
      </div>
      <div
        v-if="obj.type == 'svg'"
        v-html="obj.value"
        class="svg-object"
        :style="{ fill: obj.style.color }"
      ></div>
      <div class="flex w-full h-full items-center justify-center" v-if="obj.type == 'image'">
        <img width="100%" :src="obj.value" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['objects', 'width', 'height']
}
</script>