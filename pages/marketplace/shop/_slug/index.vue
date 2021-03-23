<template>
  <div>
    <AreaLoader v-if="isLoading" />
    <ShopBanner :src="shopBanner" v-if="shopBanner"/>
    <div class="container mx-auto mt-12" :class="{'mt-12': shopBanner, 'mt-32': !shopBanner}">
      <div class="text-center text-3xl my-48" v-if="!products.length">
        No available products yet.
      </div>
      <ProductsGrid :rootUrl="rootUrl" :products="products" />
      <div class="flex flex-grow justify-center pb-6 mt-4" v-if="products.length >= query.pagination.limit">
        <SimplePagination @prev="goTo(prev)" @next="goTo(next)" />
      </div>
    </div>
  </div>
</template>

<script>
import ShopBanner from "@/components/marketplace/ShopBanner";
import ProductsGrid from "@/components/ProductsGrid";
import SimplePagination from "@/components/SimplePagination";
import { mapGetters } from 'vuex'

export default {
  layout: "shop",
  components: {
    ShopBanner,
    ProductsGrid,
    SimplePagination,
  },
  created() {
    const page = this.$route.query.page;
    if (page === undefined)
      return this.$router.replace(
        `/marketplace/shop/${this.$route.params.slug}/?page=1`
      );
    this.currentPage = parseInt(page);
  },
  async mounted() {
    this._loadItems();
  },
  data() {
    return {
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
          limit: 15,
          page: 1,
        },
        shop: this.$route.params.slug,
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
        path: `/marketplace/shop/${this.$route.params.slug}`,
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
    ...mapGetters({
      shopConfig: "shop/shopConfig",
    }),
    next() {
      return parseInt(this.$route.query.page) + 1;
    },
    prev() {
      const page = parseInt(this.$route.query.page);
      return page > 1 ? page - 1 : 1;
    },
    rootUrl(){
      return `/marketplace/shop/${this.$route.params.slug}/products/`
    },
    shopBanner() {
      return this.shopConfig?.banner;
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