require('dotenv').config();

const simply = require('simply.js');
const helpMsg = require('./helpMsg.js');

simply.login(process.env.DC_ROT_TOKEN);

simply.set('prefix', '!');
simply.cmd('utb', (msg, arg) => {
	switch(arg[1]){
		case 'ping':
			msg.channel.send('pong');
			break;
		case 'help':
		default:
			msg.channel.send(helpMsg);

	}
})
