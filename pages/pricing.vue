<template>
  <div class="sm:w-8/12 mx-auto my-32">
    <div class="flex border-b p-4 font-normal">
      <div class="w-4/12">Plans</div>
      <div class="w-4/12">Free</div>
      <div class="w-4/12">Printree+</div>
    </div>
    <div class="flex border-b px-4 pt-10 pb-4 font-bold items-start">
      <div class="w-4/12 flex items-center font-normal"></div>
      <div class="w-4/12">
        <div>
          <div class="price">
            <span class="text-4xl font-bold">FREE</span>
          </div>
        </div>
      </div>
      <div class="w-4/12 pb-4">
        <div>
          <div class="price">
            <span class="text-4xl font-bold">₱ 399</span>
            <span class="font-normal">/mo</span>
            <div class="mt-4" v-if="isLoggedIn">
              <PTButton v-if="userTypeIs('seller')" :color="hasRequested ? 'default' : 'primary'" @click="sendUpgradeRequest">
                {{ hasRequested ? "REQUESTED" : "REQUEST UPGRADE" }}
                <font-awesome-icon v-if="hasRequested" :icon="['fas', 'check-circle']" />
              </PTButton>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-4 bg-gray-100 font-bold border-b">FEATURES</div>
    <div class="flex border-b p-4">
      <div class="w-4/12">Customized store Logo</div>
      <div class="w-4/12">
        <font-awesome-icon class="text-red-400" :icon="['fas', 'times-circle']" />
      </div>
      <div class="w-4/12">
        <font-awesome-icon class="text-green-400" :icon="['fas', 'check-circle']" />
      </div>
    </div>
    <div class="flex border-b p-4">
      <div class="w-4/12 pr-4">Product label without the printree logo</div>
      <div class="w-4/12">
        <font-awesome-icon class="text-red-400" :icon="['fas', 'times-circle']" />
      </div>
      <div class="w-4/12">
        <font-awesome-icon class="text-green-400" :icon="['fas', 'check-circle']" />
      </div>
    </div>
    <div class="flex border-b p-4">
      <div class="w-4/12">Featured posts</div>
      <div class="w-4/12">1 time only</div>
      <div class="w-4/12">3 times per week</div>
    </div>
    <div class="flex border-b p-4">
      <div class="w-4/12 pr-4">Featured products in the homepage</div>
      <div class="w-4/12">
        <font-awesome-icon class="text-red-400" :icon="['fas', 'times-circle']" />
      </div>
      <div class="w-4/12">3 times per week</div>
    </div>
    <div class="flex border-b p-4">
      <div class="w-4/12">Fast design approval</div>
      <div class="w-4/12">
        <font-awesome-icon class="text-red-400" :icon="['fas', 'times-circle']" />
      </div>
      <div class="w-4/12">
        <font-awesome-icon class="text-green-400" :icon="['fas', 'check-circle']" />
      </div>
    </div>
    <div class="flex border-b p-4">
      <div class="w-4/12">Service Fee</div>
      <div class="w-4/12">
        12%
      </div>
      <div class="w-4/12">
        5%
      </div>
    </div>
  </div>
</template>

<script>
import UserTypeChecker from '@/components/Mixins/UserTypeChecker'
import { mapGetters } from 'vuex'

export default {
  mixins: [UserTypeChecker],
  data() {
    return {
      hasRequested: false,
    };
  },
  methods: {
    sendUpgradeRequest() {
      if (this.hasRequested) return false;
      this.hasRequested = true;
    },
  },
  computed: {
    ...mapGetters({
      isLoggedIn: "isLoggedIn",
      user: "user",
    })
  }
};
</script>