<template>
  <!-- component -->
  <div class="flex items-start justify-center bg-gray-100 sm:p-6 pb-0 flex-shrink-0 h-full">
    <div class="flex w-full max-w-xs p-4 bg-white">
      <ul class="flex flex-col w-full">
        <li class="my-px">
          <span class="flex font-medium text-sm text-gray-400 px-4 my-4 uppercase">Account</span>
        </li>
        <!-- <li class="my-px">
          <nuxt-link
            to="/marketplace/account/profile"
            class="flex flex-row items-center h-12 px-4 rounded-lg text-gray-600 hover:bg-gray-100"
            active-class="text-primary"
          >
            <span class="flex items-center text-lg text-gray-400 w-6">
              <font-awesome-icon :icon="['fas', 'user']"/>
            </span>
            <span class="ml-3">Profile</span>
          </nuxt-link>
        </li>-->
        <li class="my-px">
          <nuxt-link
            to="/marketplace/account/orders"
            class="flex flex-row items-center h-12 px-4 rounded-lg text-gray-600 hover:bg-gray-100"
            active-class="text-primary"
          >
            <span class="flex items-center text-lg text-gray-400 w-6">
              <font-awesome-icon :icon="['fas', 'shipping-fast']" />
            </span>
            <span class="ml-3">Orders</span>
            <span
              class="flex items-center justify-center text-sm text-gray-500 font-semibold bg-gray-200 h-6 px-2 rounded-full ml-auto"
            >10</span>
          </nuxt-link>
        </li>
        <!-- <li class="my-px">
          <a
            href="#"
            class="flex flex-row items-center h-12 px-4 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <span class="flex items-center text-lg text-gray-400 w-6">
              <font-awesome-icon :icon="['fas', 'bell']"/>
            </span>
            <span class="ml-3">Notifications</span>
            <span
              class="flex items-center justify-center text-sm text-gray-500 font-semibold bg-gray-200 h-6 px-2 rounded-full ml-auto"
            >10</span>
          </a>
        </li>-->
        <li class="my-px">
          <nuxt-link
            to="/marketplace/account/settings"
            class="flex flex-row items-center h-12 px-4 rounded-lg text-gray-600 hover:bg-gray-100"
            active-class="text-primary"
          >
            <span class="flex items-center text-lg text-gray-400 w-6">
              <font-awesome-icon :icon="['fas', 'cog']" />
            </span>
            <span class="ml-3">Settings</span>
          </nuxt-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {};
</script>