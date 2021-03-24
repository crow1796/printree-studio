<template>
  <div class="relative sm:px-8">
    <AreaLoader v-if="isLoading" />
    <ShippingProfileDrawer ref="shippingProfileDrawer" :mode="formMode" @save="saveProfile" />

    <div class="my-2 flex justify-between items-center">
      <h2 class="text-2xl font-semibold leading-tight">Shipping Profiles</h2>

      <div class="flex items-center">
        <button
          type="button"
          class="px-3 py-2 text-xs hover:bg-gray-200 border rounded font-bold outline-none focus:outline-none mr-2"
          title="Reload"
          v-tippy="{arrow: true}"
          @click="_loadItems"
        >
          <font-awesome-icon :icon="['fas', 'sync']" class="text-xs" />
        </button>
        <button
          type="button"
          class="border px-8 py-2 font-bold rounded outline-none focus:outline-none border-white bg-primary text-white hover:bg-primary-lighter"
          @click="showProfileDrawer"
        >Add New Shipping Profile</button>
      </div>
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
                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left"
              >Zones</th>
              <th
                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center"
              >Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!shippingProfiles.length">
              <td
                colspan="5"
                class="text-xl text-gray-600 px-5 py-5 border-b border-gray-200 bg-white text-sm text-center"
              >No shipping profiles.</td>
            </tr>
            <tr v-for="profile in shippingProfiles" :key="profile._id">
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-left">
                <div class="text-gray-900 whitespace-no-wrap">
                  <a
                    href="#"
                    class="text-blue-600 hover:underline"
                    @click="editProfile(profile)"
                  >{{ profile.name }}</a>
                </div>
              </td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <div v-for="(zone, zi) in profile.zones" :key="zone._id" :class="{'mb-2': zi !== profile.zones.length - 1}">
                  <div class="font-bold">{{zone.name}}</div>
                  <div>{{ zone.provinces.length }} areas</div>
                </div>
              </td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                <div>
                  <button
                    type="button"
                    class="px-2 py-1 text-xs hover:bg-gray-200 border rounded mx-1"
                  >
                    <font-awesome-icon :icon="['fas', 'trash']" />
                    <span class="ml-1">Delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <SimplePagination @prev="goTo(prevPage)" @next="goTo(nextPage)" />
    </div>
  </div>
</template>

<script>
import SimplePagination from "@/components/SimplePagination";
import ShippingProfileDrawer from "@/components/ShippingProfileDrawer";
import findIndex from "lodash/findIndex";

export default {
  layout: "admin_dashboard",
  components: {
    SimplePagination,
    ShippingProfileDrawer,
  },
  created() {
    if (!this.$route.query.sopage)
      this.$router.replace("/admin/settings/shipping-profiles/?sopage=1");
  },
  async mounted() {
    this.shippingProfiles = await this.$store.dispatch(
      "admin/shippingProfiles"
    );

    this.isLoading = false;
  },
  data() {
    return {
      isLoading: true,
      formMode: "create",
      shippingProfiles: [],
      query: {
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
    prevPage() {
      const colPage = parseInt(this.$route.query.sopage);
      return colPage > 1 ? colPage - 1 : 1;
    },
    nextPage() {
      return parseInt(this.$route.query.sopage) + 1;
    },
  },
  methods: {
    saveProfile(profile) {
      const index = findIndex(this.shippingProfiles, { _id: profile._id });
      this.$set(this.shippingProfiles, index, profile)
    },
    editProfile(profile) {
      this.$refs.shippingProfileDrawer.show(profile);
    },
    showProfileDrawer() {
      this.$refs.shippingProfileDrawer.show();
    },
    async _loadItems() {},
    goTo(page) {
      if (page === this.query.pagination.page) return;
      this.query.pagination.page = page;
      this._reloadRoute();
    },
  },
};
</script>