<template>
  <div
    class="flex flex-grow justify-center printable-output p-2"
    :style="{transform: `scale(${scale})`}"
    :class="{ '-maximized': resizable && isPreviewExpanded, 'w-full h-full': fullSize }"
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
    <button
      v-if="resizable"
      type="button"
      class="justify-center items-center mx-2 my-1 w-8 h-8 focus:outline-none outline-none flex flex-grow border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs absolute bg-white right-0 top-0 preview-resizer-btn -main-img z-10"
      :class="{'text-primary border-primary': content.isMainThumb}"
      title="Set as main image"
      @click="setAsMainImage"
      v-tippy="{ arrow: true }"
    >
      <font-awesome-icon :icon="['fas', 'star']" :rotation="90" />
    </button>
    <div
      class="outline-none select-none relative text-center overflow-hidden"
      :class="{'w-full h-full': fullSize}"
    >
      <div class="inline-block outline-none relative" :class="{'w-full h-full': fullSize}">
        <div class="relative" :class="{'w-full h-full': fullSize}">
          <div
            class="inline-block relative"
            :class="{'w-full h-full': fullSize}"
            :style="{ 'background-color': variant.customizableVariant.color }"
          >
            <img draggable="false" class="relative" style="z-index: 2" :src="content.placeholder" />
          </div>
          <div class="printable-area-surface absolute"></div>

          <div
            class="z-11 absolute -has-outline"
            @mouseenter="hasOutline = true"
            @mouseleave="hasOutline = false"
            :style="{
                    left: `${content.bounds.left}px`,
                    top: `${content.bounds.top}px`,
                    width: `${content.bounds.width}px`,
                    height: `${content.bounds.height}px`,
                  }"
          ></div>
          <div
            class="printable-area absolute -has-outline z-10"
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
import find from 'lodash/find'
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
    scale: {
      default: 0.3,
    },
    fullSize: {
      default: true,
    },
  },
  components: {
    Output,
  },
  data() {
    return {
      isPreviewExpanded: false,
      hasOutline: false,
    };
  },
  methods: {
    async setAsMainImage() {
      try {
        const res = await this.$store.dispatch(
          "user_dashboard/setVariantMainThumbnail",
          {
            _id: this.variant._id,
            side: this.content.side,
          }
        );

        this.$emit('main-thumb-changed', res.contents)

        this.$toast.success("Saved!", {
          position: "top",
        });
      } catch (error) {
        console.log(error);
        this.$toast.error("Unable to set main image. Please try again.", {
          position: "top",
        });
      }
    },
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