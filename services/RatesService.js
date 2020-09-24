const moment = require('moment');
const axios = require('axios');
global.Promise = require("bluebird");

RatesService = {
  ratesNull: function(data) {
    return data.map(value => {
      const newValue = {
        day: value.day,
        average_price: value.average_price
      }
      if (value.days_count < 3) newValue.average_price = null
      return newValue
    })
  },

  preparePrices: function (payload) {
    const start = moment(payload.date_from)
    const end = moment(payload.date_to)
    let currentDate = start
    let pricesToInsert = []

    while (!currentDate.isAfter(end)) {
      const price = {
        origin_code: payload.origin_code,
        destination_code: payload.destination_code,
        day: currentDate.format('YYYY-MM-DD'),
        price: payload.price
      }
      pricesToInsert.push(price)
      currentDate = start.add(1, 'day')
    }
    return pricesToInsert;
  },

  convertPriceIntoUSD(price, currency) {
    if (!price) return 
    if (!currency) return Promise.resolve({ USDPrice: price })
    return axios('https://openexchangerates.org/api/latest.json?app_id=d2b052aa6dfb490a8bb54e89c370cef7')
    .then(function (response) {
      const exchangeRate = response.data.rates[currency]
      console.log('USDPrice', price, exchangeRate, price / exchangeRate)
      const USDPrice = Math.round(price / exchangeRate);
      return Promise.resolve({ USDPrice: USDPrice })
    })
    .catch(function (error) {
      return Promise.reject(error.toJSON())
    });
  }
}

module.exports = RatesService;