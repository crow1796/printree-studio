<template>
  <div class="sm:px-8 relative">
    <AreaLoader v-if="isLoading" fullscreen />
    <CollectionsTable :collections="collections" @filter="filterCollection" @reload="_loadItems"/>
    <SimplePagination @prev="goTo(prevPage)" @next="goTo(nextPage)"/>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CollectionsTable from "@/components/Admin/CollectionsTable";
import VueTailwindDropdown from "@/components/VueTailwindDropdown";
import SimplePagination from "@/components/SimplePagination";
import UserTypeCheckerMixin from '@/components/Mixins/UserTypeChecker'

export default {
  layout: "admin_dashboard",
  components: {
    VueTailwindDropdown,
    SimplePagination,
    CollectionsTable,
  },
  created() {
    if (!this.$route.query.colpage)
      this.$router.replace(
        "/admin/collections/?colpage=1&status=approved,declined,pending,reviewing"
      );
  },
  mixins: [UserTypeCheckerMixin],
  data() {
    return {
      isLoading: true,
      query: {
        plan: ["Sell", "Buy"],
        status: ["approved", "declined", "pending", "reviewing"],
        sorting: {
          field: "created_at",
          order: "ASC",
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
      collections: "admin/collections",
    }),
    prevPage() {
      const colPage = parseInt(this.$route.query.colpage);
      return colPage > 1 ? colPage - 1 : 1;
    },
    nextPage() {
      return parseInt(this.$route.query.colpage) + 1;
    },
  },
  watch: {
    "$route.query.colpage": {
      immediate: true,
      handler(to, from) {
        if (!to) return;
        this.query.pagination.page = parseInt(to);
      },
    },
    "$route.query.status": {
      immediate: true,
      handler(to, from) {
        if (!to) return;
        this.query.status = to.split(",");
      },
    },
    query: {
      deep: true,
      immediate: true,
      async handler(to, from) {
        await this._loadItems();
      },
    },
  },
  methods: {
    goTo(page) {
      if(page === this.query.pagination.page) return
      this.query.pagination.page = page;
      this._reloadRoute();
    },
    _reloadRoute() {
      this.$router.replace({
        path: "/admin/collections/",
        query: {
          colpage: this.query.pagination.page,
          status: this.query.status.join(","),
        },
      });
    },
    async _loadItems() {
      this.isLoading = true;
      try {
        await this.$store.dispatch("admin/getCollectionsAndCommit", {
          ...this.query,
          pagination: {
            ...this.query.pagination,
            page: this.query.pagination.page - 1
          }
        });
        this.isLoading = false;
      } catch (error) {
        console.log(error);
      }
    },
    async filterCollection(v) {
      this.query.status = v;
      this.query.pagination.page = 1;
      this._reloadRoute();
    },
  },
};
</script>