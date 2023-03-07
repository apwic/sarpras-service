const Cloud = require('@google-cloud/storage');
const path = require('path');
const serviceKey = path.join(__dirname, '/../../config/keys.json');

const { Storage } = Cloud;
const storage = new Storage({
	keyFilename: serviceKey,
	projectId: 'sarpras-dev',
});

module.exports = storage;
