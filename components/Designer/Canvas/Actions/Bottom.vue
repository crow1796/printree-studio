<template>
  <div class="bottom-actions absolute z-10 flex flex-shrink justify-center">
    <div class="flex bg-white mt-4 rounded border">
      <div class="flex p-4">
        <ToggleSwitch
          :options="items"
          class="mx-1"
          :value="currentSide"
          @change="
                    (option) =>
                      $emit('change', option.value)
                  "
        >
          <template v-slot:default="{ option }">
            <div class="flex flex-col">
              <img :style="{backgroundColor: option.color}" :src="option.label" width="50" />
              <div class="text-center mt-1 text-xs">{{ option.value.toUpperCase() }}</div>
            </div>
          </template>
        </ToggleSwitch>
      </div>
    </div>
  </div>
</template>

<script>
import ToggleSwitch from "@/components/ToggleSwitch";
import { mapGetters } from "vuex";

export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    ToggleSwitch,
  },
  computed: {
    ...mapGetters({
      currentSide: "designer/currentSide",
    }),
  },
};
</script>