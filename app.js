require('dotenv').config();

const broadcast = require('./utb.js');
const ping = require('./ping.js').pingAndSave;
const cron = require('node-cron');
const JSONdb = require('simple-json-db');
const db = new JSONdb(process.env.db || './db.json');

function pingAll(){
	let tasks = [];
	let url = db.get('url');
	url.forEach(i => tasks.push(ping(i)));
	console.log('ping');
	//	console.log(tasks);
	// setTimeout(() => console.log(tasks), 3000);
	return Promise.all(tasks)
		.then(e => {
			let msg = '```\n' 
					+ 'Uptime Robot!!\n'
					+ (new Date).toLocaleString('zh-Hant', { timeZone: 'Asia/Taipei'}) + '\n';
			let flag = false;
			e.forEach(i => {
				let lastStatus = (db.get(i.url) || []).slice().pop();
				/*
				console.group(i.url);
				console.log(lastStatus.status);
				console.log(i.status);
				console.groupEnd();
				*/
				if(!lastStatus || lastStatus.status !== i.status){
					if(i.status == 200){
						msg += `${i.url} isBack\n`;
					}else{
						msg += `${i.url} is down\n`;
					}
					flag = true;
				}
			})
			msg += '```\n';
			if(flag){
				broadcast(msg);
			}
		})
		.catch((e) => console.error('error', e));
};

// setTimeout(() => pingAll(), 5000);
cron.schedule('0 */1 * * * *', pingAll);	
