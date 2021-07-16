const debug = require('debug')('utb:parseCmd.js');
const Discord = require('discord.js');
const { join } = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const db = low(new FileSync(join(process.cwd(), 'db.json')));

function getArgs(cmd){
	cmd = cmd.options[0].options;
	let args = {};
	cmd?.forEach(i => args[i.name] = i.value);
	return args;
}

const subCmdListen = (cmd, send, interaction) => {
	const args = getArgs(cmd);
	let { url, channel } = args;

	if(!channel) channel = interaction.channel_id;

	try{
		let c = db.get(['channel', channel]);
		if(c.value()){
			if(c.value().includes(url)){
				send(`${url} is allready in listening list`);
			}else{
				c.push(url).write();
				send(`add ${url} to channel ${channel}'s listening list`);
			}
		}else{
			db.set(['channel', channel], [url])
				.write();
			send(`add ${url} to channel ${channel}'s listening list`);
		}
	}catch(e){
		send('Error occurred');
		debug(e);
	}
}

const subCmdRemove = (cmd, send, interaction) => {
	try{
		const args = getArgs(cmd);
		let { url, channel } = args;

		if(!channel) channel = interaction.channel_id;

		let c = db.get(['channel', channel])
			.remove(i => i === url)
			.write();
		send(`removed ${url}`);

	}catch(e){
		send('Error occurred');
		debug('error', e)
	}
}

const subCmdList = (cmd, send, interaction) => {
	const args = getArgs(cmd);
	let { channel } = args;

	if(!channel) channel = interaction.channel_id;

	let c = db
		.get(['channel', channel])
		.value();
	send(`\`\`\`json
${JSON.stringify(c, null, 2)}\`\`\``);
}

const logCmd = (interaction) => {
	const user = interaction?.member?.user?.username;
	const cmd = interaction.data;
	const subCmd = cmd.options[0].name;
	const args = Object.entries(getArgs(cmd)).map(i => `${i[0]}: ${i[1]}`).join(' ');
	debug(`${user} execute "/${cmd?.name} ${subCmd} ${args}"`);
}

const cmds = {
	listen: subCmdListen,
	remove: subCmdRemove,
	list: subCmdList
}

function Parse(interaction, client){
	let flag = false
	const send = (content) => {
		debug('send', flag, content);
		if(flag) return;
		client.api.interactions(interaction.id, interaction.token)
			.callback.post({
				data: {
					type: 4,
					data: { content }
				}
			});
		flag = true;
	};
	const cmd = interaction.data;
	const subCmd = cmd.options[0].name;
	logCmd(interaction);
	if(cmds[subCmd]){
		cmds[subCmd](cmd, send, interaction);
	}else{
		send(`\`\`\`json
${JSON.stringify(cmd, null, 2)}
\`\`\``);
	}
}

module.exports = Parse;
