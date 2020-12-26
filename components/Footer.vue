<template>
  <div class="bg-gray-100 p-8">
    <div class="container mx-auto p-8">
      <div class="sm:flex mb-4 justify-center">
        <div class="flex flex-grow">
          <div class="sm:w-1/4 h-auto">
            <div class="text-primary mb-2">Pages</div>
            <ul class="list-reset leading-normal">
              <li class="hover:text-primary text-grey-darker">
                <nuxt-link to="/">Home</nuxt-link>
              </li>
              <li class="hover:text-primary text-grey-darker">
                <a
                  :href="shopifyUrl"
                  target="_blank"
                  class="hover:text-primary-lighter mr-4"
                >Marketplace</a>
              </li>
            </ul>
          </div>
          <div class="sm:w-1/4 h-auto sm:mt-0 mt-8">
            <div class="text-primary mb-2">Useful Links</div>
            <ul class="list-reset leading-normal">
              <li class="hover:text-primary text-grey-darker">
                <nuxt-link to="/faqs">FAQs</nuxt-link>
              </li>
              <li class="hover:text-primary text-grey-darker">
                <nuxt-link to="/terms-of-service">Terms of Service</nuxt-link>
              </li>
              <li class="hover:text-primary text-grey-darker">
                <nuxt-link to="/privacy-policy">Privacy Policy</nuxt-link>
              </li>
            </ul>
          </div>
        </div>
        <div class="sm:w-1/2 sm:mt-0 mt-8 h-auto">
          <div class="flex flex-col items-end">
            <img src="~/assets/images/logo-nav.png" alt="Printree Studio" class="w-28 object-fit" />
            <span class="text-xs mt-1 font-bold text-body">&copy; Copyright 2020.</span>
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
      shopifyUrl: process.env.shopifyUrl,
    };
  },
};
</script>