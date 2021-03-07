import map from 'lodash/map'

const ACCEPTED_FLAGS = {
  'flow': {
    acceptableValues: ['2'],
    defaultValue: '1'
  },
  'single': {
    acceptableValues: ['on', 'off'],
    defaultValue: 'off'
  },
}

class FlagManager {
  _flags = {}
  _storage = null

  constructor({ storage }) {
    this._storage = storage;

    Object.keys(ACCEPTED_FLAGS).map((key) => {
      let flagVal = this.get(key)
      if (flagVal === undefined) flagVal = ACCEPTED_FLAGS[key].defaultValue
      this.set(key, flagVal)
    })
  }

  all() {
    return this._flags
  }

  set(key, val) {
    this._flags[key] = val
    this._storage.setLocalStorage(key, val)
  }

  has(key) {
    return this._flags[key] || this._storage.getLocalStorage(key)
  }

  get(key) {
    return this._flags[key] || this._storage.getLocalStorage(key)
  }

  clear() {
    Object.keys(ACCEPTED_FLAGS).map((key) => {
      const flagVal = ACCEPTED_FLAGS[key].defaultValue
      this.set(key, flagVal)
    })
  }

  register(query) {
    map(query, ((val, k) => {
      if (!ACCEPTED_FLAGS[k]) return
      if (this.get(k) !== val) this.set(k, val)
    }))
  }

  flagIs(flag, val) {
    return this._flags[flag] == val
  }
}

export default ({ app, $storage, route }, inject) => {
  const flagManager = new FlagManager({ storage: $storage })
  flagManager.register(route.query)

  app.$flags = flagManager
  inject("flags", app.$flags);
};
