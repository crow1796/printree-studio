<template>
  <div class="container mx-auto mt-32">
    <div class="relative min-h-area-loader">
      <AreaLoader v-if="isLoading" />
      <div class="font-bold text-2xl mt-6 mb-2 px-8">{{ meta ? meta.name : "Collection Products" }}</div>
      
      <ProductsGrid :rootUrl="rootUrl" :products="products" />
      <div class="flex flex-grow justify-center pb-6 mt-4">
        <SimplePagination
          @prev="goTo(prev)"
          @next="goTo(next)"
          v-if="products && products.length >= query.pagination.limit"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ProductsGrid from "@/components/ProductsGrid";
import SimplePagination from "@/components/SimplePagination";

export default {
  layout: "shop",
  components: {
    ProductsGrid,
    SimplePagination,
  },
  created() {
    const page = this.$route.query.page;
    if (page === undefined)
      return this.$router.replace(
        `/marketplace/shop/${this.$route.params.slug}/collections/${this.$route.params.id}/?page=1`
      );
    this.currentPage = parseInt(page);
  },
  async mounted() {
    this.meta = await this.$store.dispatch(
      "marketplace/getCollectionMeta",
      this.$route.params.id
    );
  },
  data() {
    return {
      lastItem: null,
      firstItem: null,
      isLoading: true,
      products: [],
      meta: null,
      currentPage: this.$route.query.page,
      query: {
        plan: ["Sell"],
        status: ["approved"],
        productStatus: ["approved"],
        collectionId: this.$route.params.id,
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
  methods: {
    goTo(page) {
      if (page === this.query.pagination.page) return;
      this.query.pagination.page = page;
      this._reloadRoute();
    },
    _reloadRoute() {
      this.$router.replace({
        path: `/marketplace/shop/${this.$route.params.slug}/collections/${this.$route.params.id}/`,
        query: {
          page: this.query.pagination.page,
        },
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    async _loadItems() {
      this.isLoading = true;
      const res = await this.$store.dispatch("marketplace/getProductsToSell", {
        ...this.query,
        pagination: {
          ...this.query.pagination,
          page: this.query.pagination.page - 1,
        },
      });
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
    rootUrl(){
      return `/marketplace/shop/${this.$route.params.slug}/products/`
    }
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