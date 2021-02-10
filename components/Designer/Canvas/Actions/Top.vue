<template>
  <div class="top-actions absolute z-10 flex">
    <div
      class="flex bg-white ml-2 mt-2 py-2 px-1 rounded border items-center"
      v-if="activeObject && (activeObject.type == 'text' || activeObject.type == 'svg')"
    >
      <v-popover class="flex">
        <button
          type="button"
          class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-6 h-6 font-bold rounded-full text-gray-600 border-grey-lightest hover:border-gray-400 text-xs"
          :style="{ backgroundColor: activeObject.style.color }"
          title="Color"
          v-if="activeObjectCanBeColored"
          v-tippy="{ arrow: true }"
        ></button>
        <template slot="popover">
          <div class="bg-white w-64 border rounded shadow-xl">
            <div class="colors flex flex-wrap">
              <div
                class="rounded-full p-1 bg-white border m-1 hover:border-gray-300"
                v-for="(color, index) in textColors"
                :key="index"
                @click="$emit('action-clicked', {action: 'set_color', args: color})"
                :class="{ 'border-gray-400': activeObject && activeObject.style.color == color.code, 'border-white': !activeObject || activeObject.style.color != color.code }"
              >
                <div
                  class="justify-center items-center flex rounded-full cursor-pointer w-8 h-8 border border-gray-400"
                  :style="{ 'background-color': color.code }"
                >
                  <font-awesome-icon
                    :icon="['fas', 'check']"
                    :style="{ color: getCorrectColor(color.code) }"
                    v-if="activeObject && activeObject.style.color.toLowerCase() == color.code.toLowerCase()"
                  />
                </div>
              </div>
            </div>
          </div>
        </template>
      </v-popover>
      <div class="flex" v-if="activeObject && activeObject.type == 'text'">
        <div class="w-48 px-1 h-8 z-10 items-center">
          <v-select
            :options="webfonts"
            class="flex-grow h-full text-sm"
            :value="activeObject.style.fontFamily"
            @input="$emit('action-clicked', {action: 'font_family_changed', args: $event})"
          >
            <template slot="option" slot-scope="item">
              <span :style="{ fontFamily: item.value }">{{ item.label }}</span>
            </template>
          </v-select>
        </div>
        <button
          type="button"
          class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
          :class="{ 'bg-gray-300': activeObject.style.fontWeight == 'bold' }"
          @click="$emit('action-clicked', {action: 'toggle_font_weight', args: activeObject.style.fontWeight == 'bold' ? 'normal' : 'bold'})"
          title="Bold (Ctrl + B)"
          v-tippy="{ arrow: true }"
        >
          <font-awesome-icon :icon="['fas', 'bold']" />
        </button>
        <button
          type="button"
          class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
          :class="{ 'bg-gray-300': activeObject.style.fontStyle == 'italic' }"
          @click="$emit('action-clicked', {action: 'toggle_font_style', args: activeObject.style.fontStyle == 'italic' ? 'normal' : 'italic'})"
          title="Italic (Ctrl + I)"
          v-tippy="{ arrow: true }"
        >
          <font-awesome-icon :icon="['fas', 'italic']" />
        </button>
        <button
          type="button"
          class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
          :class="{ 'bg-gray-300': hasTextDecoration('underline') }"
          @click="$emit('action-clicked', {action: 'toggle_text_decoration', args: 'underline'})"
          title="Underline (Ctrl + U)"
          v-tippy="{ arrow: true }"
        >
          <font-awesome-icon :icon="['fas', 'underline']" />
        </button>
        <button
          type="button"
          class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
          :class="{ 'bg-gray-300': hasTextDecoration('line-through') }"
          @click="$emit('action-clicked', {action: 'toggle_text_decoration', args: 'line-through'})"
          title="Strikethrough (Ctrl + K)"
          v-tippy="{ arrow: true }"
        >
          <font-awesome-icon :icon="['fas', 'strikethrough']" />
        </button>
        <VueNumericInput
          :min="0"
          @input="$emit('action-clicked', {action: 'font_size_changed', args: $event})"
          v-model="activeObject.style.fontSize"
          align="center"
          style="width: 90px"
          class="ml-1"
        />
      </div>
    </div>
    <div class="flex bg-white ml-2 mt-2 py-2 px-1 rounded border" v-if="activeObject">
      <button
        type="button"
        class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
        title="Align Left"
        @click="emitLeft(activeObject.bounds.width / 2, 0)"
        v-tippy="{ arrow: true }"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 51 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="4" height="54" rx="2" fill="#718096" />
          <rect
            x="12"
            y="21"
            width="11"
            height="39"
            rx="2"
            transform="rotate(-90 12 21)"
            fill="#718096"
          />
          <rect
            x="12"
            y="44"
            width="11"
            height="27"
            rx="2"
            transform="rotate(-90 12 44)"
            fill="#718096"
          />
        </svg>
      </button>
      <button
        type="button"
        class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
        title="Align Horizontal Center"
        @click="emitLeft((width / 2), (width / 2) - (activeObject.bounds.width / 2))"
        v-tippy="{ arrow: true }"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 39 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="17" width="4" height="54" rx="2" fill="#718096" />
          <rect y="21" width="11" height="39" rx="2" transform="rotate(-90 0 21)" fill="#718096" />
          <rect
            x="6"
            y="44"
            width="11"
            height="27"
            rx="2"
            transform="rotate(-90 6 44)"
            fill="#718096"
          />
        </svg>
      </button>
      <button
        type="button"
        class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
        title="Align Right"
        @click="emitLeft(((width) - (activeObject.bounds.width / 2)), width - activeObject.bounds.width)"
        v-tippy="{ arrow: true }"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 51 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="4" height="54" rx="2" transform="matrix(-1 0 0 1 51 0)" fill="#718096" />
          <rect
            width="11"
            height="39"
            rx="2"
            transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 39 21)"
            fill="#718096"
          />
          <rect
            width="11"
            height="27"
            rx="2"
            transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 39 44)"
            fill="#718096"
          />
        </svg>
      </button>
      <button
        type="button"
        class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
        title="Align Top"
        @click="emitTop(activeObject.bounds.height / 2, 0)"
        v-tippy="{ arrow: true }"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 55 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="54.5"
            y="0.5"
            width="4"
            height="54"
            rx="2"
            transform="rotate(90 54.5 0.5)"
            fill="#718096"
          />
          <rect x="33.5" y="12.5" width="11" height="39" rx="2" fill="#718096" />
          <rect x="10.5" y="12.5" width="11" height="27" rx="2" fill="#718096" />
        </svg>
      </button>
      <button
        type="button"
        class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
        title="Align Vertical Center"
        @click="emitTop((height / 2), (height / 2) - (activeObject.bounds.height / 2))"
        v-tippy="{ arrow: true }"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 55 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="0.5"
            y="22.5"
            width="4"
            height="54"
            rx="2"
            transform="rotate(-90 0.5 22.5)"
            fill="#718096"
          />
          <rect
            x="21.5"
            y="39.5"
            width="11"
            height="39"
            rx="2"
            transform="rotate(180 21.5 39.5)"
            fill="#718096"
          />
          <rect
            x="44.5"
            y="33.5"
            width="11"
            height="27"
            rx="2"
            transform="rotate(180 44.5 33.5)"
            fill="#718096"
          />
        </svg>
      </button>
      <button
        type="button"
        class="justify-center items-center focus:outline-none mx-1 outline-none flex flex-grow border w-8 h-8 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
        title="Align Bottom"
        @click="emitTop((height) - (activeObject.bounds.height / 2), height - activeObject.bounds.height)"
        v-tippy="{ arrow: true }"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 55 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            width="4"
            height="54"
            rx="2"
            transform="matrix(1.19249e-08 -1 -1 -1.19249e-08 54.5 51.5)"
            fill="#718096"
          />
          <rect
            width="11"
            height="39"
            rx="2"
            transform="matrix(1 5.56363e-08 5.56363e-08 -1 33.5 39.5)"
            fill="#718096"
          />
          <rect
            width="11"
            height="27"
            rx="2"
            transform="matrix(1 5.56363e-08 5.56363e-08 -1 10.5 39.5)"
            fill="#718096"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ColorRegulator from "~/plugins/color-regulator.js";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import VueNumericInput from "@/components/VueNumericInput";

export default {
  props: ["activeObject", "width", "height"],
  components: {
    vSelect,
    VueNumericInput,
  },
  computed: {
    ...mapGetters({
      textColors: "designer/textColors",
      webfonts: "designer/webfonts",
    }),
    activeObjectCanBeColored() {
      if (!this.activeObject) return false;
      return _.includes(["text", "svg"], this.activeObject.type);
    },
  },
  methods: {
    emitTop(top, y) {
      this.$emit("action-clicked", {
        action: "align_object",
        args: ["top", top],
      });
      this.$emit("action-clicked", { action: "align_object", args: ["y", y] });
    },
    emitLeft(left, x) {
      this.$emit("action-clicked", {
        action: "align_object",
        args: ["left", left],
      });
      this.$emit("action-clicked", { action: "align_object", args: ["x", x] });
    },
    hasTextDecoration(decoration) {
      return _.includes(this.activeObject.style.textDecoration, decoration);
    },
    getCorrectColor(hex) {
      return ColorRegulator.getContrastOf(hex);
    },
  },
};
</script>