require('dotenv').config();
require('./utb.js');

const ping = require('./ping.js').pingAndSave;
const cron = require('node-cron');
const JSONdb = require('simple-json-db');
const db = new JSONdb(process.env.db || './db.json');

function pingAll(){
	db.get('url').forEach(i => ping(i).then(console.log, () => console.error('Error')));
};

// cron.schedule('0 */5 * * * *', pingAll);	
