<template>
  <div class="relative">
    <AreaLoader v-if="isLoading" :fullscreen="isLoadingFull" />
    <VueTailwindModal
      ref="availableProductsModal"
      width="100%"
      content-class="rounded-none h-full shadow-none text-gray-600"
    >
      <div class="flex flex-col h-full">
        <div class="modal-heading border-b w-full p-4">
          <div class="flex justify-between w-full items-center">
            <div class="flex uppercase flex-col">
              <div>
                <strong>Select Products</strong>
              </div>
              <div
                class="text-xs normal-case text-red-500"
              >Each {{ userTypeIs('buyer') ? 'order' : 'collection' }} can only have a maximum of 10 products.</div>
            </div>
            <div class="flex text-right">
              <div
                class="select-none cursor-pointer w-8 h-8 border rounded-full flex justify-center items-center hover:border-gray-600 hover:text-gray-700"
                @click="$refs.availableProductsModal.hide()"
              >
                <font-awesome-icon :icon="['fas', 'times']" class="text-xs" />
              </div>
            </div>
          </div>
        </div>
        <div class="flex modal-body flex-grow h-full">
          <AvailableProducts v-model="tmpSelectedProducts" />
        </div>
        <div class="flex modal-footer justify-between flex-shrink p-4 border-t items-center">
          <a
            href="#"
            class="text-blue-400 cursor-help border-dashed border-b hover:border-blue-400"
          >{{ tmpSelectedProducts.length || "No" }} Products Selected</a>
          <button
            type="button"
            class="shadow-xl border border-white bg-primary px-8 py-6 font-bold rounded text-white hover:bg-primary-lighter"
            @click="createNewDesign"
          >
            START DESIGNING
            <font-awesome-icon :icon="['fas', 'arrow-right']" />
          </button>
        </div>
      </div>
    </VueTailwindModal>
    <VueTailwindModal
      ref="deleteConfirmationModal"
      width="30%"
      content-class="rounded-none shadow-none text-gray-600"
    >
      <div class="flex flex-col">
        <div class="modal-heading border-b w-full p-4">
          <div class="flex justify-between w-full items-center">
            <div class="flex uppercase justify-center flex-grow">
              <strong>Confirmation</strong>
            </div>
          </div>
        </div>
        <div class="modal-body p-4 text-center">Are you sure you want to delete this collection?</div>
        <div class="flex modal-footer justify-between flex-shrink p-4 border-t items-center">
          <button
            type="button"
            class="justify-center items-center focus:outline-none outline-none border px-3 py-2 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
            @click="hideDeleteCollectionConfirmation"
          >No</button>

          <button
            type="button"
            class="shadow-xl border border-white bg-primary px-8 py-2 font-bold rounded text-white hover:bg-primary-lighter"
            @click="deleteCollection"
          >Yes</button>
        </div>
      </div>
    </VueTailwindModal>
    <VueTailwindModal
      ref="editConfirmationModal"
      width="30%"
      content-class="rounded-none shadow-none text-gray-600"
    >
      <div class="flex flex-col">
        <div class="modal-heading border-b w-full p-4">
          <div class="flex justify-between w-full items-center">
            <div class="flex uppercase justify-center flex-grow">
              <strong>Confirmation</strong>
            </div>
          </div>
        </div>
        <div
          class="modal-body p-4 text-center"
        >The collection is already approved. Once you edit this it will undergo again for another review. Do you want to continue?</div>
        <div class="flex modal-footer justify-between flex-shrink p-4 border-t items-center">
          <button
            type="button"
            class="justify-center items-center focus:outline-none outline-none border px-3 py-2 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
            @click="hideEditCollectionConfirmation"
          >No</button>

          <button
            type="button"
            class="shadow-xl border border-white bg-primary px-8 py-2 font-bold rounded text-white hover:bg-primary-lighter"
            @click="confirmEditCollectionConfirmation"
          >Yes</button>
        </div>
      </div>
    </VueTailwindModal>
    <VueTailwindModal
      ref="collectionRenameModal"
      width="30%"
      :backdrop="false"
      content-class="rounded-none shadow-none text-gray-600"
    >
      <AreaLoader v-if="isRenameLoading" />
      <div class="flex flex-col">
        <div class="modal-heading border-b w-full p-4">
          <div class="flex justify-between w-full items-center">
            <div class="flex uppercase justify-center flex-grow">
              <strong>Collection Rename</strong>
            </div>
          </div>
        </div>
        <div class="modal-body p-4">
          <div>
            <label for="newCollectionName" class="font-bold mb-3 block">New Collection Name</label>
            <div v-if="collectionToRename">
              <input
                type="text"
                name="newCollectionName"
                class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                :class="{ 'border-red-400': errors.has('newCollectionName'), 'focus:border-gray-600': !errors.has('newCollectionName') }"
                :placeholder="collectionToRename.name"
                v-validate="'required'"
                data-vv-as="Collection Name"
                v-model="newCollectionName"
                @keyup.enter="renameCollection"
              />
            </div>
            <span
              class="text-red-700 text-xs pt-1 font-bold inline-block"
              v-if="errors.has('newCollectionName')"
            >{{ errors.first('newCollectionName') }}</span>
          </div>
        </div>
        <div class="flex modal-footer justify-between flex-shrink p-4 border-t items-center">
          <button
            type="button"
            class="justify-center items-center focus:outline-none outline-none border px-3 py-2 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
            @click="hideCollectionRenameModal"
          >Cancel</button>

          <button
            type="button"
            class="shadow-xl border border-white bg-primary px-8 py-2 font-bold rounded text-white hover:bg-primary-lighter"
            @click="renameCollection"
          >Save</button>
        </div>
      </div>
    </VueTailwindModal>
    <div class="flex justify-between items-center">
      <div class="flex">
        <nuxt-link
          to="/dashboard/collections/orders"
          class="no-underline flex items-center text-blue-600 text-sm border-b"
        >
          <span class="mr-3">
            <font-awesome-icon :icon="['fas', 'boxes']" />
          </span>
          Orders
        </nuxt-link>
      </div>
    </div>
    <div class="py-4">
      <div class="my-2 flex sm:flex-row justify-between items-center">
        <h2 class="text-2xl font-semibold leading-tight">My Products</h2>
        <button
          type="button"
          class="border px-8 py-2 font-bold rounded outline-none focus:outline-none border-white bg-primary text-white hover:bg-primary-lighter"
          @click="showAvailableProducts"
        >Create new product</button>
      </div>
      <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
        <div class="inline-block min-w-full border-l border-r overflow-hidden">
          <table class="min-w-full leading-normal table-fixed">
            <thead>
              <tr>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left"
                >Name</th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center"
                >Status</th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center"
                >Collection</th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center"
                >Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!userProducts.length">
                <td
                  colspan="3"
                  class="text-xl text-gray-600 px-5 py-5 border-b border-gray-200 bg-white text-sm text-center"
                >You have no products(s).</td>
              </tr>
              <tr
                v-for="prod in userProducts"
                :key="prod.id"
                :class="{
                'bg-red-100': prod.status === 'declined'}"
              >
                <td class="px-5 py-5 border-b border-gray-200 text-sm text-center">
                  <div class="flex items-center">
                    <div class="ml-3">
                      <p class="text-gray-900 whitespace-no-wrap">
                        <span
                          class="relative text-xs inline-block px-3 py-1 font-semibold leading-tight mr-1"
                          :class="{
                            'text-white': prod.parent_collection.plan === 'Sell',
                            'text-blue-800': prod.parent_collection.plan === 'Buy',
                          }"
                        >
                          <span
                            aria-hidden
                            class="absolute inset-0 rounded-full"
                            :class="{
                              'bg-primary': prod.parent_collection.plan === 'Sell',
                              'bg-blue-400': prod.parent_collection.plan === 'Buy',
                            }"
                          ></span>
                          <span class="relative uppercase">{{ prod.parent_collection.plan }}</span>
                        </span>
                        <a
                          href="#"
                          class="text-blue-600 hover:underline"
                          @click.prevent="editCollection(prod.parent_collection, prod)"
                        >
                          <span>{{ prod.meta.name }}</span>
                        </a>
                      </p>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 text-sm text-center">
                  <span
                    class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight text-xs"
                  >
                    <span
                      aria-hidden
                      class="absolute inset-0 opacity-50 rounded-full"
                      :class="{
                        'bg-green-200':['approved', 'completed'].includes(prod.status),
                        'bg-blue-200': prod.status === 'pending',
                        'bg-red-300': ['draft', 'declined'].includes(prod.status),
                      }"
                    ></span>
                    <span class="relative uppercase">{{ prod.status }}</span>
                  </span>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 text-sm text-center">
                  <a
                    href="#"
                    class="text-blue-600 hover:underline"
                    @click.prevent="editCollection(prod.parent_collection)"
                  >
                    <span class="relative">{{ prod.parent_collection.name }}</span>
                  </a>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 text-sm text-center">
                  <div class="flex items-center justify-center">
                    <button
                      v-if="!['reviewing'].includes(prod.status) && prod.parent_collection.plan === 'Sell'"
                      type="button"
                      class="px-2 py-1 text-xs hover:bg-gray-200 border rounded mx-1"
                      title="Delete"
                      v-tippy="{ arrow: true }"
                      @click="showDeleteCollectionConfirmation(prod)"
                    >
                      <font-awesome-icon :icon="['fas', 'trash']" />
                    </button>
                    <tippy
                      trigger="click"
                      arrow
                      interactive
                      v-if="['approved'].includes(prod.status) && prod.parent_collection.plan === 'Sell'"
                    >
                      <template v-slot:trigger>
                        <button
                          type="button"
                          class="px-2 py-1 text-xs hover:bg-gray-200 border rounded mx-1"
                          title="Share Collection"
                          v-tippy="{arrow: true}"
                        >
                          <font-awesome-icon :icon="['fas', 'share-alt']" />
                        </button>
                      </template>
                      <div class="flex w-full">
                        <ShareNetwork
                          network="facebook"
                          :url="prod.parent_collection.handle"
                          :title="prod.parent_collection.name"
                          class="px-3 flex justify-center items-center bg-blue-700 mr-2 rounded"
                        >
                          <font-awesome-icon :icon="['fab', 'facebook-square']" />
                        </ShareNetwork>
                        <ShareNetwork
                          network="twitter"
                          :url="prod.parent_collection.handle"
                          :title="prod.parent_collection.name"
                          class="px-3 flex justify-center items-center bg-blue-400 mr-2 rounded"
                        >
                          <font-awesome-icon :icon="['fab', 'twitter']" />
                        </ShareNetwork>
                        <div class="flex">
                          <input
                            class="flex flex-grow pl-4 w-1/2 rounded-l text-black bg-white"
                            disabled
                            :value="prod.parent_collection.handle"
                            :ref="`copy-link-${prod.parent_collection._id}`"
                          />
                          <button
                            type="button"
                            class="text-xs w-10 flex items-center justify-center rounded-r bg-white text-black py-2 border-l"
                            v-tippy="{arrow: true}"
                            title="Copy Link"
                            @click="copyCollectionLinkToClipboard(prod.parent_collection)"
                          >
                            <font-awesome-icon :icon="['fas', 'clipboard']" />
                          </button>
                        </div>
                      </div>
                    </tippy>
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
import { TippyComponent } from "vue-tippy";
import VueTailwindModal from "@/components/VueTailwindModal";
import first from "lodash/first";
import AvailableProducts from "@/components/Designer/AvailableProducts";
import UserTypeCheckerMixin from "@/components/Mixins/UserTypeChecker";

export default {
  layout: "user_dashboard",
  components: {
    VueTailwindModal,
    AvailableProducts,
    tippy: TippyComponent,
  },
  mixins: [UserTypeCheckerMixin],
  created() {
    this.query.userId = this.user._id;
  },
  async mounted() {
    await this.$store.dispatch("user_dashboard/getUserProductsOf", this.query);
    this.$store.commit("designer/SELECTED_PRODUCTS", []);
    this.isLoading = false;
  },
  data() {
    return {
      isLoading: true,
      isLoadingFull: false,
      isRenameLoading: false,
      tmpSelectedProducts: [],
      selectedProduct: null,
      collectionToRename: null,
      newCollectionName: null,
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
        pagination: {
          limit: 15,
          page: 0,
        },
      },
    };
  },
  computed: {
    ...mapGetters({
      userProducts: "user_dashboard/userProducts",
      isLoggedIn: "isLoggedIn",
      user: "user",
    }),
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
    async showAvailableProducts() {
      this.isLoading = false;
      this.$refs.availableProductsModal.show();
    },
    async createNewDesign() {
      if (!this.tmpSelectedProducts.length) return;
      this.isLoading = true;
      this.isLoadingFull = true;
      let collection = await this.$store.dispatch("designer/createNewDesign", {
        user: this.user,
        products: this.tmpSelectedProducts,
      });
      if (!collection) this.isLoadingFull = false;
      this.tmpSelectedProducts = [];
      this.$storage.setLocalStorage("current_design_id", collection._id);
      this.$router.push("/collection/designer");
    },
    async _validateStatusOf(
      collection,
      statusToCheck = ["approved", "reviewing", "to pay", "printing process"]
    ) {
      const { status, handle } = await this.$store.dispatch(
        "user_dashboard/collectionStatus",
        collection._id
      );

      if (statusToCheck.includes(status)) {
        this.$store.commit("user_dashboard/UPDATE_COLLECTION_STATUS", {
          _id: collection._id,
          newStatus: status,
          handle,
        });

        this.$store.commit("user_dashboard/UPDATE_COLLECTION_HANDLE", {
          _id: collection._id,
          handle,
        });

        let message = "";
        switch (status) {
          case "approved":
            this.selectedProduct = collection;
            this.$refs.editConfirmationModal.show();
            break;
          case "reviewing":
            message = `Our team is currently reviewing this collection. Please try again later.`;
            break;
          case "to pay":
            message =
              "Cannot edit collection. Please check your email for the payment process.";
            break;
          case "printing process":
            message =
              "Cannot edit collection. We are now working on your order. You will receive an email/SMS when it's ready for delivery.";
            break;
        }

        if (message)
          this.$toast.info(message, {
            position: "top",
          });
        return false;
      }

      return true;
    },
    hideEditCollectionConfirmation() {
      this.selectedProduct = null;
      this.$refs.editConfirmationModal.hide();
    },
    confirmEditCollectionConfirmation() {
      this.$refs.editConfirmationModal.hide();

      this._goToCollectionDesigner(this.selectedProduct);
    },
    _goToCollectionDesigner(collection) {
      localStorage.removeItem("_stored_ptree");
      this.$storage.setLocalStorage("current_design_id", collection._id);
      this.$store.commit("designer/CURRENT_PRODUCT_INDEX", 0);
      this.$router.replace("/collection/designer");
    },
    async editCollection(collection, prod) {
      this.isLoading = true;
      const statusValidation = await this._validateStatusOf(collection);
      if (!statusValidation) {
        this.isLoading = false;
        return;
      }

      this._goToCollectionDesigner(collection);
    },
    async showDeleteCollectionConfirmation(product) {
      const statusValidation = await this._validateStatusOf(product, [
        "reviewing",
      ]);
      if (!statusValidation) return;
      this.selectedProduct = product;
      this.$refs.deleteConfirmationModal.show();
    },
    hideDeleteCollectionConfirmation() {
      this.selectedProduct = null;
      this.$refs.deleteConfirmationModal.hide();
    },
    async deleteCollection() {
      this.isLoading = true;
      this.$refs.deleteConfirmationModal.hide();
      this.$storage.removeLocalStorage("current_design_id");
      await this.$store.dispatch(
        "designer/deleteCollection",
        this.selectedProduct._id
      );
      this.$store.dispatch(
        "user_dashboard/removeCollectionById",
        this.selectedProduct.id
      );
      this.isLoading = false;
    },
    showCollectionRenameModal(prod) {
      this.collectionToRename = { ...prod };
      this.$refs.collectionRenameModal.show();
    },
    async renameCollection() {
      let validationResponse = await this.$validator.validateAll({
        newCollectionName: this.newCollectionName,
      });
      if (!validationResponse || this.isRenameLoading) return;
      if (this.collectionToRename.name === this.newCollectionName) return;
      this.isRenameLoading = true;
      await this.$store.dispatch("user_dashboard/updateCollectionName", {
        _id: this.collectionToRename._id,
        newName: this.newCollectionName,
      });
      this.isRenameLoading = false;
      this.$validator.reset();
      this.hideCollectionRenameModal();
    },
    hideCollectionRenameModal() {
      this.$refs.collectionRenameModal.hide();
      this.collectionToRename = null;
      this.newCollectionName = null;
    },
  },
};
</script>