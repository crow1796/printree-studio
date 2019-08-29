import Storage from './storage'
import { serialize } from 'uri-js';

export default function nuxtUniversalStorage(ctx, inject) {
  // Create new instance of Storage class
  const storage = new Storage(ctx, {
  "vuex": {
    "namespace": "storage"
  },
  "cookie": {
    "prefix": "printree:"
  },
  "localStorage": {
    "prefix": "printree:"
  },
  "ignoreExceptions": false
})

  // Inject into context as $storage
  ctx.$storage = storage
  inject('storage', storage)
}
