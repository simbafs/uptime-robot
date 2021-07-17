const debug = require('debug')('utb:cron.js');
const config = require('config');
const cron = require('node-cron');
const ping = require('./cron/ping');
const clearRecord = require('./cron/clearRecord');

module.exports = (db) => (client) => {
	cron.schedule(`0 */${config.get('interval')} * * * *`, () => ping(db, client));
	// TODO
	// cron.schedule('0 0 23 * * *', () => clearRecord(client));
}
