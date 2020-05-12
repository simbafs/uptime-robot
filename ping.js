require('dotenv').config();

const axios = require('axios');
const CancelToken = axios.CancelToken;
const JSONdb = require('simple-json-db');
const db = new JSONdb(process.env.db || './db.json');

function ping(url){
	const source = CancelToken.source();
	setTimeout(() => source.cancel(url), parseInt(process.env.timeout) || 2000);
	return axios.head(url, {cancelToken: source.token})
		.then(({status, statusText}) => new Promise((res, rej) => res({url, status, statusText})));
	//	.then(({status, statusText}) => ({url, status, statusText}));
}

function saveRecod(e){
	console.log('saveRecod', e.url);
	return new Promise((res, rej) => {
		let timestamp = (new Date()).toISOString();
		e.timestamp = timestamp;

		let record = db.get(e.url) || [];
		record.push(e);
		
		db.set(e.url, record);
		res(e);
	})
}

function timeout(k){
	console.log(k);
	let url = Object.entries(k)[5][1].url;
	console.log('timeout', url);
	return new Promise((res, rej) => {
		let timestamp = (new Date()).toISOString();
		let e = {
			url: url,
			status: 408,
			statusText: 'Request Timeout test',
			timestamp
		}

		let record = db.get(e.url) || [];
		record.push(e);
		
		db.set(e.url, record);
		res(e);
	})
}

function pingAndSave(url){
	return ping(url).then(saveRecod).catch(timeout);
}

module.exports = {
	pingAndSave,
	saveRecod,
	ping
}
