importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/058babb1e0f04d59cefa.js",
    "revision": "dbe641e807091d12e2baf93eddd92da8"
  },
  {
    "url": "/_nuxt/068137f788186baba6a4.js",
    "revision": "6aed0945324f46e86ad020b77478872d"
  },
  {
    "url": "/_nuxt/0e0109238514a162fd53.js",
    "revision": "b687c61ff1a02a8f73ba3e209bbd888f"
  },
  {
    "url": "/_nuxt/1081130fa74d76293847.js",
    "revision": "103329fe42e30bbe821e481d7b3e666f"
  },
  {
    "url": "/_nuxt/15b677fe0722fd99ac14.js",
    "revision": "1848b611d392de6c5edc07c7ab652085"
  },
  {
    "url": "/_nuxt/29a630849d511eeb74ab.js",
    "revision": "174e41d30e6622ad61e0863a2c0dd6c0"
  },
  {
    "url": "/_nuxt/3640f95c9900fd99eae9.js",
    "revision": "a70770003c2c510d04551d1b0881c3e5"
  },
  {
    "url": "/_nuxt/65404c42b8c276929419.js",
    "revision": "07e9bc861515a3a51a6fa194998b2c44"
  },
  {
    "url": "/_nuxt/83ae905b65232b68bf08.js",
    "revision": "19d91ae25413b8952dc814a2f681c41a"
  },
  {
    "url": "/_nuxt/87246308623ed8994070.js",
    "revision": "1995c25830205d03e49edd7719e19051"
  },
  {
    "url": "/_nuxt/94864bf43c6266d424cd.js",
    "revision": "b3710974c6bc7c4ca6a0a69fd797263b"
  },
  {
    "url": "/_nuxt/9b04b1c4587c16a5d548.js",
    "revision": "b121111e86a6ea4e4513e191435a0628"
  },
  {
    "url": "/_nuxt/abfe7a12196624bc266f.js",
    "revision": "c97aa28c5bd6bef760e40f272dc58506"
  },
  {
    "url": "/_nuxt/bf49923c8146a2d95876.js",
    "revision": "04ed26c6acad8e35ef2d9c3762c816a7"
  },
  {
    "url": "/_nuxt/c81714489090bda46d89.js",
    "revision": "0a42412924e625c5a6fda7b7ebb97736"
  },
  {
    "url": "/_nuxt/cd0347dcee932a034418.js",
    "revision": "d8c76ada1861dd3755235c6fce9a0a2d"
  },
  {
    "url": "/_nuxt/ceae5575401f12eb9812.js",
    "revision": "baa7c9c7057b76205f56889e12cdae22"
  },
  {
    "url": "/_nuxt/e331acbf5eea50c06772.js",
    "revision": "e91189d23fc4ebf09cab334ecd2bf1e2"
  },
  {
    "url": "/_nuxt/eef1d90eae639dd418bf.js",
    "revision": "dc5bea969c88c895dfb8a432d505cbdf"
  }
], {
  "cacheId": "printree-studio",
  "directoryIndex": "/",
  "cleanUrls": false
})

workbox.clientsClaim()
workbox.skipWaiting()

workbox.routing.registerRoute(new RegExp('/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/.*'), workbox.strategies.networkFirst({}), 'GET')
