<template>
  <div class="sm:px-8 relative">
    <AreaLoader v-if="isLoading" fullscreen />
    <CollectionPreviewDrawer
      ref="collectionPreviewDrawer"
      v-if="generatedImages.length"
      :products="generatedImages"
      :meta="collectionMeta"
    />
    <div>
      <div class="my-2 flex sm:flex-row justify-between items-center">
        <h2 class="text-2xl font-semibold leading-tight">All Collections</h2>
        <div class="my-2 flex sm:flex-row flex-col">
          <div class="relative">
            <select
              class="appearance-none capitalize h-full rounded-r border-t sm:rounded-r-none sm:border-r-0 border-r border-b block appearance-none w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500"
              @change="filterCollection($event)"
              v-model="defaultValue"
            >
              <option :value="null">All</option>
              <option value="approved">Approved</option>
              <option value="declined">Declined</option>
              <option value="pending">Pending</option>
            </select>
            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
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
            <span
              class="h-full absolute inset-y-0 left-0 flex items-center pl-2"
            >
              <svg
                viewBox="0 0 24 24"
                class="h-4 w-4 fill-current text-gray-500"
              >
                <path
                  d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"
                ></path>
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
                >
                  Name
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center"
                >
                  Progress
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center"
                >
                  Status
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="col in collections"
                :key="col._id"
                :class="{ 'bg-red-100': col.status === 'declined' }"
              >
                <td
                  class="px-5 py-5 border-b border-gray-200 text-sm text-center"
                >
                  <div class="flex items-center">
                    <div class="ml-3">
                      <p
                        class="text-gray-900 whitespace-no-wrap flex items-center"
                      >
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
                        <a
                          href="#"
                          class="text-blue-600 hover:underline"
                          @click.prevent="previewCollection(col)"
                        >
                          <span>{{ col.name }}</span>
                        </a>
                      </p>
                    </div>
                  </div>
                </td>
                <td
                  class="px-5 py-5 border-b border-gray-200 text-sm text-center"
                >
                  <div
                    class="border bg-gray-200 w-full bg-grey-light rounded-full"
                    v-if="col.plan === 'Sell'"
                  >
                    <div
                      class="bg-primary text-xs rounded-full leading-none py-1 text-center text-white"
                      style="width: 45%"
                    >
                      45%
                    </div>
                  </div>
                  <div v-else>N/A</div>
                </td>
                <td
                  class="px-5 py-5 border-b border-gray-200 text-sm text-center"
                >
                  <span
                    class="relative inline-block px-3 py-1 font-semibold leading-tight text-xs"
                  >
                    <span
                      aria-hidden
                      class="absolute inset-0 rounded-full"
                      :class="{
                        'bg-green-200': col.status === 'approved',
                        'bg-red-300': col.status === 'declined',
                        'bg-blue-200': col.status === 'pending',
                      }"
                    ></span>
                    <span class="relative uppercase font-black">{{
                      col.status
                    }}</span>
                  </span>
                </td>
                <td
                  class="px-5 py-5 border-b border-gray-200 text-sm text-center"
                >
                  <div>
                    <button
                      type="button"
                      class="px-2 py-1 text-xs bg-white hover:bg-gray-200 border rounded mx-1"
                      title="Delete"
                      v-tippy="{ arrow: true }"
                      @click="showDeleteCollectionConfirmation(col)"
                    >
                      <font-awesome-icon :icon="['fas', 'trash']" />
                    </button>
                    <button
                      type="button"
                      class="px-2 py-1 text-xs bg-white hover:bg-gray-200 border rounded mx-1"
                      title="Share"
                      v-tippy="{ arrow: true }"
                    >
                      <font-awesome-icon :icon="['fas', 'share-alt']" />
                    </button>
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
import { mapGetters } from "vuex";
import CollectionPreviewDrawer from "@/components/CollectionPreviewDrawer";
import VueTailwindDropdown from "@/components/VueTailwindDropdown";

export default {
  layout: "admin_dashboard",
  components: {
    CollectionPreviewDrawer,
    VueTailwindDropdown,
  },
  async mounted() {
    try {
      await this.$store.dispatch("admin/getCollections", [
        "approved",
        "declined",
        "pending",
      ]);
      this.isLoading = false;
    } catch (error) {
      console.log(error);
    }
  },
  data() {
    return {
      isLoading: true,
      defaultValue: null,
      generatedImages: [],
      filterValues: [],
      collectionMeta: {},
    };
  },
  computed: {
    ...mapGetters({
      collections: "admin/collections",
    }),
  },
  methods: {
    async previewCollection(collection) {
      this.isLoading = true;
      const collectionData = await this.$store.dispatch(
        "designer/fetchDesignData",
        collection._id
      );
      const res = await this.$store.dispatch(
        "designer/generatePreview",
        collectionData
      );
      this.isLoading = false;
      this.generatedImages = res.data;
      this.collectionMeta = collection;
      this.$nextTick(() => {
        if (this.$refs.collectionPreviewDrawer)
          this.$refs.collectionPreviewDrawer.show();
      });
    },
    async filterCollection(event) {
      this.filterValues = [];
      this.filterValues.push(this.defaultValue);
      if (_.isEmpty(this.filterValues))
        this.filterValues = ["approved", "declined", "pending"];
      try {
        await this.$store.dispatch("admin/getCollections", this.filterValues);
        this.isLoading = false;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>