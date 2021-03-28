<template>
  <div class="sm:px-8 relative">
    <AreaLoader v-if="isLoading" fullscreen />

    <VueTailwindModal
      ref="deleteConfirmationModal"
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
        <div class="modal-body p-4 text-center">Are you sure you want to delete this user?</div>
        <div class="flex modal-footer justify-between flex-shrink p-4 border-t items-center">
          <button
            type="button"
            class="justify-center items-center focus:outline-none outline-none border px-3 py-2 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100"
            @click="hideDeleteConfirmation"
          >No</button>

          <button
            type="button"
            class="shadow-xl border border-white bg-primary px-8 py-2 font-bold rounded text-white hover:bg-primary-lighter"
            @click="deleteUser"
          >Yes</button>
        </div>
      </div>
    </VueTailwindModal>
    <VueTailwindModal ref="userFormModal" width="30%">
      <form @submit.prevent="submitForm">
        <div class="text-xl font-bold mb-2">{{ formData._id ? 'EDIT' : 'ADD NEW' }} USER</div>
        <div class="mb-3 mt-2">
          <label for="name" class="font-bold">Name</label>
          <div>
            <input
              name="name"
              class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
              type="text"
              :class="{ 'border-red-400': errors.has('name'), 'focus:border-gray-600': !errors.has('name') }"
              placeholder="Name"
              v-model="formData.name"
              data-vv-as="Name"
              v-validate="'required'"
            />
          </div>
          <span
            class="text-red-700 text-xs pt-1 font-bold inline-block"
            v-if="errors.has('name')"
          >{{ errors.first('name') }}</span>
        </div>
        <div class="mb-3">
          <label for="email" class="font-bold">Email</label>
          <div>
            <input
              name="email"
              class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
              type="text"
              :class="{ 'border-red-400': errors.has('email'), 'focus:border-gray-600': !errors.has('email') }"
              placeholder="email@example.com"
              v-model="formData.email"
              data-vv-as="Email"
              v-validate="'required|email'"
            />
          </div>
          <span
            class="text-red-700 text-xs pt-1 font-bold inline-block"
            v-if="errors.has('email')"
          >{{ errors.first('email') }}</span>
        </div>
        <div class="mb-3">
          <label for="pass" class="font-bold">Password</label>
          <div>
            <input
              type="password"
              name="pass"
              class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
              :class="{ 'border-red-400': errors.has('pass'), 'focus:border-gray-600': !errors.has('pass') }"
              placeholder="Password"
              v-model="formData.password"
              data-vv-as="Password"
              v-validate="'required|min:6'"
            />
          </div>
          <span
            class="text-red-700 text-xs pt-1 font-bold inline-block"
            v-if="errors.has('pass')"
          >{{ errors.first('pass') }}</span>
        </div>
        <div class="mb-3">
          <label for="pass" class="font-bold">Role</label>
          <div>
            <select
              name="role"
              id="role"
              class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
              :class="{ 'border-red-400': errors.has('pass'), 'focus:border-gray-600': !errors.has('pass') }"
              v-model="formData.role"
              data-vv-as="Role"
              v-validate="'required'"
            >
              <option value="customer">User</option>
              <option value="admin">Admin</option>
              <option value="support">Support</option>
            </select>
          </div>
          <span
            class="text-red-700 text-xs pt-1 font-bold inline-block"
            v-if="errors.has('role')"
          >{{ errors.first('role') }}</span>
        </div>
        <div class="mb-3">
          <button
            class="w-full items-center justify-center focus:outline-none outline-none flex flex-grow border px-3 py-2 font-bold rounded text-white border-white bg-primary hover:bg-primary-lighter"
          >CREATE</button>
        </div>
      </form>
    </VueTailwindModal>
    <div>
      <div class="my-2 flex sm:flex-row justify-between items-center">
        <h2 class="text-2xl font-semibold leading-tight">Users</h2>
        <div class="relative flex">
          <button
            type="button"
            class="px-3 py-2 text-xs hover:bg-gray-200 border rounded font-bold outline-none focus:outline-none mr-2"
            title="Reload"
            v-tippy="{arrow: true}"
            @click="_loadItems"
          >
            <font-awesome-icon :icon="['fas', 'sync']" class="text-xs" />
          </button>
          <button
            type="button"
            class="border px-8 py-2 font-bold rounded outline-none focus:outline-none border-white bg-primary text-white hover:bg-primary-lighter"
            @click="addNewUser"
          >Add New User</button>
        </div>
      </div>
      <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
        <div class="inline-block min-w-full border-l border-r overflow-hidden">
          <table class="min-w-full leading-normal table-fixed">
            <thead>
              <tr>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left"
                >UID</th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left"
                >Email</th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left"
                >Name</th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left"
                >Shop Name</th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left"
                >Status</th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center"
                >Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!users.length">
                <td
                  colspan="5"
                  class="text-xl text-gray-600 px-5 py-5 border-b border-gray-200 bg-white text-sm text-center"
                >No user(s).</td>
              </tr>
              <tr v-for="user in users" :key="user._id">
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <div class="flex flex-wrap">
                    <span
                      class="rounded-full text-xs px-2 mr-1"
                      :class="{
                        'bg-primary text-white': !(['buyer', 'customer'].includes(role.name)),
                        'bg-blue-400 text-white': role.name === 'buyer',
                        'bg-yellow-400 text-body': role.name === 'customer',
                      }"
                      v-for="(role, i) in user.roles"
                      :key="role ? `${user._id}_role_${role._id}` : `${user._id}_role_${i}`"
                    >{{ role ? role.displayName : '' }}</span>
                  </div>
                  <nuxt-link :to="`/admin/users/${user._id}`" class="text-blue-600 hover:underline">
                    <span>{{ user._id }}</span>
                  </nuxt-link>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{{user.email}}</td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{{ user.name }}</td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{{ user.shop ? user.shop.name : '' }}</td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
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
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                  <div>
                    <a
                      class="px-2 py-1 text-xs hover:bg-gray-200 border rounded mx-1"
                      title="Open Store"
                      target="_blank"
                      :href="`/marketplace/shop/${user.shop.slug}`"
                      v-tippy="{arrow: true}"
                      v-if="user.shop && _isSeller(user)"
                    >
                      <font-awesome-icon :icon="['fas', 'shopping-cart']" />
                    </a>
                    <button
                      type="button"
                      class="px-2 py-1 text-xs hover:bg-gray-200 border rounded mx-1"
                      title="Edit"
                      v-tippy="{arrow: true}"
                      @click="editUser(user)"
                    >
                      <font-awesome-icon :icon="['fas', 'edit']" />
                    </button>
                    <button
                      type="button"
                      class="px-2 py-1 text-xs hover:bg-gray-200 border rounded mx-1"
                      title="Delete"
                      v-tippy="{arrow: true}"
                      @click="showDeleteConfirmationModal(user)"
                    >
                      <font-awesome-icon :icon="['fas', 'trash']" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <SimplePagination @prev="goTo(prevPage)" @next="goTo(nextPage)" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import find from "lodash/find";
import VueTailwindModal from "@/components/VueTailwindModal";
import SimplePagination from "@/components/SimplePagination";

export default {
  layout: "admin_dashboard",
  components: {
    VueTailwindModal,
    SimplePagination,
  },
  created() {
    if (!this.$route.query.upage) this.$router.replace("/admin/users/?upage=1");
  },
  data() {
    return {
      isLoading: true,
      formData: {
        email: null,
        name: null,
        password: null,
        role: "customer",
      },
      query: {
        sorting: {
          field: "created_at",
          order: "DESC",
        },
        pagination: {
          limit: 15,
          page: 1,
        },
      },
      selectedUser: null,
    };
  },
  computed: {
    ...mapGetters({
      users: "admin/users",
    }),
    prevPage() {
      const colPage = parseInt(this.$route.query.upage);
      return colPage > 1 ? colPage - 1 : 1;
    },
    nextPage() {
      return parseInt(this.$route.query.upage) + 1;
    },
  },
  watch: {
    "$route.query.upage": {
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
  methods: {
    async showDeleteConfirmationModal(user) {
      this.selectedUser = user;
      this.$refs.deleteConfirmationModal.show();
    },
    hideDeleteConfirmation() {
      this.selectedUser = null;
      this.$refs.deleteConfirmationModal.hide();
    },
    async deleteUser() {
      this.isLoading = true;
      this.$refs.deleteConfirmationModal.hide();
      await this.$store.dispatch("admin/deleteUser", {
        _id: this.selectedUser._id,
      });
      this.$store.dispatch("admin/removeUserById", this.selectedUser._id);
      this.$toast.success("User has been deleted.", {
        position: "top",
      });
      this.isLoading = false;
    },
    addNewUser() {
      this.formData = {
        email: null,
        name: null,
        password: null,
        role: "customer",
      };
      this.$refs.userFormModal.show();
    },
    async submitForm() {
      if (this.formData._id) {
        this.isLoading = true;
        this.$refs.userFormModal.hide();
        await this.$store.dispatch("admin/updateUser", this.formData);
        this.isLoading = false;
        return;
      }
    },
    editUser(user) {
      this.formData = JSON.parse(JSON.stringify(user));
      this.$refs.userFormModal.show();
    },
    goTo(page) {
      if (page === this.query.pagination.page) return;
      this.query.pagination.page = page;
      this._reloadRoute();
    },
    _reloadRoute() {
      this.$router.replace({
        path: "/admin/users/",
        query: {
          upage: this.query.pagination.page,
        },
      });
    },
    async _loadItems() {
      this.isLoading = true;
      try {
        await this.$store.dispatch("admin/getUsers", {
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
    _encodeUri(uri) {
      return encodeURIComponent(uri);
    },
    _isSeller(user) {
      const { roles } = user;
      return find(roles, { name: "seller" }) ? true : false;
    },
  },
};
</script>