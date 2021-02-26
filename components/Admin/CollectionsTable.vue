<template>
  <div>
    <CollectionPreviewDrawer
      ref="collectionPreviewDrawer"
      :products="generatedImages"
      :meta="collectionMeta"
    />
    <div>
      <div class="my-2 flex sm:flex-row justify-between items-center">
        <h2 class="text-2xl font-semibold leading-tight">All Collections</h2>
        <div class="my-2 flex sm:flex-row flex-col">
          <div class="relative flex">
            <button
              type="button"
              class="px-3 py-1 text-xs hover:bg-gray-200 border rounded"
              title="Reload"
              v-tippy="{arrow: true}"
              @click="$emit('reload')"
            >
              <font-awesome-icon :icon="['fas', 'sync']" class="text-xs" />
            </button>
            <select
              class="justify-center items-center mx-2 focus:outline-none outline-none flex flex-shrink border rounded text-gray-600 border-grey-lightest hover:bg-gray-100 appearance-none h-full px-4"
              @change="filter"
              v-model="defaultValue"
            >
              <option value="all">All</option>
              <option value="approved">Approved</option>
              <option value="declined">Declined</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="to pay">To Pay</option>
              <option value="printing process">Printing Process</option>
              <option value="completed">Completed</option>
              <option value="draft">Draft</option>
            </select>
            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-700"
            >
              <svg
                class="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                />
              </svg>
            </div>
          </div>
          <div class="mx-2 block relative">
            <span class="h-full absolute inset-y-0 left-0 flex items-center pl-2">
              <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current text-gray-500">
                <path
                  d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"
                />
              </svg>
            </span>
            <input
              placeholder="Search"
              class="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
            />
          </div>
        </div>
      </div>
      <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
        <div class="inline-block min-w-full border-l border-r overflow-hidden">
          <table class="min-w-full leading-normal table-fixed">
            <thead>
              <tr>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left"
                >Collection Name</th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left"
                >Designer</th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left"
                >Shop Name</th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center"
                >Status</th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center"
                >Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!collections.length">
                <td
                  colspan="4"
                  class="text-xl text-gray-600 px-5 py-5 border-b border-gray-200 bg-white text-sm text-center"
                >No collection(s).</td>
              </tr>
              <tr
                v-for="col in collections"
                :key="col._id"
                :class="{'bg-red-100': col.status === 'declined'}"
              >
                <td class="px-5 py-5 border-b border-gray-200 text-sm text-center">
                  <div class="flex items-center">
                    <div class="ml-3">
                      <p class="text-gray-900 whitespace-no-wrap flex items-center">
                        <span
                          class="relative text-xs inline-block px-3 py-1 font-semibold leading-tight mr-2"
                          :class="{
                            'text-white': col.plan === 'Sell',
                            'text-blue-800': col.plan === 'Buy',
                          }"
                        >
                          <span
                            aria-hidden
                            class="absolute inset-0 rounded-full"
                            :class="{
                              'bg-primary': col.plan === 'Sell',
                              'bg-blue-400': col.plan === 'Buy',
                            }"
                          ></span>
                          <span class="relative uppercase">{{ col.plan }}</span>
                        </span>
                        <nuxt-link
                          :to="`/admin/collections/${col._id}`"
                          class="text-blue-600 hover:underline"
                        >
                          <span>{{ col.name }}</span>
                        </nuxt-link>
                      </p>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 text-sm text-left">
                  <div class="text-gray-900 whitespace-no-wrap">
                    <nuxt-link
                      :to="`/admin/users/${col.user ? col.user._id : ''}`"
                      class="text-blue-600 hover:underline"
                    >{{ col.user ? col.user.name : '' }}</nuxt-link>
                  </div>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 text-sm text-left">
                  <div class="text-gray-900 whitespace-no-wrap" v-if="col.user && col.user.shopName">
                    <a
                      :href="`${shopifyUrl}collections/vendors?q=${_encodeUri(col.user.shopName)}`"
                      target="_blank"
                      class="text-blue-500 hover:text-blue-700"
                      title="Open store in new tab"
                      v-tippy="{arrow: true}"
                    >
                      <span>{{ col.user.shopName }}</span>
                      <font-awesome-icon :icon="['fas', 'external-link-alt']" />
                    </a>
                  </div>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 text-sm text-center">
                  <span class="relative inline-block px-3 py-1 font-semibold leading-tight text-xs">
                    <span
                      aria-hidden
                      class="absolute inset-0 rounded-full"
                      :class="{
                      'bg-green-200': ['approved', 'completed'].includes(col.status),
                      'bg-red-300': col.status === 'declined',
                      'bg-blue-200': col.status === 'pending',
                    }"
                    ></span>
                    <span class="relative uppercase font-black">{{ col.status }}</span>
                  </span>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 text-sm text-center">
                  <div>
                    <a
                      :href="col.handle"
                      target="_blank"
                      class="px-2 py-1 text-xs hover:bg-gray-200 border rounded mx-1"
                      title="Open in new tab"
                      v-tippy="{arrow: true}"
                    >
                      <font-awesome-icon :icon="['fas', 'external-link-alt']" />
                    </a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CollectionPreviewDrawer from "@/components/CollectionPreviewDrawer";

export default {
  props: {
    collections: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    CollectionPreviewDrawer,
  },
  data() {
    return {
      shopifyUrl: process.env.shopifyUrl,
      generatedImages: [],
      defaultValue: "all",
      filterValues: [],
      collectionMeta: {},
    };
  },
  methods: {
    async _validateStatusOf(collection) {
      const status = await this.$store.dispatch(
        "user_dashboard/collectionStatus",
        collection._id
      );

      return true;
    },
    _encodeUri(uri) {
      return encodeURIComponent(uri);
    },
    filter() {
      this.filterValues = [];
      this.filterValues.push(this.defaultValue);
      if (this.filterValues[0] === "all")
        this.filterValues = [
          "approved",
          "declined",
          "pending",
          "reviewing",
          "to pay",
          "printing process",
          "completed",
        ];

      this.$emit("filter", this.filterValues);
    },
  },
  watch: {
    "$route.query.status": {
      immediate: true,
      handler(to) {
        this.defaultValue = to?.split(",")?.length > 1 ? "all" : to;
      },
    },
  },
};
</script>