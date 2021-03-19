<template>
  <div>
    <AreaLoader v-if="isLoading" />
    <VueTailwindModal
      ref="approveConfirmationModal"
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
        <div class="modal-body p-4 text-center">
          <div>Are you sure you want to {{ confirmationAction === 'approval' ? 'approve' : 'decline' }} this account?</div>
          <div class="mt-4">
            <textarea
              name="notes"
              id="notes"
              cols="30"
              rows="5"
              class="w-full border rounded p-4 outine-none resize-none"
              placeholder="Notes to the user"
            ></textarea>
          </div>
        </div>
        <div class="flex modal-footer justify-between flex-shrink p-4 border-t items-center">
          <button
            type="button"
            class="justify-center items-center focus:outline-none outline-none border px-3 py-2 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
            @click="() => this.$refs.approveConfirmationModal.hide()"
          >Cancel</button>

          <button
            type="button"
            class="shadow-xl border border-white bg-primary px-8 py-2 font-bold rounded text-white hover:bg-primary-lighter"
            @click="approveUser"
          >Yes</button>
        </div>
      </div>
    </VueTailwindModal>
    <div class="my-2 flex justify-between items-center">
      <div class="w-full">
        <button
          type="button"
          href="#"
          @click.prevent="goBack"
          class="text-xs text-blue-500 hover:text-blue-700"
        >
          <font-awesome-icon :icon="['fas', 'arrow-left']" />
          <span class="ml-1">Back</span>
        </button>
        <div class="flex justify-between w-full items-center">
          <h2 class="text-2xl mt-4 font-semibold leading-tight">User: {{user._id}}</h2>
          <TotalProfitCounter :amount="totalEarnings" />
        </div>
      </div>
    </div>
    <div class="border rounded p-8 w-full flex justify-between">
      <div class="flex">
        <div class="mr-16">
          <div class="font-bold">Name</div>
          <div>{{ user.name }}</div>
        </div>
        <div class="mr-16" v-if="user.shopName">
          <div class="font-bold">Shop Name</div>
          <div>
            <a
              :href="`/marketplace/shop/${user.slug}`"
              target="_blank"
              class="text-blue-500 hover:text-blue-700"
              title="Open store in new tab"
              v-tippy="{arrow: true}"
            >
              <span>{{ user.shopName }}</span>
              <font-awesome-icon :icon="['fas', 'external-link-alt']" />
            </a>
          </div>
        </div>
        <div class="mr-16">
          <div class="font-bold">Email Address</div>
          <div>{{ user.email }}</div>
        </div>
        <div class="mr-16" v-if="user.portfolioLink">
          <div class="font-bold">Portfolio</div>
          <a
            :href="user.portfolioLink"
            target="_blank"
            class="portfolio-link text-blue-400"
          >{{ user.portfolioLink }}</a>
        </div>
        <div>
          <div class="font-bold">Status</div>
          <div>
            <span
              class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight text-xs"
            >
              <span
                aria-hidden
                class="absolute inset-0 opacity-50 rounded-full"
                :class="{
                        'bg-green-200':['approved'].includes(user.status),
                        'bg-blue-200': user.status === 'pending',
                        'bg-red-200': user.status === 'declined',
                      }"
              ></span>
              <span class="relative uppercase">{{ user.status }}</span>
            </span>
          </div>
        </div>
      </div>

      <PTButton
        color="primary"
        v-if="user.status === 'pending'"
        class="text-sm"
        @click="showApprovalConfirmationModal('approval')"
      >APPROVE</PTButton>
    </div>

    <div class="p-4 rounded border mt-8 box-border">
      <div class="mt-4">
        <CollectionsTable
          :collections="collections"
          @filter="filterCollection"
          @reload="_loadItems"
        />
      </div>
    </div>
    <div class="p-4 rounded border mt-8 box-border">
      <div class="font-bold collections uppercase">Payouts</div>
      <div class="mt-4">
        <table class="min-w-full leading-normal table-fixed">
          <thead>
            <tr>
              <th
                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left"
              >Requested At</th>
              <th
                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left"
              >Recipient</th>
              <th
                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center"
              >Status</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="!payouts.length">
              <td
                colspan="3"
                class="text-xl text-gray-600 px-5 py-5 border-b border-gray-200 bg-white text-sm text-center"
              >No payout(s).</td>
            </tr>
            <tr v-for="payout in payouts" :key="payout._id">
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-left">
                <div
                  class="text-gray-900 whitespace-no-wrap"
                >{{ formatTimestamp(payout.created_at) }}</div>
              </td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <div>
                  <span class="font-bold">Complete Name:</span>
                  {{ payout.recipient.completeName }}
                </div>
                <div>
                  <span class="font-bold">Mobile Number:</span>
                  {{ payout.recipient.mobileNumber }}
                </div>
                <div>
                  <span class="font-bold">Amount (PHP):</span>
                  {{ payout.amount }}
                </div>
              </td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                <span
                  class="relative inline-block px-3 py-1 font-semibold leading-tight text-xs uppercase text-gray-800 rounded-full"
                  :class="{'bg-red-200': payout.status === 'declined' || payout.status === 'cancelled', 'bg-blue-200': payout.status === 'pending', 'bg-green-200': payout.status === 'paid', 'bg-yellow-200': payout.status === 'processing' }"
                >{{ payout.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import TotalProfitCounter from "@/components/TotalProfitCounter";
import CollectionsTable from "@/components/Admin/CollectionsTable";
import VueTailwindModal from "@/components/VueTailwindModal";

export default {
  layout: "admin_dashboard",
  components: {
    TotalProfitCounter,
    CollectionsTable,
    VueTailwindModal,
  },
  created() {
    if (!this.$route.query.colpage)
      this.$router.replace(
        `/admin/users/${this.$route.params.id}/?colpage=1&status=approved,declined,pending,reviewing`
      );
  },
  async mounted() {
    const { id } = this.$route.params;

    this.user = await this.$store.dispatch("admin/getUserById", id);

    await this._loadItems();

    this.totalEarnings = await this.$store.dispatch(
      "admin/totalEarningsOfUser",
      id
    );

    this.isLoading = false;
  },
  data() {
    return {
      shopifyUrl: process.env.shopifyUrl,
      totalEarnings: 0,
      confirmationAction: null,
      isLoading: true,
      collections: [],
      query: {
        userId: this.$route.params.id,
        plan: ["Buy", "Sell"],
        status: ["draft", "approved", "declined", "pending", "reviewing", "to pay", "printing process", "completed"],
        sorting: {
          field: "created_at",
          order: "DESC",
        },
        pagination: {
          limit: 15,
          page: 0,
        },
      },
      user: {},
      payouts: [],
    };
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    _encodeUri(uri) {
      return encodeURIComponent(uri);
    },
    formatTimestamp(timestamp) {
      return moment(timestamp).format("MMMM Do YYYY, h:mm:ss a");
    },
    showApprovalConfirmationModal(res) {
      this.confirmationAction = res;
      this.$refs.approveConfirmationModal.show();
    },
    async approveUser() {
      this.isLoading = true;
      this.user = await this.$store.dispatch(
        "admin/approveAccount",
        this.user._id
      );
      this.$refs.approveConfirmationModal.hide();
      this.isLoading = false;
    },
    async _loadItems() {
      this.isLoading = true;
      try {
        this.collections = await this.$store.dispatch("admin/getCollections", {
          ...this.query,
          pagination: {
            ...this.query.pagination,
            page: this.query.pagination.page - 1,
          },
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
    _reloadRoute() {
      this.$router.replace({
        path: `/admin/users/${this.$route.params.id}`,
        query: {
          colpage: this.query.pagination.page,
          status: this.query.status.join(","),
        },
      });
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
};
</script>