<template>
  <div>
    <AreaLoader v-if="isLoading" fullscreen />

    <div class="flex flex-wrap justify-center">
      <div
        class="flex border-rounded border w-4/12 mx-4 relative flex-col"
        v-for="(img, i) in generatedVariantImages"
        :key="i"
      >
        <div class="flex w-full justify-between p-4">
          <div class="uppercase font-bold">{{img.side}}</div>
          <div>
            <button
              type="button"
              class="px-2 py-1 text-xs bg-white hover:bg-gray-200 border rounded mx-1"
              @click="download(img)"
            >
              <span class="mr-1">Download as PNG</span>
              <font-awesome-icon :icon="['fas', 'file-download']" />
            </button>
            <button
              type="button"
              class="px-2 py-1 text-xs bg-white hover:bg-gray-200 border rounded mx-1"
              @click="download(img, 'svg')"
            >
              <span class="mr-1">Download as SVG</span>
              <font-awesome-icon :icon="['fas', 'file-download']" />
            </button>
          </div>
        </div>
        <div
          class="generated-image"
          :style="{backgroundColor: img.color}"
          v-html="img.design"
          :ref="`design-${img.side}`"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import AreaLoader from "@/components/AreaLoader";
import { saveSvgAsPng, svgAsPngUri } from "save-svg-as-png";

export default {
  layout: "admin_dashboard",
  async mounted() {
    this.generatedVariantImages = await this.$store.dispatch(
      "admin/generateVariantImages",
      {
        _id: this.$route.params.variantId,
      }
    );
    this.isLoading = false;
  },
  data() {
    return {
      isLoading: true,
      generatedVariantImages: [],
    };
  },
  methods: {
    async download(img, type = "png") {
      let content = "";

      switch (type) {
        case "png":
          content = await svgAsPngUri(
            this.$refs[`design-${img.side}`][0].children[0],
            `${img._id}-${img.side}.png`,
            {
              encoderOptions: 1.0,
            }
          );
          break;
        case "svg":
          content = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
            img.design
          )}`;
          break;
      }
      const elem = window.document.createElement("a");
      elem.href = content;
      elem.download = `${img._id}-${img.side}.${type}`;
      document.body.appendChild(elem);
      elem.click();
      document.body.removeChild(elem);
    },
  },
};
</script>

<style lang="scss">
.generated-image > svg {
  width: 100%;
  height: auto;
}
</style>