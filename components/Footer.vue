<template>
  <div class="bg-gray-100 sm:p-8 p-8">
    <div class="container mx-auto sm:p-8">
      <div class="sm:flex mb-4 justify-center">
        <div class="flex flex-grow sm:flex-no-wrap flex-wrap">
          <div class="sm:w-1/4 w-full h-auto">
            <div class="text-primary mb-2">Pages</div>
            <ul class="list-reset leading-normal">
              <li class="hover:text-primary text-grey-darker">
                <nuxt-link to="/">Home</nuxt-link>
              </li>
              <li class="hover:text-primary text-grey-darker">
                <nuxt-link to="/marketplace">Marketplace</nuxt-link>
              </li>
            </ul>
          </div>
          <div class="sm:w-1/4 w-full h-auto sm:mt-0 mt-8">
            <div class="text-primary mb-2">Useful Links</div>
            <ul class="list-reset leading-normal">
              <li class="hover:text-primary text-grey-darker">
                <nuxt-link to="/faqs">FAQs</nuxt-link>
              </li>
              <li class="hover:text-primary text-grey-darker">
                <nuxt-link to="/terms-and-conditions">Terms & Conditions</nuxt-link>
              </li>
              <li class="hover:text-primary text-grey-darker">
                <nuxt-link to="/privacy-policy">Privacy Policy</nuxt-link>
              </li>
            </ul>
          </div>
        </div>
        <div class="sm:w-1/2 w-full sm:mt-0 mt-8 h-auto">
          <div class="flex flex-col items-center sm:items-end">
            <img src="~/assets/images/logo-nav.png" alt="Printree Studio" class="w-28 object-fit" />
            <span class="text-xs mt-1 font-bold text-body">&copy; Copyright {{year}}.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      year: (new Date()).getFullYear()
    };
  },
};
</script>