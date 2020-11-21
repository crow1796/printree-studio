<template>
  <div
    class="left-actions absolute z-10 flex flex-shrink justify-center flex-col"
  >
    <div class="flex bg-white mb-4 rounded border">
      <div class="flex flex-col py-1">
        <button
          type="button"
          class="justify-center items-center mx-2 my-1 w-8 h-8 focus:outline-none outline-none flex flex-grow border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
          @click="$emit('action-clicked', { action: 'add_text' })"
          title="Add a Text"
          v-tippy="{ arrow: true }"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 37 45"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M36.6309 0V9.74805H31.5449L31.0908 4.69238H21.3125V39.416L26.2471 40.2637V44.0781H10.4141V40.2637L15.3486 39.416V4.69238H5.54004L5.11621 9.74805H0V0H36.6309Z"
              fill="#718096"
            />
          </svg>
        </button>
        <button
          type="button"
          class="justify-center items-center mx-2 my-1 w-8 h-8 focus:outline-none outline-none flex flex-grow border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
          @click="$emit('action-clicked', { action: 'add_art' })"
          title="Add an Asset"
          v-tippy="{ arrow: true }"
        >
          <font-awesome-icon :icon="['fas', 'image']" />
        </button>
      </div>
    </div>

    <div class="flex bg-white rounded border">
      <div class="flex flex-col py-1">
        <button
          type="button"
          class="justify-center items-center mx-2 my-1 w-8 h-8 focus:outline-none outline-none flex flex-grow border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
          title="Duplicate"
          v-tippy="{ arrow: true }"
          @click="$emit('action-clicked', { action: 'duplicate' })"
        >
          <font-awesome-icon :icon="['fas', 'clone']" class="text-xs" />
        </button>
        <button
          type="button"
          class="justify-center items-center mx-2 my-1 w-8 h-8 focus:outline-none outline-none flex flex-grow border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
          title="To Front"
          v-tippy="{ arrow: true }"
          @click="
            $emit('action-clicked', { action: 'move_position', args: 'front' })
          "
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 54 54"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="1"
              y="1"
              width="52"
              height="52"
              rx="2"
              fill="white"
              stroke="#718096"
              stroke-width="2"
            />
            <rect
              x="11"
              y="11"
              width="32"
              height="32"
              rx="2"
              fill="#718096"
              stroke="#718096"
              stroke-width="2"
            />
          </svg>
        </button>
        <button
          type="button"
          class="justify-center items-center mx-2 my-1 w-8 h-8 focus:outline-none outline-none flex flex-grow border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
          title="Forward"
          v-tippy="{ arrow: true }"
          @click="
            $emit('action-clicked', {
              action: 'move_position',
              args: 'forward',
            })
          "
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 57 55"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="20"
              y="18"
              width="36"
              height="36"
              rx="2"
              fill="white"
              stroke="#718096"
              stroke-width="2"
            />
            <rect
              x="1"
              y="1"
              width="36"
              height="36"
              rx="2"
              fill="#718096"
              stroke="#718096"
              stroke-width="2"
            />
          </svg>
        </button>
        <button
          type="button"
          class="justify-center items-center mx-2 my-1 w-8 h-8 focus:outline-none outline-none flex flex-grow border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
          title="Backward"
          v-tippy="{ arrow: true }"
          @click="
            $emit('action-clicked', {
              action: 'move_position',
              args: 'backward',
            })
          "
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 57 55"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="19" y="17" width="38" height="38" rx="3" fill="#718096" />
            <rect
              x="1"
              y="1"
              width="36"
              height="36"
              rx="2"
              fill="white"
              stroke="#718096"
              stroke-width="2"
            />
          </svg>
        </button>
        <button
          type="button"
          class="justify-center items-center mx-2 my-1 w-8 h-8 focus:outline-none outline-none flex flex-grow border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
          title="To Back"
          v-tippy="{ arrow: true }"
          @click="
            $emit('action-clicked', { action: 'move_position', args: 'back' })
          "
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 54 54"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="1"
              y="1"
              width="52"
              height="52"
              rx="2"
              fill="white"
              stroke="#718096"
              stroke-width="2"
            />
            <rect
              x="11"
              y="11"
              width="32"
              height="32"
              rx="2"
              fill="white"
              stroke="#718096"
              stroke-width="2"
            />
          </svg>
        </button>
      </div>
    </div>
    <!-- 
    <div class="flex bg-white mt-4 rounded border justify-center">
      <div class="flex flex-col py-1">
        <button
          type="button"
          class="justify-center items-center mx-2 my-1 w-8 h-8 focus:outline-none outline-none flex flex-grow border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
          title="Zoom In"
          @click="$emit('action-clicked', {action: 'zoom_in'})"
          v-tippy="{ arrow: true }"
        >
          <font-awesome-icon :icon="['fas', 'search-plus']" class="text-xs" />
        </button>
        <button
          type="button"
          class="justify-center items-center mx-2 my-1 w-8 h-8 focus:outline-none outline-none flex flex-grow border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
          title="Zoom Out"
          @click="$emit('action-clicked', {action: 'zoom_out'})"
          v-tippy="{ arrow: true }"
        >
          <font-awesome-icon :icon="['fas', 'search-minus']" class="text-xs" />
        </button>
      </div>
    </div> -->

    <div class="flex bg-white mt-4 rounded border justify-center">
      <div class="flex flex-col py-1">
        <v-popover class="flex">
          <button
            type="button"
            class="justify-center items-center mx-2 my-1 w-8 h-8 focus:outline-none outline-none flex flex-grow border font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100 text-xs"
            title="Tips"
            v-tippy="{ arrow: true }"
          >
            <font-awesome-icon
              :icon="['fas', 'question-circle']"
              class="text-xs"
            />
          </button>
          <template slot="popover">
            <div
              class="bg-gray-900 text-xs text-white rounded border p-4 text-left"
            >
              <div class="font-bold mb-2">Tips:</div>
              <ul class="tips-list list-disc ml-4">
                <li>Hold space + drag to start panning</li>
                <li>Ctrl + "+" to zoom in</li>
                <li>Ctrl + "-" to zoom out</li>
                <li>Ctrl + "0" to reset zoom</li>
              </ul>
            </div>
          </template>
        </v-popover>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>