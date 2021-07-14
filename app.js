require('dotenv').config();

const broadcast = require('./src/utb.js');
const ping = require('./src/ping.js');
const cron = require('node-cron');

const lowdb = require('lowdb');
const Adapter = require('lowdb/adapters/FileSync');
const db = lowdb(new Adapter('db.json'));

db.defaults({
	channel: [],
	url: [],
	record: {},
	status: {}
}).write();

function pingAll(){
	let tasks = [];
	db.get('url').value().forEach(i => tasks.push(ping(i)));
	console.log('ping');
	return Promise.all(tasks)
		.then(e => {
			let msg = '```\n' 
					+ 'Uptime Robot\n'
					+ (new Date).toLocaleString('zh-Hant', { timeZone: 'Asia/Taipei'}) + '\n';
			let flag = false;
			let status = db.get('status');
			console.log('status', status.value());
			e.forEach(i => {
				let lastStatus = status.get(i.url).value();
				console.log(`lastStatus: ${lastStatus} current status: ${i.status}, ${lastStatus !== i.status}`)
				if(!lastStatus || lastStatus !== i.status){
					if(i.status == 200){
						msg += `${i.url} is back\n`;
					}else{
						msg += `${i.url} is down\n`;
					}
					status.set([i.url], i.status).write();
					flag = true;
				}
			});

			msg += '```\n';
			if(flag){
				console.log('send message')
				broadcast(msg);
			}
		})
		.catch((e) => console.error('error', e));
};

// TODO
// function clearRecord(){
//
// }

// setTimeout(() => pingAll(), 5000);
cron.schedule('0 */1 * * * *', pingAll);
// cron.schedule('0  59 23 * * *', clearRecord);
