const webpack = require('webpack')

module.exports = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width,initial-scale=1,viewport-fit=cover'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [
    '~/assets/css/tailwind.css',
    '~/assets/fonts/poppins.css',
    '~/resources/scss/main.scss'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/firebase.js',
    '~/plugins/check_user.js',
    '~/plugins/prototypes.js',
    '~/plugins/external-installs.js'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    [
      'nuxt-fontawesome',
      {
        imports: [
          {
            set: '@fortawesome/free-solid-svg-icons',
            icons: ['fas']
          },
          ,
          {
            set: '@fortawesome/free-regular-svg-icons',
            icons: ['far']
          },
          {
            set: '@fortawesome/free-brands-svg-icons',
            icons: ['fab']
          }
        ]
      }
    ],
    [
      'nuxt-env',
      {
        keys: [
          { key: 'GOOGLE_API', default: null },
          { key: 'FIREBASE_DB', default: 'printree-52ca8' }
        ]
      }
    ],
    '@nuxtjs/universal-storage'
  ],
  storage: {
    cookie: {
      prefix: 'printree:'
    },
    localStorage: {
      prefix: 'printree:'
    }
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   */
  build: {
    postcss: {
      plugins: {
        tailwindcss: './tailwind.config.js'
      }
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, { isDev, isClient }) {
      if (isClient) {
        config.module.rules.push({
          test: /\.worker\.js$/,
          use: { loader: 'worker-loader' },
          exclude: /(node_modules)/
        })
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        _: 'lodash'
      })
    ]
  }
}
