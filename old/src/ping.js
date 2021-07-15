const config = require('config');
const axios = require('axios').create({ timeout: parseInt(config.get('timeout')) });

const lowdb = require('lowdb');
const Adapter = require('lowdb/adapters/FileSync');
const db = lowdb(new Adapter('db.json'));

function ping(url){
	return axios.head(url)
		.then(({status, statusText}) => ({url, status, statusText}), e => {
			// console.error(e);
			return {url, status: 503, statusText: 'Server is unavailible'};
		})
		.then(e => {
			// console.log(e);
			e.timestamp = (new Date()).toISOString();

			if(!db.get('record').has(e.url).value()){
				db
					.get('record')
					.set([e.url], [e])
					.write();
			}else{
				db
					.get('record')
					.get(e.url)
					.push(e)
					.write();
			}
			return e;
		});
}

ping.db = db;

module.exports = ping;
