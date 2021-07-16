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
		console.error(e);
	}
}

const subCmdRemove = (cmd, send, interaction) => {
	const args = getArgs(cmd);
	send(`
\`\`\`json
${JSON.stringify(cmd, null, 2)}
\`\`\`
	`);
	console.log('remove sub-command', args);
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

const cmds = {
	listen: subCmdListen,
	remove: subCmdRemove,
	list: subCmdList
}

function Parse(interaction, client){
	let flag = false
	const send = (content) => {
		console.log('send', flag, content);
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
	if(cmds[subCmd]){
		console.log('exec', cmds[subCmd]);
		cmds[subCmd](cmd, send, interaction);
	}else{
		send(`\`\`\`json
${JSON.stringify(cmd, null, 2)}
\`\`\``);
	}
}

module.exports = Parse;
