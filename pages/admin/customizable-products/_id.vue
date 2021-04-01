<template>
  <div class="my-2 flex justify-between items-center relative">
    <AreaLoader v-if="isLoading" fullscreen />
    <div class="w-full">
      <button
        type="button"
        href="#"
        @click.prevent="$router.back"
        class="text-xs text-blue-500 hover:text-blue-700"
      >
        <font-awesome-icon :icon="['fas', 'arrow-left']" />
        <span class="ml-1">Back</span>
      </button>

      <div class="min-h-area-loader mt-8">
        <h2 class="text-xl font-bold leading-tight mb-2">Name</h2>
        <div class="mb-4 flex sm:flex-row justify-between items-center">
          <input
            type="text"
            class="font-bold outline-none border rounded px-4 py-2"
            placeholder="Product Name*"
            v-model="product.name"
          />
        </div>

        <div>
          <h2 class="text-xl font-bold leading-tight mb-2">Variants</h2>

          <div
            v-for="variant in product.customizableVariants"
            :key="variant._id"
            class="mb-4 p-4 border rounded"
          >
            <div class="font-semibold mb-2 flex">
              <span>Color:</span>
              <span
                class="w-5 h-5 rounded-full cursor-pointer border border-gray-600 flex justify-center items-center relative ml-2"
                :style="{ 'background-color': variant.color, }"
              />
            </div>

            <div>
              <div class="font-semibold mb-2">Sizes</div>

              <table class="min-w-full leading-normal table-fixed">
                <thead>
                  <tr>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left"
                    >Name</th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left"
                    >Base Cost</th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left"
                    >Weight (In Grams)</th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left"
                    >Service Cost</th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left"
                    >Stocks</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(size, i) in variant.sizes" :key="`size_${i}`">
                    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{{ size.name }}</td>
                    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      ₱
                      <VueNumericInput
                        align="center"
                        style="height: 30px"
                        :min="0"
                        v-model="size.baseCost"
                      />
                    </td>
                    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <VueNumericInput
                        align="center"
                        style="height: 30px"
                        :min="0"
                        v-model="size.weightInGrams"
                      />g
                    </td>
                    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      ₱
                      <VueNumericInput
                        align="center"
                        style="height: 30px"
                        :min="0"
                        v-model="size.serviceCost"
                      />
                    </td>
                    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <VueNumericInput
                        align="center"
                        style="height: 30px"
                        :min="0"
                        v-model="size.stock"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="fixed bottom-0 left-0 w-full py-4 px-24 text-right border-t bg-white">
          <PTButton color="primary" @click="saveChanges">Save Changes</PTButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import first from "lodash/first";
import map from "lodash/map";
import omit from "lodash/omit";
import VueNumericInput from "@/components/VueNumericInput";

export default {
  layout: "admin_dashboard",
  components: {
    VueNumericInput,
  },
  async mounted() {
    const res = await this.$store.dispatch(
      "designer/fetchAvailableProducts",
      this.query
    );
    if (!first(res)) return;

    this.product = JSON.parse(JSON.stringify(first(res)));
    this.isLoading = false;
  },
  data() {
    return {
      isLoading: true,
      product: {},
      query: {
        id: this.$route.params.id,
      },
    };
  },
  methods: {
    async saveChanges() {
      this.isLoading = true;
      const product = omit(this.product, [
        "category",
        "printingOptions",
        "created_at",
        "updated_at",
      ]);
      product.customizableVariants = map(product.customizableVariants, (v) =>
        omit(v, "printableArea")
      );

      this.product = await this.$store.dispatch(
        "admin/updateCustomizableProduct",
        product
      );

      this.$toast.success("Product has been updated!", {
        position: "top",
      });

      this.isLoading = false;
    },
  },
};
</script>