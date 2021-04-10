<template>
  <div class="relative">
    <AreaLoader v-if="isLoading" />
    <VueTailwindModal
      ref="requestPayoutModal"
      width="30%"
      content-class="rounded-none shadow-none text-gray-600"
      :backdrop="false"
    >
      <div class="flex flex-col h-full">
        <div class="modal-heading border-b w-full p-4">
          <div class="flex justify-between w-full items-center">
            <div class="flex uppercase">
              <strong>REQUEST PAYOUT</strong>
            </div>
          </div>
        </div>
        <div class="flex modal-body flex-col flex-grow p-4">
          <div class="mb-3">
            <label for="complete_name" class="font-bold mr-4 mt-2">Complete Name</label>
            <div>
              <input
                name="complete_name"
                class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                type="text"
                :class="{ 'border-red-400': errors.has('recipientForm.complete_name'), 'focus:border-gray-600': !errors.has('recipientForm.complete_name') }"
                placeholder="Your Complete Name"
                v-model="recipientData.completeName"
                data-vv-as="Complete Name"
                v-validate="'required'"
                data-vv-scope="recipientForm"
              />
            </div>
            <span
              class="text-red-700 text-xs pt-1 font-bold inline-block"
              v-if="errors.has('recipientForm.complete_name')"
            >{{ errors.first('recipientForm.complete_name') }}</span>
          </div>
          <div class="mb-3">
            <label for="mobile_number" class="font-bold mr-4 mt-2">GCash Number</label>
            <div>
              <input
                name="mobile_number"
                class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                type="text"
                :class="{ 'border-red-400': errors.has('recipientForm.mobile_number'), 'focus:border-gray-600': !errors.has('recipientForm.mobile_number') }"
                placeholder="Your GCash Number"
                v-model="recipientData.mobileNumber"
                data-vv-as="GCash Number"
                v-validate="'required|numeric'"
                data-vv-scope="recipientForm"
              />
            </div>
            <span
              class="text-red-700 text-xs pt-1 font-bold inline-block"
              v-if="errors.has('recipientForm.mobile_number')"
            >{{ errors.first('recipientForm.mobile_number') }}</span>
          </div>
          <div>
            <label for="amount" class="font-bold mr-4 mt-2">Amount (PHP)</label>
            <div>
              <input
                name="amount"
                class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                type="number"
                :class="{ 'border-red-400': errors.has('recipientForm.amount'), 'focus:border-gray-600': !errors.has('recipientForm.amount') }"
                placeholder="Your Amount"
                v-model.number="recipientData.amount"
                data-vv-as="Amount"
                v-validate="`required|numeric|min_value:0|max_value:${computedTotalProfit}`"
                data-vv-scope="recipientForm"
                :disabled="this.editingPayout"
              />
            </div>
            <span
              class="text-red-700 text-xs pt-1 font-bold inline-block"
              v-if="errors.has('recipientForm.amount')"
            >{{ errors.first('recipientForm.amount') }}</span>
          </div>
        </div>
        <div class="flex modal-footer justify-between flex-shrink p-4 border-t items-center">
          <PTButton color="default" @click="cancelRequest">CANCEL</PTButton>
          <PTButton color="primary" @click="sendRequest">REQUEST</PTButton>
        </div>
      </div>
    </VueTailwindModal>
    <VueTailwindModal
      ref="requestPayoutConfirmationModal"
      width="30%"
      content-class="rounded-none shadow-none text-gray-600"
      :backdrop="false"
    >
      <div class="flex flex-col relative">
        <AreaLoader v-if="isConfirmationLoading" />
        <div class="modal-heading border-b w-full p-4">
          <div class="flex justify-center w-full items-center">
            <div class="flex uppercase">
              <strong>CONFIRM PAYOUT REQUEST</strong>
            </div>
          </div>
        </div>
        <div class="flex modal-body flex-col flex-grow p-4">
          <div>
            <span class="font-bold">Complete Name:</span>
            {{ recipientData.completeName }}
          </div>
          <div>
            <span class="font-bold">GCash Number:</span>
            {{ recipientData.mobileNumber }}
          </div>
          <div>
            <span class="font-bold">Amount (PHP):</span>
            {{ recipientData.amount }}
          </div>
        </div>
        <div
          class="flex modal-footer justify-between flex-shrink p-4 border-t items-celex modal-footer justify-center flex-shrink p-4 border-t nter"
        >
          <PTButton @click="cancelPayoutConfirmation">CANCEL</PTButton>
          <PTButton color="primary" @click="confirmPayoutRequest">CONFIRM</PTButton>
        </div>
      </div>
    </VueTailwindModal>
    <VueTailwindModal
      ref="payoutCancellationModal"
      width="30%"
      content-class="rounded-none shadow-none text-gray-600"
      :backdrop="false"
    >
      <div class="flex flex-col relative">
        <AreaLoader v-if="isConfirmationLoading" />
        <div class="modal-heading border-b w-full p-4">
          <div class="flex justify-center w-full items-center">
            <div class="flex uppercase">
              <strong>CONFIRM PAYOUT CANCELLATION</strong>
            </div>
          </div>
        </div>
        <div
          class="flex modal-body flex-col flex-grow p-4"
        >Are you sure that you want to cancel this request?</div>
        <div
          class="flex modal-footer justify-between flex-shrink p-4 border-t items-celex modal-footer justify-center flex-shrink p-4 border-t nter"
        >
          <PTButton @click="cancelCancellationConfirmation">NO</PTButton>
          <PTButton color="primary" @click="cancelPayoutRequest">YES</PTButton>
        </div>
      </div>
    </VueTailwindModal>
    <div class="my-2 flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-semibold leading-tight">Payout</h2>
      </div>
      <PTButton color="primary" @click="showRequestPayoutModal">
        <span class="mr-2">
          <font-awesome-icon :icon="['fas', 'plus']" />
        </span>
        <span>Request Payout</span>
      </PTButton>
    </div>
    <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
      <div class="inline-block min-w-full border-l border-r overflow-auto w-full">
        <table class="min-w-full leading-normal table-fixed overflow-auto">
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
                colspan="4"
                class="text-xl text-gray-600 px-5 py-5 border-b border-gray-200 bg-white text-sm text-center"
              >You have no payout(s).</td>
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
                  <span class="font-bold">GCash Number:</span>
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
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                <div v-if="payout.status === 'pending'">
                  <button
                    type="button"
                    class="px-2 py-1 text-xs hover:bg-gray-200 border rounded mx-1"
                    title="Cancel Request"
                    v-tippy="{arrow: true}"
                    @click="showCancellationConfirmation(payout)"
                  >
                    <font-awesome-icon :icon="['fas', 'times']" />
                    <span class="ml-1">CANCEL</span>
                  </button>
                  <button
                    type="button"
                    class="px-2 py-1 text-xs hover:bg-gray-200 border rounded mx-1"
                    title="Edit Recipient"
                    v-tippy="{arrow: true}"
                    @click="showEditPayout(payout)"
                  >
                    <font-awesome-icon :icon="['fas', 'edit']" />
                    <span class="ml-1">EDIT</span>
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
import { mapGetters } from "vuex";
import moment from "moment";
import VueTailwindModal from "@/components/VueTailwindModal";
import omit from "lodash/omit";

export default {
  layout: "user_dashboard",
  components: {
    VueTailwindModal,
  },
  async mounted() {
    await this.$store.dispatch("user_dashboard/payoutsOfCurrentUser", {});
    this.isLoading = false;
  },
  data() {
    return {
      isLoading: true,
      isConfirmationLoading: false,
      editingPayout: null,
      recipientData: {
        _id: null,
        completeName: null,
        mobileNumber: null,
        amount: 0,
        channel: "gcash",
      },
    };
  },
  computed: {
    ...mapGetters({
      payouts: "user_dashboard/payouts",
      user: "user",
      totalProfit: "user_dashboard/totalProfit",
    }),
    computedTotalProfit() {
      if (this.editingPayout && this.editingPayout._id) {
        return this.totalProfit + this.editingPayout.amount;
      }
      return this.totalProfit;
    },
  },
  methods: {
    showRequestPayoutModal() {
      this.recipientData = {
        _id: null,
        completeName: null,
        mobileNumber: null,
        amount: 0,
        channel: "gcash",
      };
      this.$refs.requestPayoutModal.show();
    },
    cancelRequest() {
      this.$refs.requestPayoutModal.hide();
      this.$nextTick(() => {
        this.editingPayout = null;
        this.recipientData = {
          _id: null,
          completeName: null,
          mobileNumber: null,
          amount: 0,
          channel: "gcash",
        };
      });
    },
    async sendRequest() {
      const validation = await this.$validator.validateAll("recipientForm");
      if (!validation) return;
      this.$refs.requestPayoutModal.hide();
      this.$refs.requestPayoutConfirmationModal.show();
    },
    cancelPayoutConfirmation() {
      this.$refs.requestPayoutConfirmationModal.hide();
      this.$refs.requestPayoutModal.show();
    },
    formatTimestamp(timestamp) {
      if (!timestamp) return;
      return moment(timestamp).format("MMMM Do YYYY, h:mm:ss a");
    },
    async confirmPayoutRequest() {
      if (this.isConfirmationLoading) return;
      this.isConfirmationLoading = true;
      let res = null;
      if (this.recipientData._id) {
        res = await this.$store.dispatch(
          "user_dashboard/editPayoutRequest",
          this.recipientData
        );
      } else {
        res = await this.$store.dispatch(
          "user_dashboard/payoutRequest",
          omit(this.recipientData, "_id")
        );
      }
      this.isConfirmationLoading = false;
      this.editingPayout = null;
      this.$refs.requestPayoutConfirmationModal.hide();
      this.$toast.success("Your payout request has been sent successfully.", {
        position: "top",
      });
    },
    showEditPayout(payout) {
      const formattedPayout = {
        _id: payout._id,
        completeName: payout.recipient.completeName,
        mobileNumber: payout.recipient.mobileNumber,
        amount: payout.amount,
        channel: "gcash",
      };
      this.editingPayout = formattedPayout;
      this.recipientData = formattedPayout;
      this.$refs.requestPayoutModal.show();
    },
    cancelCancellationConfirmation() {
      this.$validator.reset();
      this.$refs.payoutCancellationModal.hide();
      this.$nextTick(() => {
        this.recipientData = {
          _id: null,
          completeName: null,
          mobileNumber: null,
          amount: 0,
        };
      });
    },
    showCancellationConfirmation(payout) {
      this.recipientData = payout;
      this.$refs.payoutCancellationModal.show();
    },
    async cancelPayoutRequest() {
      if (this.isConfirmationLoading) return;
      this.isConfirmationLoading = true;
      const res = await this.$store.dispatch(
        "user_dashboard/cancelPayoutRequest",
        this.recipientData._id
      );
      this.isConfirmationLoading = false;
      if (!res) {
        this.$toast.error(
          res.message ||
            "Your payout cancellation has failed. Please try again.",
          {
            position: "top",
          }
        );
        return;
      }
      this.recipientData = {
        _id: null,
        completeName: null,
        mobileNumber: null,
        amount: 0,
      };
      this.$refs.payoutCancellationModal.hide();
      this.$toast.success(
        "Your payout request has been cancelled successfully.",
        {
          position: "top",
        }
      );
    },
  },
};
</script>