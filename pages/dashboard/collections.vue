<template>
  <div class="sm:px-8">
    <AreaLoader v-if="isLoading" fullscreen />
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
    <div class="py-8">
      <div>
        <h2 class="text-2xl font-semibold leading-tight">My Collections</h2>
      </div>
      <div class="my-2 flex sm:flex-row flex-col">
        <div class="flex flex-row mb-1 sm:mb-0">
          <div class="relative">
            <select
              class="appearance-none h-full rounded-l border block appearance-none w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            >
              <option>5</option>
              <option>10</option>
              <option>20</option>
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
          <div class="relative">
            <select
              class="appearance-none h-full rounded-r border-t sm:rounded-r-none sm:border-r-0 border-r border-b block appearance-none w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500"
            >
              <option>All</option>
              <option>Published</option>
              <option>Sold Out</option>
              <option>Draft</option>
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
        </div>
        <div class="flex justify-between flex-grow">
          <div class="block relative">
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
          <div>
            <button
              type="button"
              class="border px-8 py-2 font-bold rounded outline-none focus:outline-none border-white bg-primary text-white hover:bg-primary-lighter"
              @click="showAvailableProducts"
            >Create New Collection</button>
          </div>
        </div>
      </div>
      <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
        <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
          <table class="min-w-full leading-normal table-fixed">
            <thead>
              <tr>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left"
                >Name</th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center"
                >Progress</th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center"
                >Status</th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center"
                >Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="col in userCollections" :key="col.id">
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                  <div class="flex items-center">
                    <div class="ml-3">
                      <p class="text-gray-900 whitespace-no-wrap">
                        <span
                          class="relative text-xs inline-block px-3 py-1 font-semibold leading-tight mr-1"
                          :class="{'text-white': col.plan === 'sell', 'text-blue-800': col.plan === 'buy'}"
                        >
                          <span
                            aria-hidden
                            class="absolute inset-0 rounded-full"
                            :class="{'bg-primary': col.plan === 'sell', 'bg-blue-400': col.plan === 'buy'}"
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
                  <div class="border p-1 w-full bg-grey-light rounded-full" v-if="col.plan === 'sell'">
                    <div
                      class="bg-primary text-xs rounded-full leading-none py-1 text-center text-white"
                      style="width: 45%"
                    >45%</div>
                  </div>
                  <div v-else>
                    N/A
                  </div>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                  <span
                    class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight text-xs"
                  >
                    <span aria-hidden class="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
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
          <div
            class="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between"
          >
            <span class="text-xs xs:text-sm text-gray-900">Showing 1 to 4 of 50 Entries</span>
            <div class="inline-flex mt-2 xs:mt-0">
              <button
                class="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l"
              >Prev</button>
              <button
                class="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r"
              >Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VueTailwindModal from '@/components/VueTailwindModal'
import AvailableProducts from '@/components/Designer/AvailableProducts'

export default {
  layout: 'user_dashboard',
  components: {
    VueTailwindModal,
    AvailableProducts
  },
  async created() {
    const collections = await this.$store.dispatch(
      'user_dashboard/getUserCollectionsOf',
      this.user.uid
    )
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
      let design = await this.$store.dispatch('designer/createNewDesign', {
        user: this.user,
        products: this.tmpSelectedProducts
      })
      this.tmpSelectedProducts = []
      this.$storage.setLocalStorage('current_design_id', design.id)
      this.$router.push('/collection/designer')
    },
    editCollection(collection) {
      this.$storage.setLocalStorage('current_design_id', collection.id)
      this.$router.replace('/collection/designer')
    }
  }
}
</script>