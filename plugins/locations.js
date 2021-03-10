import find from 'lodash/find'

let rawProvinces = require('~/resources/data/refprovince.json')
const provinces = rawProvinces.RECORDS

let rawCities = require('~/resources/data/refcitymun.json')
const cities = rawCities.RECORDS

let rawBarangays = require('~/resources/data/refbrgy.json')
const barangays = rawBarangays.RECORDS

export default ({ app }, inject) => {
  app.$locations = {
    provinces,
    cities,
    barangays,
    findBrgy(brgyCode) {
      return find(barangays, { brgyCode })
    },
    findCity(citymunCode) {
      return find(cities, { citymunCode })
    },
    findProvince(provCode) {
      return find(provinces, { provCode })
    },
  }
  inject("locations", app.$locations);
};
