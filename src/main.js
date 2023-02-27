const dotenv = require('dotenv');
const { createApp } = require('./app');
const { LogHelper } = require('./utils/log-helper');

(async () => {
	try {
		dotenv.config();
		await createApp();
	} catch (err) {
		LogHelper.error(err);
	}
})();
