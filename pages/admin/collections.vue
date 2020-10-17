<template>
  <div class="sm:px-8 relative">
    <AreaLoader v-if="isLoading"/>
    <CollectionPreviewDrawer
      ref="collectionPreviewDrawer"
      v-if="generatedImages.length"
      :products="generatedImages"
      :meta="collectionMeta"
    />
    <div>
      <div class="my-2 flex sm:flex-row justify-between items-center">
        <h2 class="text-2xl font-semibold leading-tight">All Collections</h2>
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
              <tr v-for="col in collections" :key="col._id" :class="{'bg-red-100': col.status === 'declined'}">
                <td class="px-5 py-5 border-b border-gray-200 text-sm text-center">
                  <div class="flex items-center">
                    <div class="ml-3">
                      <p class="text-gray-900 whitespace-no-wrap flex items-center">
                        <span
                          class="relative text-xs inline-block px-3 py-1 font-semibold leading-tight mr-2"
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
                          @click.prevent="previewCollection(col)"
                        >
                          <span>{{ col.name }}</span>
                        </a>
                        <a href="#" class="ml-2 text-gray-400 hover:text-gray-600" title="Feature this Collection" v-tippy="{arrow: true}">
                          <font-awesome-icon :icon="['fas', 'star']"/>
                        </a>
                      </p>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 text-sm text-center">
                  <div class="border bg-gray-200 w-full bg-grey-light rounded-full" v-if="col.plan === 'Sell'">
                    <div
                      class="bg-primary text-xs rounded-full leading-none py-1 text-center text-white"
                      style="width: 45%"
                    >45%</div>
                  </div>
                  <div v-else>
                    N/A
                  </div>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 text-sm text-center">
                  <span
                    class="relative inline-block px-3 py-1 font-semibold leading-tight text-xs"
                  >
                    <span aria-hidden class="absolute inset-0 rounded-full" :class="{
                      'bg-green-200': col.status === 'approved',
                      'bg-red-300': col.status === 'declined',
                      'bg-blue-200': col.status === 'pending',
                    }"></span>
                    <span class="relative uppercase font-black">{{ col.status }}</span>
                  </span>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 text-sm text-center">
                  <div>
                    <button
                      type="button"
                      class="px-2 py-1 text-xs bg-white hover:bg-gray-200 border rounded mx-1"
                      title="Delete"
                      v-tippy="{arrow: true}"
                      @click="showDeleteCollectionConfirmation(col)"
                    >
                      <font-awesome-icon :icon="['fas', 'trash']" />
                    </button>
                    <button
                      type="button"
                      class="px-2 py-1 text-xs bg-white hover:bg-gray-200 border rounded mx-1"
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
import CollectionPreviewDrawer from '@/components/CollectionPreviewDrawer'

export default {
  layout: 'admin_dashboard',
  components: {
    CollectionPreviewDrawer
  },
  async mounted() {
    try {
      await this.$store.dispatch('admin/getCollections')
      this.isLoading = false
    } catch (error) {
      console.log(error)
    }
  },
  data() {
    return {
      isLoading: true,
      generatedImages: [],
      collectionMeta: {}
    }
  },
  computed: {
    ...mapGetters({
      collections: 'admin/collections'
    })
  },
  methods: {
    async previewCollection(collection){
      this.isLoading = true
      const collectionData = await this.$store.dispatch('designer/fetchDesignData', collection._id)
      const res = await this.$store.dispatch('designer/generatePreview', collectionData)
      this.isLoading = false
      this.generatedImages = res.data
      this.collectionMeta = collection
      this.$nextTick(() => {
        if(this.$refs.collectionPreviewDrawer) this.$refs.collectionPreviewDrawer.show()
      })
    }
  }
}
</script>