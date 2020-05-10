require('dotenv').config();

const axios = require('axios');
const JSONdb = require('simple-json-db');
const db = new JSONdb(process.env.db || './db.json');

const url = 'https://oj.ckcsc.net';
function ping(url){
	return axios.head(url)
		.then(({status, statusText}) => ({url, status, statusText}));
}

function saveRecod(e){
	return new Promise((res, rej) => {
		let timestamp = (new Date()).toISOString();
		e.timestamp = timestamp;

		let record = db.get(e.url) || [];
		record.push(e);
		
		db.set(e.url, record);
		rej(e);
	})
}

function pingAndSave(url){
	return ping(url).then(saveRecod);
}

module.exports = {
	pingAndSave,
	saveRecod,
	ping
}
