const debug = require('debug')('utb:cron/ping.js');
const config = require('config');
const ping = require('../ping');
const { join } = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const db = low(new FileSync(join(process.cwd(), 'db.json')));

function writeRecord(result){
	const record = db.get('record').value();
	result.forEach(item => {
		if(record[item.url]){
			record[item.url].push(item);
		}else{
			record[item.url] = [item];
		}
	})
	db.set('record', record).write();
}

module.exports = function(client){
	channels = Object.entries(db.get('channel').value())
	urls = Array.from(new Set(channels.map(i => i[1]).flat()));
	debug({ urls });
	debug({ channels });

	Promise.all(urls.map(url => ping(url)))
		.then(result => {
			debug({ result });
			writeRecord(result);
			
			// send message to each client
			let status = result.reduce((status, a) => { status[a.url] = a.status; return status}, {});
			let lastStatus = db.get('lastStatus').value();
			db.set('lastStatus', status).write();

			debug({ status });
			debug({ lastStatus });
			
			channels.forEach(async channelID => {
				let channel = await client.channels.fetch(channelID[0]);
				let flag = false;
				let msg = '```\n' + 
						  'Uptime Robot\n';
				channelID[1].forEach(url => {
					debug(channel.id, url, !lastStatus[url],  status[url] !== lastStatus[url]);
					if(!lastStatus[url] || status[url] !== lastStatus[url]){
						if(status[url] === 200){
							msg += `${url} is up\n`;
						}else{
							msg += `${url} is down\n`;
						}
						flag = true;
					}
				})

				msg += '```';
				flag && debug(msg);
				flag && channel.send(msg);
			})
		});


}
