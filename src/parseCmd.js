const Discord = require('discord.js');

function getArgs(cmd){
	cmd = cmd.options[0].options;
	let args = {};
	cmd.forEach(i => args[i.name] = i.value);
	return args;
}

const subCmdListen = (cmd, send) => {
	const args = getArgs(cmd);
	console.log('listen sub-command', args);
}

const subCmdRemove = (cmd, send) => {
	const args = getArgs(cmd);
	console.log('listen sub-command', args);
}

const subCmdList = (cmd, send) => {
	const args = getArgs(cmd);
	console.log('listen sub-command', args);
}

const cmds = {
	listen: subCmdListen,
	remove: subCmdRemove,
	list: subCmdList
}

function Parse(interaction, client){
	const send = (content) => client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
			type: 4,
			data: { content }
		}
	});
	const cmd = interaction.data;
	const subCmd = cmd.options[0].name;
	if(subCmd in cmds){
		cmds[subCmd](cmd, send);
	}

	send(`
\`\`\`json
${JSON.stringify(cmd, null, 2)}
\`\`\`
	`);
}

module.exports = Parse;
