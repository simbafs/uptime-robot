const debug = require('debug')('utb:ping.js');
const config = require('config');
const axios = require('axios').create({ timeout: parseInt(config.get('timeout')) });

const axios = Axios
async function ping(url){
	return axios.head(url)
		.then(({status, statusText}) => ({url, status, statusText}), e => {
			return {url, status: e?.response?.status || 500, statusText: e?.response?.statusText || 'Internal Server Error'};
		})
		.then(e => ({
				...e,
				timestamp: (new Date()).toISOString()
		}));
}

// ping('http://localhost:3000/noreply').then(debug)

module.exports = ping;
