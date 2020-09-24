const router = require('express').Router()
const RatesRepository = require('../db/repositories/RatesRepository')
const RatesService = require('../services/RatesService')
const { query, validationResult } = require('express-validator');

const validations = [
  query('date_from').trim().isDate('yyyy-mm-dd').withMessage('Supported data format: yyyy-mm-dd'),
  query('date_to').trim().isDate('yyyy-mm-dd').withMessage('Supported data format: yyyy-mm-dd'),
  query('origin').isString().withMessage('Should be a string'),
  query('destination').isString().withMessage('Should be a string'),
]

router.get("/test", function (req, res) {
  RatesRepository.test()
    .then(function (data) {
      res.json({ data: data })
    })
    .catch(function (error) {
      // error;
      console.log('KO', error)
    });
});

router.get("/rates", validations, function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  RatesRepository.query(req.query)
    .then(function (data) {
      res.json({ data: data })
    })
    .catch(function (error) {
      // error;
      console.log('KO', error)
    });
});

router.get("/rates_null", validations, function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  RatesRepository.ratesNull(req.query)
    .then(function (data) {
      let newArrayWithNullValues = RatesService.ratesNull(data)
      res.json({ data: newArrayWithNullValues })
    })
    .catch(function (error) {
      // error;
      console.log('KO', error)
    });
});


router.post("/rates", function (req, res) {
  RatesService.convertPriceIntoUSD(req.body.price, req.body.currency)
    .then(response => {
      req.body.price = response.USDPrice;
      const pricesToInsert = RatesService.preparePrices(req.body)

      RatesRepository.insertPrices(pricesToInsert)
      .then(function (data) {    
        res.status(201).json({ data: data })
      })
      .catch(function (error) {
        res.json({ data: error })
      });
    }).catch(e => {
      res.status(500).json(e)
    })
})

module.exports = router;
