<template>
  <div
    class="flex flex-grow w-full h-full justify-center printable-output p-2"
    :style="{transform: `scale(${scale})`}"
    :class="{ '-maximized': resizable && isPreviewExpanded }"
    ref="preview-container"
  >
    <button
      v-if="resizable"
      type="button"
      class="justify-center items-center mx-2 my-1 w-8 h-8 focus:outline-none outline-none flex flex-grow border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs absolute bg-white left-0 top-0 preview-resizer-btn z-10"
      @click="togglePreviewSize"
      :title="isPreviewExpanded ? 'Minimize' : 'Expand'"
      v-tippy="{ arrow: true }"
    >
      <font-awesome-icon
        :icon="['fas', isPreviewExpanded ? 'compress-alt' : 'expand-alt']"
        :rotation="90"
      />
    </button>
    <div class="outline-none select-none relative w-full h-full text-center overflow-hidden">
      <div class="inline-block outline-none relative w-full h-full">
        <div class="relative w-full h-full">
          <div
            class="inline-block relative w-full h-full"
            :style="{ 'background-color': variant.customizableVariant.color }"
          >
            <img draggable="false" class="relative" style="z-index: 2" :src="content.placeholder" />
          </div>
          <div class="printable-area-surface absolute"></div>
          <div
            class="printable-area absolute -has-outline"
            id="printable-area"
            :style="{
                    left: `${content.bounds.left}px`,
                    top: `${content.bounds.top}px`,
                    width: `${content.bounds.width}px`,
                    height: `${content.bounds.height}px`,
                    outlineColor: hasOutline ? getCorrectColor(variant.customizableVariant.color) : 'transparent',
                  }"
          >
            <Output
              :objects="content.objects"
              :width="content.bounds.width"
              :height="content.bounds.height"
            />
          </div>
          <div
            class="printable-area-label"
            v-if="hasOutline"
            :style="{
                    top: `${
                      content.bounds.top +
                      content.bounds.height +
                      5
                    }px`,
                    color: getCorrectColor(variant.customizableVariant.color),
                  }"
          >Printable Area</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ColorRegulator from "~/plugins/color-regulator.js";
import { Output } from "@/components/Designer/Canvas/Default/index.js";

export default {
  props: {
    variant: {
      required: true,
    },
    content: {
      required: true,
    },
    resizable: {
      default: false,
    },
    hasOutline: {
      type: Boolean,
      default: false,
    },
    scale: {
      default: 0.3,
    },
  },
  components: {
    Output,
  },
  data() {
    return {
      isPreviewExpanded: false,
    };
  },
  methods: {
    togglePreviewSize() {
      this.isPreviewExpanded = !this.isPreviewExpanded;
    },
    getCorrectColor(hex) {
      if (!hex) return;
      return ColorRegulator.invertColor(hex, true);
    },
  },
};
</script>