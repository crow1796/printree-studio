const functions = require('firebase-functions');
const express = require('express')
const { Nuxt } = require('nuxt')
const app = express()

const config = {
  dev: false,
  buildDir: 'nuxt',
  build: {
    publicPath: '/'
  }
}
const nuxt = new Nuxt(config)
function handleRequest(req, res) {
  const isProduction = process.env.NODE_ENV === "development" ? false : true
  if (isProduction) res.set("Cache-Control", "public, max-age=150, s-maxage=150")
  try {
    nuxt.render(req, res)
  } catch (err) {
    console.error(err)
  }
}
app.use(handleRequest)

exports.nuxtApp = functions.https.onRequest(app)
