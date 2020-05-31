<template>
  <div class="sm:px-8 relative">
    <AreaLoader v-if="isLoading"/>
    <VueTailwindModal ref="userFormModal" width="30%">
      <form @submit.prevent="submitForm">
        <div class="text-xl font-bold mb-2">{{ formData.uid ? 'EDIT' : 'ADD NEW' }} USER</div>
        <div class="mb-3 mt-2">
          <label for="name" class="font-bold">Name</label>
          <div>
            <input
              name="name"
              class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
              type="text"
              :class="{ 'border-red-400': errors.has('name'), 'focus:border-gray-600': !errors.has('name') }"
              placeholder="Name"
              v-model="formData.displayName"
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
        <button
          type="button"
          class="border px-8 py-2 font-bold rounded outline-none focus:outline-none border-white bg-primary text-white hover:bg-primary-lighter"
          @click="addNewUser"
        >Add New User</button>
      </div>
      <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
        <div class="inline-block min-w-full border-l border-r overflow-hidden">
          <table class="min-w-full leading-normal table-fixed">
            <thead>
              <tr>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center"
                >UID</th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center"
                >Email</th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center"
                >Display Name</th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center"
                >Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user._id">
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                  <div class="flex items-center justify-center">
                    <div class="ml-3">
                      <p class="text-gray-900 whitespace-no-wrap text-center">
                        <a href="#" class="text-blue-600 hover:underline">
                          <span>{{ user.uid }}</span>
                        </a>
                      </p>
                    </div>
                  </div>
                </td>
                <td
                  class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center"
                >{{user.email}}</td>
                <td
                  class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center"
                >{{ user.displayName }}</td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                  <div>
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
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VueTailwindModal from '@/components/VueTailwindModal'

export default {
  layout: 'admin_dashboard',
  components: {
    VueTailwindModal
  },
  async mounted() {
    try {
      await this.$store.dispatch('admin/getUsers')
      this.isLoading = false
    } catch (error) {}
  },
  data() {
    return {
      isLoading: true,
      formData: {
        email: null,
        displayName: null,
        password: null,
        role: 'customer'
      }
    }
  },
  computed: {
    ...mapGetters({
      users: 'admin/users'
    })
  },
  methods: {
    addNewUser() {
      this.formData = {
        email: null,
        displayName: null,
        password: null,
        role: 'customer'
      }
      this.$refs.userFormModal.show()
    },
    async submitForm() {
      if(this.formData.uid){
        this.isLoading = true
        this.$refs.userFormModal.hide()
        await this.$store.dispatch('admin/updateUser', this.formData)
        this.isLoading = false
        return
      }
    },
    editUser(user) {
      this.formData = JSON.parse(JSON.stringify(user))
      this.$refs.userFormModal.show()
    }
  }
}
</script>