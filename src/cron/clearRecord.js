const debug = require('debug')('utb:cron.js');
const config = require('config');
const { join } = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const db = low(new FileSync(join(process.cwd(), 'db.json')));

module.exports = function(client){

}
