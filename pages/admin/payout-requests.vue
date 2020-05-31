<template>
  <div class="relative sm:px-8">
    <AreaLoader v-if="isLoading" />

    <div class="my-2 flex justify-between items-center">
      <h2 class="text-2xl font-semibold leading-tight">Payout</h2>
    </div>
    <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
      <div class="inline-block min-w-full border-l border-r overflow-hidden">
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
              <th
                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center"
              >Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!payouts.length">
              <td
                colspan="3"
                class="text-xl text-gray-600 px-5 py-5 border-b border-gray-200 bg-white text-sm text-center"
              >You have no collection(s).</td>
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
                  {{ payout.name }}
                </div>
                <div>
                  <span class="font-bold">Mobile Number:</span>
                  {{ payout.mobile }}
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
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                <div>
                  <button
                    type="button"
                    class="px-2 py-1 text-xs hover:bg-gray-200 border rounded mx-1"
                    title="Decline Request"
                    v-if="payout.status !== 'cancelled' && payout.status !== 'paid' && payout.status !== 'declined'"
                    v-tippy="{arrow: true}"
                    @click="updatePayoutStatusTo(payout, 'declined')"
                  >
                    <font-awesome-icon :icon="['fas', 'times']" />
                    <span class="ml-1">DECLINE</span>
                  </button>
                  <button
                    type="button"
                    class="px-2 py-1 text-xs hover:bg-gray-200 border rounded mx-1"
                    :title="payout.status === 'processing' ? 'Mark as Paid' : 'Process Payout'"
                    v-tippy="{arrow: true}"
                    v-if="payout.status !== 'paid' && payout.status !== 'cancelled'"
                    @click="processPayout(payout)"
                  >
                    <font-awesome-icon :icon="['fas', 'check']" />
                    <span class="ml-1">
                      {{
                      processBtnTextOf(payout.status)
                      }}
                    </span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'

export default {
  layout: 'admin_dashboard',
  async mounted() {
    await this.$store.dispatch('admin/getPayouts', {})
    this.isLoading = false
  },
  data() {
    return {
      isLoading: true
    }
  },
  computed: {
    ...mapGetters({
      payouts: 'admin/payouts'
    })
  },
  methods: {
    formatTimestamp(timestamp) {
      return moment(timestamp.toDate()).format('MMMM Do YYYY, h:mm:ss a')
    },
    processBtnTextOf(status) {
      let text = 'PROCESS'
      switch (status) {
        case 'processing':
          text = 'PAID'
          break
      }
      return text
    },
    async updatePayoutStatusTo(payout, newStatus) {
      this.isLoading = true
      const res = await this.$store.dispatch('admin/updatePayoutStatusTo', {
        payout,
        status: newStatus
      })
      this.isLoading = false
      if (!res.status) {
        this.$toast.error(res.message || 'Payout processing failed.', {
          position: 'top'
        })
        return
      }
      this.$toast.success('Payout has been updated successfully.', {
        position: 'top'
      })
    },
    processPayout(payout) {
      let newStatus = 'processing'
      switch (payout.status) {
        case 'pending':
          newStatus = 'processing'
          break
        case 'processing':
          newStatus = 'paid'
          break
      }
      this.updatePayoutStatusTo(payout, newStatus)
    }
  }
}
</script>