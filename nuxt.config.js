const webpack = require("webpack");

module.exports = {
  mode: "universal",
  server: {
    port: 3333,
  },
  env: {
    apiUrl: process.env.API_URL
  },
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,viewport-fit=cover",
      },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || "",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: [
    "~/assets/css/tailwind.css",
    "~/assets/fonts/main.css",
    "~/resources/scss/main.scss",
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "~/plugins/prototypes.js",
    "~/plugins/external-installs.js",
    "~/plugins/api.js",
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    "@nuxtjs/auth",
    "@nuxtjs/pwa",
    [
      "nuxt-fontawesome",
      {
        imports: [
          {
            set: "@fortawesome/free-solid-svg-icons",
            icons: ["fas"],
          },
          ,
          {
            set: "@fortawesome/free-regular-svg-icons",
            icons: ["far"],
          },
          {
            set: "@fortawesome/free-brands-svg-icons",
            icons: ["fab"],
          },
        ],
      },
    ],
    "@nuxtjs/universal-storage",
  ],
  storage: {
    cookie: {
      prefix: "printree:",
    },
    localStorage: {
      prefix: "printree:",
    },
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: process.env.API_URL
  },
  auth: {
    localStorage: false,
    cookie: {
      options: {
        expires: 7
      }
    },
    redirect: {
      login: '/',
      callback: '/',
    },
    strategies: {
      local: {
        endpoints: {
          login: { url: 'login', method: 'post', propertyName: 'token' },
          user: { url: 'me', method: 'post', propertyName: 'user'  },
          logout: false
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    extractCSS: true,
    postcss: {
      plugins: {
        tailwindcss: "./tailwind.config.js",
      },
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, { isDev, isClient }) {
      if (isClient) {
        config.module.rules.push({
          test: /\.worker\.js$/,
          use: { loader: "worker-loader" },
          exclude: /(node_modules)/,
        });
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        _: "lodash",
      }),
    ],
  },
};
