<template>
  <div>
    <AreaLoader v-if="isLoading" />
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
          <TotalProfitCounter />
        </div>
      </div>
    </div>
    <div class="border rounded p-8 w-full flex justify-between">
      <div class="flex">
        <div class="mr-16">
          <div class="font-bold">Name</div>
          <div>{{ user.name }}</div>
        </div>
        <div class="mr-16">
          <div class="font-bold">Shop Name</div>
          <div>{{ user.shopName }}</div>
        </div>
        <div class="mr-16">
          <div class="font-bold">Email Address</div>
          <div>{{ user.email }}</div>
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

      <PTButton color="primary" v-if="user.status === 'pending'" class="text-sm">APPROVE</PTButton>
    </div>

    <div class="p-4 rounded border mt-8 box-border">
      <div class="font-bold collections uppercase">Collections</div>
      <div class="mt-4">
        <table class="min-w-full leading-normal table-fixed">
          <thead>
            <tr>
              <th
                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left"
              >Collection Name</th>
              <th
                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center"
              >Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!collections.length">
              <td
                colspan="3"
                class="text-xl text-gray-600 px-5 py-5 border-b border-gray-200 bg-white text-sm text-center"
              >No collection(s).</td>
            </tr>
            <tr v-for="(col, i) in collections" :key="i">
              <td class="px-5 py-5 border-b border-gray-200 text-sm text-center">
                <div class="flex items-center">
                  <div class="ml-3">
                    <p class="text-gray-900 whitespace-no-wrap flex items-center">
                      <span
                        class="relative text-xs inline-block px-3 py-1 font-semibold leading-tight mr-2"
                        :class="{
                          'text-white': col.plan === 'Sell',
                          'text-blue-800': col.plan === 'Buy',
                        }"
                      >
                        <span
                          aria-hidden
                          class="absolute inset-0 rounded-full"
                          :class="{
                            'bg-primary': col.plan === 'Sell',
                            'bg-blue-400': col.plan === 'Buy',
                          }"
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
                    </p>
                  </div>
                </div>
              </td>
              <td class="px-5 py-5 border-b border-gray-200 text-sm text-center">
                <span class="relative inline-block px-3 py-1 font-semibold leading-tight text-xs">
                  <span
                    aria-hidden
                    class="absolute inset-0 rounded-full"
                    :class="{
                    'bg-green-200': col.status === 'approved',
                    'bg-red-300': col.status === 'declined',
                    'bg-blue-200': col.status === 'pending',
                  }"
                  ></span>
                  <span class="relative uppercase font-black">{{ col.status }}</span>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
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

export default {
  layout: "admin_dashboard",
  components: {
    TotalProfitCounter,
  },
  async mounted() {
    // TODO: add api
  },
  data() {
    return {
      isLoading: false,
      collections: [
        {
          plan: "Sell",
          status: "pending",
          name: "Sample",
        },
      ],
      user: {
        _id: "jw5881jJKKWrt",
        name: "Joshua Tundag",
        shopName: "Penshoppe",
        email: "joshuatundag@gmail.com",
        status: "pending",
      },
      payouts: [
        {
          _id: 1,
          user: {
            _id: 1,
            name: "Sample",
          },
          created_at: "Nov 17, 2020",
          recipient: {
            completeName: "Complete Name",
            mobileNumber: "9812371",
            amount: 1234,
          },
          status: "pending",
        },
      ],
    };
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    formatTimestamp(timestamp) {
      return moment(timestamp).format("MMMM Do YYYY, h:mm:ss a");
    },
  },
};
</script>