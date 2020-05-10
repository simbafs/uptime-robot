require('dotenv').config();

const simply = require('simply.js');
const helpMsg = require('./helpMsg.js');
const JSONdb = require('simple-json-db');
const db = new JSONdb('./db.json');

let url = db.get('url') || [];
let channelID = db.get('channel') || [];
let channel = [];

/**
 *	get channel object when the bot restart
 *	@function
 *	@param {Array} broadcastPool - the pool contains channel object
 *	@param {Array} broadcastPoolID - the pool contains channel id
 */
function restoreChannel(broadcastPool, broadcastPoolID){
	broadcastPool.length = 0;
	for(let id of broadcastPoolID){
		broadcastPool.push(simply.client.channels.get(id));
	}
}

/**
 *	verify the url
 *	@function
 *	@param {String} url
 */
function isUrl(target){
	let parsedUrl = require('url').parse(target);
	return (parsedUrl.protocol && parsedUrl.slashes && parsedUrl.host);
}

simply.login(process.env.DC_ROT_TOKEN);

simply.set('prefix', '!');
simply.cmd('utb', (msg, arg) => {
	switch(arg[1]){
		case 'ping':
			msg.channel.send('pong');
			break;
		case 'add':
			if(arg.length < 3){
				msg.channel.send('Warning! You must pass a url');
			}else if(url.includes(arg[2])){
				msg.channel.send('Url has added to the list');
			}else{
				url.push(arg[2]);
				msg.channel.send(`Add ${arg[2]} to the list`);
				setTimeout(() => db.set('url', url), 100);
			}
			break;
		case 'remove':
			if(arg.length < 3){
				msg.channel.send('Warning! You must pass a url');
			}else if(url.includes(arg[2])){
				url = url.filter(i => i !== arg[2]);
				msg.channel.send(`Remove ${arg[2]} from the list`);
				setTimeout(() => db.set('url', url), 100);
			}
			break;
		case 'help':
		default:
			msg.channel.send(helpMsg);

	}
})
