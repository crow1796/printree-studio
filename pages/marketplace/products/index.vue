<template>
  <div class="container mx-auto">
    <div class="font-bold text-2xl mt-6 mb-2 px-8">All Products</div>
    <div class="relative min-h-area-loader">
      <AreaLoader v-if="isLoading" />
      <ProductsGrid :products="products" />
      <div class="flex flex-grow justify-center pb-6 mt-4">
        <SimplePagination @prev="goTo(prev)" @next="goTo(next)" />
      </div>
    </div>
  </div>
</template>

<script>
import ProductsGrid from "@/components/ProductsGrid";
import SimplePagination from "@/components/SimplePagination";

export default {
  layout: "marketplace",
  components: {
    ProductsGrid,
    SimplePagination,
  },
  created() {
    const page = this.$route.query.page;
    if (!page) return this.$router.replace("/marketplace/products/?page=1");
    this.currentPage = parseInt(page);
  },
  async mounted() {
    this._loadItems();
  },
  data() {
    return {
      lastItem: null,
      firstItem: null,
      isLoading: true,
      products: [],
      currentPage: this.$route.query.page,
      query: {
        plan: ["Sell"],
        status: ["approved"],
        sorting: {
          field: "created_at",
          order: "DESC",
        },
        pagination: {
          limit: 16,
          page: 0,
        },
      },
    };
  },
  methods: {
    goTo(page) {
      if (page === this.query.pagination.page) return;
      this.query.pagination.page = page;
      this._reloadRoute();
    },
    _reloadRoute() {
      this.$router.replace({
        path: "/marketplace/products/",
        query: {
          page: this.query.pagination.page,
        },
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    async _loadItems() {
      this.isLoading = true;
      const res = await this.$store.dispatch(
        "marketplace/getProductsToSell",
        this.query
      );
      this.products = res;
      this.isLoading = false;
    },
  },
  computed: {
    next() {
      return parseInt(this.$route.query.page) + 1;
    },
    prev() {
      const page = parseInt(this.$route.query.page);
      return page > 1 ? page - 1 : 1;
    },
  },
  watch: {
    "$route.query.page": {
      immediate: true,
      handler(to, from) {
        if (!to) return;
        this.query.pagination.page = parseInt(to);
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
};
</script>