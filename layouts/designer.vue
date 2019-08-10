<template>
  <no-ssr>
    <div class="w-full h-full flex flex-col text-sm">
      <div class="w-full p-4 flex border-b">
        <div class="flex w-1/3">
          <img src="~/assets/images/logo-nav.png"
            alt="Printree"
            class="w-10">
        </div>
        <div class="flex w-1/3 justify-center items-center font-bold">
          <span class="text-gray-600 uppercase">
            Designer
          </span>
        </div>
        <div class="flex w-1/3 items-center justify-end">
          <a href="#"
            class="text-blue-400"
            @click.prevent="exportCanvas">
            Continue Later
          </a>
          <div class="w-4"></div>
          <button type="button"
            class="shadow-xl border border-white bg-primary px-8 py-2 font-bold rounded text-white hover:bg-primary-lighter">
            NEXT
          </button>
        </div>
      </div>
      <nuxt/>
    </div>
  </no-ssr>
</template>


<script>
let html2canvas = null
let reimg = null
let htmlToImage = null
let saveAs = null
if(process.client){
  html2canvas = require('html2canvas')
  reimg = require('reimg')
  htmlToImage = require('html-to-image')
  saveAs = require('file-saver')
}

export default {
  head: {
    title: 'Printree Studio'
  },
  methods: {
    async exportCanvas(){
      let objectsContainer = document.querySelector(".printable-area > .objects-container").cloneNode(true)
      let blob = await htmlToImage.toBlob(
        objectsContainer
      )
      saveAs(blob, 'image.png')
      // let canvas = await html2canvas(
      //   document.querySelector(".printable-area"),
      //   {
      //     backgroundColor: null
      //   }
      // )
      // reimg.ReImg.fromCanvas(canvas).downloadPng()
    }
  }
}
</script>
