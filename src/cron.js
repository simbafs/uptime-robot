const debug = require('debug')('utb:cron.js');
const cron = require('node-cron');
const ping = require('./cron/ping');
const clearRecord = require('./cron/clearRecord');

module.exports = function(client){
	cron.schedule('0 */5 * * * *', () => ping(client));
	// TODO
	// cron.schedule('0 0 23 * * *', () => clearRecord(client));
}
