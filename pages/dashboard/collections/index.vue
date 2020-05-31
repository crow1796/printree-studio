<template>
  <div class="relative">
    <AreaLoader v-if="isLoading" />
    <VueTailwindModal
      ref="availableProductsModal"
      width="100%"
      content-class="rounded-none h-full shadow-none text-gray-600"
    >
      <div class="flex flex-col h-full">
        <div class="modal-heading border-b w-full p-4">
          <div class="flex justify-between w-full items-center">
            <div class="flex uppercase">
              <strong>Select Products</strong>
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
          >{{ tmpSelectedProducts.length || 'No' }} Products Selected</a>
          <button
            type="button"
            class="shadow-xl border border-white bg-primary px-8 py-2 font-bold rounded text-white hover:bg-primary-lighter"
            @click="createNewDesign"
          >CONTINUE</button>
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
    <div class="flex justify-between items-center">
      <div class="flex">
        <nuxt-link
          to="/dashboard/collections/orders"
          class="no-underline flex items-center text-blue-600 text-sm border-b"
        >
          <span class="mr-3">
            <font-awesome-icon :icon="['fas', 'boxes']" />
          </span> Orders
        </nuxt-link>
        <nuxt-link
          to="/dashboard/collections/payout"
          class="no-underline flex items-center text-blue-600 text-sm border-b ml-6"
        >
          <span class="mr-3">
            <font-awesome-icon :icon="['fas', 'receipt']" />
          </span> Payout
        </nuxt-link>
      </div>
      <TotalProfitCounter />
    </div>
    <div class="py-4">
      <div class="my-2 flex sm:flex-row justify-between items-center">
        <h2 class="text-2xl font-semibold leading-tight">My Collections</h2>
        <button
          type="button"
          class="border px-8 py-2 font-bold rounded outline-none focus:outline-none border-white bg-primary text-white hover:bg-primary-lighter"
          @click="showAvailableProducts"
        >Create New Collection</button>
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
                >Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!userCollections.length">
                <td
                  colspan="3"
                  class="text-xl text-gray-600 px-5 py-5 border-b border-gray-200 bg-white text-sm text-center"
                >You have no collection(s).</td>
              </tr>
              <tr v-for="col in userCollections" :key="col.id">
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                  <div class="flex items-center">
                    <div class="ml-3">
                      <p class="text-gray-900 whitespace-no-wrap">
                        <span
                          class="relative text-xs inline-block px-3 py-1 font-semibold leading-tight mr-1"
                          :class="{'text-white': col.plan === 'Sell', 'text-blue-800': col.plan === 'Buy'}"
                        >
                          <span
                            aria-hidden
                            class="absolute inset-0 rounded-full"
                            :class="{'bg-primary': col.plan === 'Sell', 'bg-blue-400': col.plan === 'Buy'}"
                          ></span>
                          <span class="relative uppercase">{{ col.plan }}</span>
                        </span>
                        <a
                          href="#"
                          class="text-blue-600 hover:underline"
                          @click.prevent="editCollection(col)"
                        >
                          <span>{{ col.name }}</span>
                        </a>
                        <!-- TODO: Add a function to edit the collection name use the template:
                          <a href="#" class="text-xs ml-1 hover:text-gray-800 text-gray-700" title="Edit Name">
                          <font-awesome-icon :icon="['fas', 'edit']"/>
                        </a>
                        -->
                      </p>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                  <span
                    class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight text-xs"
                  >
                    <span
                      aria-hidden
                      class="absolute inset-0 opacity-50 rounded-full"
                      :class="{
                      'bg-green-200': col.status === 'approved',
                      'bg-blue-200': col.status === 'pending',
                      'bg-red-200': col.status === 'draft',
                    }"
                    ></span>
                    <span class="relative uppercase">{{ col.status }}</span>
                  </span>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                  <div>
                    <button
                      type="button"
                      class="px-2 py-1 text-xs hover:bg-gray-200 border rounded mx-1"
                      title="Delete"
                      v-tippy="{arrow: true}"
                      @click="showDeleteCollectionConfirmation(col)"
                    >
                      <font-awesome-icon :icon="['fas', 'trash']" />
                    </button>
                    <button
                      type="button"
                      class="px-2 py-1 text-xs hover:bg-gray-200 border rounded mx-1"
                      title="Share"
                      v-tippy="{arrow: true}"
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
import { mapGetters } from 'vuex'
import TotalProfitCounter from '@/components/TotalProfitCounter'
import VueTailwindModal from '@/components/VueTailwindModal'
import AvailableProducts from '@/components/Designer/AvailableProducts'

export default {
  layout: 'user_dashboard',
  components: {
    VueTailwindModal,
    TotalProfitCounter,
    AvailableProducts
  },
  async mounted() {
    const collections = await this.$store.dispatch(
      'user_dashboard/getUserCollectionsOf',
      this.user.uid
    )
    // await this.$store.dispatch('user_dashboard/getTotalProfitOf', this.user)
    this.isLoading = false
  },
  data() {
    return {
      isLoading: true,
      tmpSelectedProducts: []
    }
  },
  computed: {
    ...mapGetters({
      userCollections: 'user_dashboard/userCollections',
      isLoggedIn: 'user/isLoggedIn',
      user: 'user/user'
    })
  },
  methods: {
    async showAvailableProducts() {
      this.isLoading = false
      this.$refs.availableProductsModal.show()
    },
    async createNewDesign() {
      if (!this.tmpSelectedProducts.length) return
      this.isLoading = true
      let collection = await this.$store.dispatch('designer/createNewDesign', {
        user: this.user,
        products: this.tmpSelectedProducts
      })
      this.tmpSelectedProducts = []
      this.$storage.setLocalStorage('current_design_id', collection._id)
      this.$router.push('/collection/designer')
    },
    editCollection(collection) {
      this.$storage.setLocalStorage('current_design_id', collection._id)
      this.$router.replace('/collection/designer')
    },
    showDeleteCollectionConfirmation(collection) {
      this.collectionToDelete = collection
      this.$refs.deleteConfirmationModal.show()
    },
    hideDeleteCollectionConfirmation() {
      this.collectionToDelete = null
      this.$refs.deleteConfirmationModal.hide()
    },
    async deleteCollection() {
      this.isLoading = true
      this.$refs.deleteConfirmationModal.hide()
      this.$storage.removeLocalStorage('current_design_id')
      await this.$store.dispatch(
        'designer/deleteCollection',
        this.collectionToDelete._id
      )
      this.$store.dispatch(
        'user_dashboard/removeCollectionById',
        this.collectionToDelete.id
      )
      this.isLoading = false
    }
  }
}
</script>