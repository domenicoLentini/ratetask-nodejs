const db = require('../index')

RatesRepository = {
  test: function () {
    return db.any('SELECT * FROM prices LIMIT 20')
  },

  query: function (parameters) {
    const params = parameters;
    return db.any(`select day, CAST(AVG (price) AS DECIMAL (12,2)) AS average_price 
    from (
      select *
      from (select q1.orig_region, q1.orig_code, q1.dest_code, parent_slug as dest_region, q1.day, q1.price 
        from (select parent_slug as orig_region, p1.orig_code, p1.dest_code, p1.day, p1.price 
          from ports p
          join prices p1 on p1.orig_code=p.code) q1
        join ports p1 on q1.dest_code=p1.code) q2
      where
        (q2.orig_code = $3 or q2.orig_region = $3) and
        (q2.dest_code = $4 or q2.dest_region = $4)and
        q2.day between $1 and $2) q3
      group by day;`, [params.date_from, params.date_to, params.origin, params.destination])
  },

  ratesNull: function (parameters) {
    const params = parameters;
    return db.any(`select count(day) as days_count, day, CAST(AVG (price) AS DECIMAL (12,2)) AS average_price 
    from (
      select *
      from (select q1.orig_region, q1.orig_code, q1.dest_code, parent_slug as dest_region, q1.day, q1.price 
        from (select parent_slug as orig_region, p1.orig_code, p1.dest_code, p1.day, p1.price 
          from ports p
          join prices p1 on p1.orig_code=p.code) q1
        join ports p1 on q1.dest_code=p1.code) q2
      where
        (q2.orig_code = $3 or q2.orig_region = $3) and
        (q2.dest_code = $4 or q2.dest_region = $4)and
        q2.day between $1 and $2) q3
      group by day;`, [params.date_from, params.date_to, params.origin, params.destination])
  },

  insertPrices: function (pricesToInsert) {
    const prices = pricesToInsert;
    let responses = []
    return db.tx(async t => {
      for (let i = 0; i < prices.length; i++) {
        responses[i] = await t.one(`INSERT INTO prices (orig_code, dest_code, day, price)
        VALUES ($1, $2, $3, $4) RETURNING *`,
        [prices[i].origin_code, prices[i].destination_code, prices[i].day, prices[i].price]);
      }
      return responses
    })
  }
};

module.exports = RatesRepository;
