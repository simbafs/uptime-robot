const config = require('config');
const Discord = require('discord.js');
const parse = require('./parseCmd');
const { join } = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const db = low(new FileSync(join(process.cwd(), 'db.json')));

db.defaults({
	channel: {},
	record: [],
	lastStatus: []
}).write()

const client = new Discord.Client();

client.login(config.get('token'));

client.on('ready', () => {
	console.log('logined!');
	client.ws.on('INTERACTION_CREATE', i => parse(i, client));
});

require('./registerCmd');
