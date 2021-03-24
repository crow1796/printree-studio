<template>
  <div>
    <AreaLoader v-if="isLoading" fullscreen />

    <Preview
      ref="preview"
      v-if="variant"
      :variant="variant"
      :content="content"
      :fullSize="false"
      style="transform: scale(1) translate(-50%, -50%); position: absolute; top: 50%;left: 50%;"
    />
  </div>
</template>

<script>
import find from "lodash/find";
import { Preview } from "@/components/Designer/Canvas/Default/index.js";

export default {
  components: {
    Preview,
  },
  head: {
    meta: [
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
  },
  async mounted() {
    this.variant = await this.$store.dispatch("user_dashboard/variantData", {
      _id: this.$route.params.variantId,
    });
    const side = this.$route.query.side;
    const content = find(this.variant.contents, { side });
    this.content = {
      ...content,
      objects: JSON.parse(content.objects),
    };
    
    this.isLoading = false;
  },
  data() {
    return {
      isLoading: true,
      variant: null,
      content: null,
    };
  },
};
</script>