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
        <h2 class="text-2xl font-semibold leading-tight">My Collections</h2>
        <button
          type="button"
          class="sm:flex hidden border px-8 py-2 font-bold rounded outline-none focus:outline-none border-white bg-primary text-white hover:bg-primary-lighter"
          @click="showAvailableProducts"
        >Create new collection</button>
      </div>
      <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
        <div class="inline-block min-w-full border-l border-r overflow-hidden w-full">
          <CollectionsAccordion
            @item-clicked="editCollection"
            @delete-collection="showDeleteCollectionConfirmation"
            @edit-collection="(col) => editCollection(col, 'collection')"
            @rename-collection="showCollectionRenameModal"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { TippyComponent } from "vue-tippy";
import VueTailwindModal from "@/components/VueTailwindModal";
import CollectionsAccordion from "@/components/CollectionsAccordion";
import first from "lodash/first";
import AvailableProducts from "@/components/Designer/AvailableProducts";
import UserTypeCheckerMixin from "@/components/Mixins/UserTypeChecker";

export default {
  layout: "user_dashboard",
  components: {
    VueTailwindModal,
    AvailableProducts,
    CollectionsAccordion,
    tippy: TippyComponent,
  },
  mixins: [UserTypeCheckerMixin],
  async mounted() {
    this.urlOrigin = window.location.origin;
    await this.$store.dispatch("user_dashboard/getUserCollectionsOf");
    this.$store.commit("designer/SELECTED_PRODUCTS", []);
    this.isLoading = false;
  },
  data() {
    return {
      urlOrigin: "",
      isLoading: true,
      isLoadingFull: false,
      isRenameLoading: false,
      tmpSelectedProducts: [],
      selectedCollection: null,
      collectionToRename: null,
      newCollectionName: null,
    };
  },
  computed: {
    ...mapGetters({
      userCollections: "user_dashboard/userCollections",
      isLoggedIn: "isLoggedIn",
      user: "user",
    }),
  },
  methods: {
    _firstThumbnailOf(product) {
      const firstVariant = first(product.variants);
      if (!firstVariant) return "";
      const firstContent =
        find(firstVariant.contents, { isMainThumb: true }) ||
        first(firstVariant.contents);
      if (!firstContent) return "";
      return firstContent.fullThumb;
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
      product,
      statusToCheck = ["approved", "reviewing", "to pay", "printing process"]
    ) {
      let type = "product";
      if (!product.parent_collection) type = "collection";

      const statusCheckAction =
        type === "collection"
          ? "user_dashboard/collectionStatus"
          : "user_dashboard/productStatus";
      const statusCheckCommit =
        type === "collection"
          ? "user_dashboard/UPDATE_COLLECTION_STATUS"
          : "user_dashboard/UPDATE_PRODUCT_STATUS";

      const { status, handle } = await this.$store.dispatch(
        statusCheckAction,
        product._id
      );

      if (statusToCheck.includes(status)) {
        this.$store.commit(statusCheckCommit, {
          _id: product._id,
          newStatus: status,
          ...(type === "collection"
            ? {
                handle,
              }
            : {}),
        });

        let message = "";
        switch (status) {
          case "approved":
            this.selectedProduct = product;
            this.$refs.editConfirmationModal.show();
            break;
          case "reviewing":
            message = `Our team is currently reviewing this item. Please try again later.`;
            break;
          case "to pay":
            message =
              "Cannot edit item. Please check your email for the payment process.";
            break;
          case "printing process":
            message =
              "Cannot edit item. We are now working on your order. You will receive an email/SMS when it's ready for delivery.";
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

      this._goToCollectionDesigner(this.selectedProduct, "product");
    },
    _goToCollectionDesigner(product, type) {
      localStorage.removeItem("_stored_ptree");
      let id = product._id
      if(type === 'product') id = product.parent_collection._id
      this.$storage.setLocalStorage(
        "current_design_id",
        id
      );
      this.$store.commit("designer/CURRENT_PRODUCT_INDEX", 0);

      let route = `/collection/designer`;
      if (type === "product")
        route = `/collection/designer/?single=on&prod=${product._id}`;
      this.$router.replace(route);
    },
    async editCollection(prod, type = "product") {
      this.isLoading = true;
      const statusValidation = await this._validateStatusOf(prod);
      if (!statusValidation) {
        this.isLoading = false;
        return;
      }

      this._goToCollectionDesigner(prod, type);
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
      this.isLoadingFull = true;
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
      this.isLoadingFull = false;
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