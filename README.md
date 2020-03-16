# printree-studio

> Printree Studio

## Build Setup

``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

## VueTailwindAccordion Sample

``` html
<VueTailwindAccordion
  :tabs="[{title: 'Product Metadata', template: 'product_metadata', isOpened: true}]">
  <template v-slot:product_metadata>
    <div class="flex p-4">
      <form class="w-full">
        <div class="mb-3">
          <label for="product_name" class="font-bold">Product Name</label>
          <div class="mt-2">
            <input name="product_name"
              class="w-full py-2 px-3 border rounded focus:outline-none outline-none"
              type="text"
              :class="{ 'border-red-400': errors.has('product_name'), 'focus:border-gray-600': !errors.has('name') }"
              placeholder="Product Name"
              data-vv-as="Product Name"
              v-validate="'required'"/>
          </div>
          <span class="text-red-700 text-xs pt-1 font-bold inline-block"
            v-if="errors.has('product_name')">
            {{ errors.first('product_name') }}
          </span>
        </div>
        <div>
          <label for="product_description" class="font-bold">Product Description</label>
          <div>
            <WrappedEditor/>
          </div>
          <span class="text-red-700 text-xs pt-1 font-bold inline-block"
            v-if="errors.has('product_description')">
            {{ errors.first('product_description') }}
          </span>
        </div>
      </form>
    </div>
  </template>
</VueTailwindAccordion>
```