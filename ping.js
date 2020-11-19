require('dotenv').config();

const axios = require('axios').create({ timeout: process.env.timeout || 10*1000 });
const JSONdb = require('simple-json-db');
const db = new JSONdb(process.env.db || './db.json');

function ping(url){
	return axios.head(url)
		.then(({status, statusText}) => { return {url, status, statusText} })
		.catch(e => { console.log(e); return {url, status: 503, statusText: 'Server is unavailible'}; })
		.then(e => {
			// console.log(e);
			e.timestamp = (new Date()).toISOString();

			let record = db.get(e.url) || [];
			record.push(e);
			console.log('url', e.url);
			setTimeout(() => db.set(e.url, record), 100);
			return e;
		});
}

module.exports = ping;
