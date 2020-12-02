<template>
  <div class="h-full w-full relative overflow-hidden">
    <div
      v-for="(obj, index) in objects"
      :key="index"
      :style="{
        left: `${scaleDown(obj.bounds.left - (obj.bounds.width / 2))}px`,
        top: `${scaleDown(obj.bounds.top - (obj.bounds.height / 2))}px`,
        width: `${scaleDown(obj.bounds.width)}px`,
        height: `${scaleDown(obj.bounds.height)}px`,
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
          fontSize: `${scaleDown(obj.style.fontSize)}px`
        }"
      >
        <pre
          class="w-auto h-auto outline-none focus:outline-none"
          :style="{ fontFamily: obj.style.fontFamily }"
        >{{ obj.value || '' }}</pre>
      </div>
      <div class="flex w-full h-full items-center justify-center" v-if="obj.type == 'image' || obj.type == 'svg'">
        <img width="100%" :src="obj.value" />
      </div>
    </div>
  </div>
</template>

<script>
import { scaleDown } from '~/plugins/scaler'

export default {
  props: ['objects', 'width', 'height'],
  methods: {
    scaleDown(b) {
      return scaleDown(b)
    }
  }
}
</script>