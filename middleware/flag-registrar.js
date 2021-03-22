export default function ({ app, route, isServer }) {
  if (!process.server) app.$flags.register(route.query)
}
