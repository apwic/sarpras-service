const dotenv = require('dotenv');
const { createApp } = require('./app');
const { LogHelper } = require('./utils/log-helper');

(async () => {
	try {
    global.__basedir = __dirname;
		dotenv.config();
		await createApp();
	} catch (err) {
		LogHelper.error(err);
	}
})();
