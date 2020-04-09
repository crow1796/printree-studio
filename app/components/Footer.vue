<template>
  <div class="bg-gray-100 p-8">
    <div class="container mx-auto p-8">
      <div class="sm:flex mb-4 justify-center">
        <div class="flex flex-grow">
          <div class="sm:w-1/4 h-auto">
            <div class="text-primary mb-2">Pages</div>
            <ul class="list-reset leading-normal">
              <li class="hover:text-primary text-grey-darker">
                <nuxt-link to="/marketplace">Marketplace</nuxt-link>
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
          <div class="text-red-light mb-2">Newsletter</div>
          <p
            class="text-grey-darker leading-normal"
          >Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi, consectetur.</p>
          <div class="mt-4 flex">
            <input
              type="text"
              class="p-2 border border-grey-light round text-grey-dark text-sm h-auto"
              placeholder="Your email address"
            />
            <button class="bg-primary text-white rounded-sm h-auto text-xs p-3">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>