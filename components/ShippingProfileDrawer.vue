<template>
  <VueTailwindDrawer
    ref="drawer"
    :closeOnBackdropClicked="false"
    position="right"
    width="60%"
    @hide="$emit('hide')"
  >
    <div class="h-full flex flex-col relative">
      <AreaLoader v-if="isLoading" />
      <div class="flex border-b p-4 items-center">
        <button
          type="button"
          class="px-3 py-2 text-xs hover:bg-gray-200 border rounded font-bold outline-none focus:outline-none mr-2"
          @click="hide"
        >
          <font-awesome-icon :icon="['fas', 'arrow-left']" class="text-xs" />
        </button>
        <span class="font-bold">{{ mode === 'create' ? "ADD" : "EDIT" }} SHIPPING PROFILE</span>
      </div>
      <div class="flex flex-grow p-4 overflow-auto">
        <div class="h-full w-full">
          <div class="mb-3 w-full mr-3" key="profileName">
            <label for="profileName" class="font-bold">Profile Name</label>
            <div class="mt-2">
              <input
                name="profileName"
                class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                type="text"
                :class="{ 'border-red-400': errors.has('profileName'), 'focus:border-gray-600': !errors.has('profileName') }"
                placeholder="Fragile Products Profile"
                v-model="formData.name"
                data-vv-as="Profile Name"
                v-validate="'required'"
              />
            </div>
            <span
              class="text-red-700 text-xs pt-1 font-bold inline-block"
              v-if="errors.has('profileName')"
            >{{ errors.first('profileName') }}</span>
          </div>

          <hr class="my-4" />

          <div class="mb-4 flex justify-between items-center">
            <span class="font-bold">Shipping Zones</span>

            <button
              type="button"
              class="px-3 py-2 text-xs hover:bg-gray-200 border rounded font-bold outline-none focus:outline-none"
              @click="createNewZone"
            >
              <font-awesome-icon :icon="['fas', 'plus']" class="text-xs mr-1" />
              <span>Create Zone</span>
            </button>
          </div>
          <!-- Start Repeater -->
          <div
            class="p-4 border rounded border-dashed border-gray-500 mb-4"
            v-for="(zone, i) in formData.zones"
            :key="`zone_${i}`"
          >
            <div class="mb-3 w-full mr-3">
              <label for="zoneName" class="font-bold">Zone Name</label>
              <div class="mt-2">
                <input
                  name="zoneName"
                  class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                  type="text"
                  :class="{ 'border-red-400': errors.has('zoneName'), 'focus:border-gray-600': !errors.has('zoneName') }"
                  placeholder="Region/Distance/Location"
                  v-model="zone.name"
                  data-vv-as="Zone Name"
                  v-validate="'required'"
                />
              </div>
              <span
                class="text-red-700 text-xs pt-1 font-bold inline-block"
                v-if="errors.has('zoneName')"
              >{{ errors.first('zoneName') }}</span>
            </div>
            <div class="mb-3 w-full mr-3">
              <span class="font-bold">Regions</span>
              <div class="mt-2">
                <multiselect
                  :options="remainingSelectableProvinces"
                  :multiple="true"
                  v-model="zone.provinces"
                  :close-on-select="false"
                  :preserve-search="true"
                  label="name"
                  track-by="value"
                ></multiselect>
              </div>
            </div>

            <div class="mb-3 w-full mr-3">
              <div class="flex justify-between items-center">
                <span class="font-bold">Rates</span>
                <button
                  type="button"
                  class="px-3 py-2 text-xs hover:bg-gray-200 border rounded font-bold outline-none focus:outline-none"
                  @click="createNewRateFor(i)"
                >
                  <font-awesome-icon :icon="['fas', 'plus']" class="text-xs mr-1" />
                  <span>Create Rate</span>
                </button>
              </div>

              <div class="mt-2" v-for="(rate, ri) in zone.rates" :key="`rate_${ri}`">
                <div class="flex p-4 border border-gray-500 border-dashed rounded">
                  <div class="w-4/12 mr-2">
                    <div class="font-bold mb-2">Rate Name</div>
                    <input
                      class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                      type="text"
                      placeholder="Rate Name"
                      v-model="rate.name"
                    />
                  </div>
                  <div class="w-4/12 mx-2">
                    <div class="font-bold mb-2">Weight Range (in Grams)</div>
                    <div class="flex">
                      <input
                        class="w-full py-2 px-3 border rounded focus:outline-none outline-none mr-1"
                        type="number"
                        placeholder="Minimum Weight"
                        v-model.number="rate.minWeight"
                      />
                      <input
                        class="w-full py-2 px-3 border rounded focus:outline-none outline-none ml-1"
                        type="number"
                        placeholder="Maximum Weight"
                        v-model.number="rate.maxWeight"
                      />
                    </div>
                  </div>
                  <div class="w-4/12 ml-2">
                    <div class="font-bold mb-2">Price</div>
                    <input
                      class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
                      type="number"
                      placeholder="Price"
                      v-model.number="rate.price"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end p-4 border-t">
        <PTButton color="primary" @click="saveProfile">
          <span class="mr-2">Save</span>
        </PTButton>
      </div>
    </div>
  </VueTailwindDrawer>
</template>

<script>
import VueTailwindDrawer from "@/components/VueTailwindDrawer";
import "vue-multiselect/dist/vue-multiselect.min.css";
import Multiselect from "vue-multiselect";
import map from "lodash/map";
import flatten from "lodash/flatten";
import filter from "lodash/filter";
import includes from "lodash/includes";

export default {
  props: {
    mode: {
      default: "create",
    },
    profile: {
      required: false,
    },
  },
  components: {
    VueTailwindDrawer,
    Multiselect,
  },
  async mounted() {
    this.isLoading = false;
  },
  data() {
    return {
      isLoading: true,
      rateBoilerplate: {
        minWeight: 0,
        maxWeight: 0,
        price: 0,
      },
      zoneBoilerplate: {
        name: null,
        rates: [],
        provinces: [],
      },
      formData: {
        name: null,
        zones: [],
      },
    };
  },
  methods: {
    async createNewZone() {
      this.formData.zones.unshift(
        JSON.parse(JSON.stringify(this.zoneBoilerplate))
      );
    },
    async createNewRateFor(index) {
      this.formData.zones[index].rates.push(
        JSON.parse(JSON.stringify(this.rateBoilerplate))
      );
    },
    show(profile) {
      if (profile)
        this.formData = {
          ...profile,
          zones: map(profile.zones, (zone) => {
            return {
              ...zone,
              provinces: map(zone.provinces, (province) => {
                if (typeof province === "string") {
                  const provinceObj = this.$locations.findProvince(province);
                  return {
                    name: provinceObj.provDesc,
                    value: province,
                  };
                }
                return province;
              }),
            };
          }),
        };
      this.$refs.drawer.show();
    },
    hide() {
      this.formData = {
        name: null,
        zones: [],
      };
      this.$refs.drawer.hide();
    },
    async saveProfile() {
      let res = await this.$validator.validateAll()
      if (this.isLoading) return
      if(!res){
        this.$toast.error('Please fix the errors below.', { position: 'top'})
        return
      }
      this.isLoading = true;
      const profile = await this.$store.dispatch("admin/saveShippingProfile", {
        ...this.formData,
        zones: map(this.formData.zones, (zone) => ({
          ...zone,
          provinces: map(zone.provinces, "value"),
        })),
      });

      this.$emit("save", profile);

      this.hide();
      this.isLoading = false;
    },
  },
  computed: {
    remainingSelectableProvinces() {
      const usedProvinces = map(
        flatten(map(this.formData.zones, "provinces")),
        "value"
      );
      const selectableProvinces = filter(
        this.$locations.provinces,
        (province) => !includes(usedProvinces, province.provCode)
      );

      return map(selectableProvinces, (p) => ({
        name: p.provDesc,
        value: p.provCode,
      }));
    },
  },
};
</script>