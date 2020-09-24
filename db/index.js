const promise = require('bluebird');
const pgPromise = require('pg-promise');
const dbConfig = require('../db-config.json');

const initOptions = {
    // Custom promise library
    promiseLib: promise
};

const pgp = pgPromise(initOptions);
pgp.pg.types.setTypeParser(1082, str => str);

const pgMonitor = require('pg-monitor');

pgMonitor.attach(initOptions, ['query', 'error']);
const db = pgp(dbConfig);

module.exports = db
