<template>
  <div class="mx-auto border border-gray-200">
    <ul class="shadow-box">
      <li
        class="relative border-b border-gray-200"
        v-for="(collection, i) in userCollections"
        :key="collection._id"
      >
        <button type="button" class="w-full px-8 py-6 outline-none text-left" @click="toggleContainer(i)">
          <div class="flex items-center justify-between">
            <div class="font-bold">
              <div class="text-gray-900 whitespace-no-wrap flex items-center">
                <span
                  class="relative text-xs inline-block px-3 py-1 font-semibold leading-tight mr-1"
                  :class="{
                        'text-white': collection.plan === 'Sell',
                        'text-blue-800': collection.plan === 'Buy',
                      }"
                >
                  <span
                    aria-hidden
                    class="absolute inset-0 rounded-full"
                    :class="{
                          'bg-primary': collection.plan === 'Sell',
                          'bg-blue-400': collection.plan === 'Buy',
                        }"
                  ></span>
                  <span class="relative uppercase">{{ collection.plan }}</span>
                </span>
                <span class="mx-2">{{ collection.name }}</span>
                <a
                  v-if="!['reviewing', 'to pay', 'printing process'].includes(collection.status)"
                  href="#"
                  class="text-xs hover:text-gray-800 text-gray-700"
                  @click.stop.prevent="$emit('rename-collection', collection)"
                  v-tippy="{arrow: true}"
                  title="Edit Collection Name"
                >
                  <font-awesome-icon :icon="['fas', 'edit']" />
                </a>
              </div>
            </div>
            <div class="flex items-center justify-center">
              <button
                v-if="!['reviewing'].includes(collection.status)"
                type="button"
                class="px-2 py-1 text-xs hover:bg-gray-200 border rounded mx-1"
                title="Edit Collection"
                v-tippy="{ arrow: true }"
                @click.stop="$emit('edit-collection', collection)"
              >
                <font-awesome-icon :icon="['fas', 'edit']" />
              </button>
              <button
                v-if="!['reviewing'].includes(collection.status) && collection.plan === 'Sell'"
                type="button"
                class="px-2 py-1 text-xs hover:bg-gray-200 border rounded mx-1"
                title="Delete"
                v-tippy="{ arrow: true }"
                @click.stop="$emit('delete-collection', collection)"
              >
                <font-awesome-icon :icon="['fas', 'trash']" />
              </button>
              <tippy arrow interactive v-if="collection.plan === 'Sell'">
                <template v-slot:trigger>
                  <button
                    type="button"
                    class="px-2 py-1 text-xs hover:bg-gray-200 border rounded mx-1"
                    title="Share"
                    v-tippy="{arrow: true}"
                  >
                    <font-awesome-icon :icon="['fas', 'share-alt']" />
                  </button>
                </template>
                <div class="flex w-full">
                  <ShareNetwork
                    network="facebook"
                    :url="`${urlOrigin}/marketplace/shop/${user.shop.slug}/collections/${collection._id}`"
                    :title="collection.name"
                    class="px-3 flex justify-center items-center bg-blue-700 mr-2 rounded"
                  >
                    <font-awesome-icon :icon="['fab', 'facebook-square']" />
                  </ShareNetwork>
                  <ShareNetwork
                    network="twitter"
                    :url="`${urlOrigin}/marketplace/shop/${user.shop.slug}/collections/${collection._id}`"
                    :title="collection.name"
                    class="px-3 flex justify-center items-center bg-blue-400 mr-2 rounded"
                  >
                    <font-awesome-icon :icon="['fab', 'twitter']" />
                  </ShareNetwork>
                  <div class="flex">
                    <input
                      class="flex flex-grow pl-4 w-1/2 rounded-l text-black bg-white"
                      disabled
                      :value="`${urlOrigin}/marketplace/shop/${user.shop.slug}/collections/${collection._id}`"
                      :ref="`copy-link-${collection._id}`"
                    />
                    <button
                      type="button"
                      class="text-xs w-10 flex items-center justify-center rounded-r bg-white text-black py-2 border-l"
                      v-tippy="{arrow: true}"
                      title="Copy Link"
                      @click="copyCollectionLinkToClipboard(collection)"
                    >
                      <font-awesome-icon :icon="['fas', 'clipboard']" />
                    </button>
                  </div>
                </div>
              </tippy>
            </div>
          </div>
        </button>

        <div
          class="relative overflow-hidden transition-all duration-700"
          :class="{'min-area-loader': selected === i}"
          :ref="`acc-container-${i}`"
        >
          <div class="p-6 border-t" v-if="selected === i">
            <AreaLoader v-if="sectionIsLoading" />
            <ProductsGrid
              :products="selectedProducts"
              grid="5"
              :showDesignerName="false"
              showProductStatus
              :showProductPrice="false"
              :showCollectionName="false"
              mx="0"
              @item-clicked="(prod) => $emit('item-clicked', prod)"
              :isLink="false"
            />
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import first from 'lodash/first'
import ProductsGrid from "@/components/ProductsGrid";
import { mapGetters } from "vuex";

export default {
  components: {
    ProductsGrid,
  },
  async mounted() {
    this.urlOrigin = window.location.origin;
  },
  data() {
    return {
      urlOrigin: "",
      selected: null,
      sectionIsLoading: false,
      selectedProducts: false,
      query: {
        userId: null,
        plan: ["Buy", "Sell"],
        status: [
          "draft",
          "approved",
          "declined",
          "pending",
          "reviewing",
          "to pay",
          "printing process",
          "completed",
        ],
        sorting: {
          field: "created_at",
          order: "DESC",
        },
      },
    };
  },
  methods: {
    copyCollectionLinkToClipboard(col) {
      const copyText = first(this.$refs[`copy-link-${col._id}`]);
      if (!copyText) return;
      copyText.disabled = false;
      copyText.select();
      copyText.setSelectionRange(0, 99999);
      document.execCommand("copy");
      copyText.disabled = true;
    },
    async toggleContainer(i) {
      if (this.selected === i) return (this.selected = null);

      this.selected = i;
      this.sectionIsLoading = true;

      this.selectedProducts = await this.$store.dispatch(
        "user_dashboard/getUserProductsOf",
        {
          ...this.query,
          collectionId: this.userCollections[i]?._id,
        }
      );

      this.sectionIsLoading = false;
    },
  },
  computed: {
    ...mapGetters({
      userCollections: "user_dashboard/userCollections",
      isLoggedIn: "isLoggedIn",
      user: "user",
    }),
  },
};
</script>