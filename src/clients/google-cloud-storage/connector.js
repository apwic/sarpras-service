require('dotenv').config();
const Cloud = require('@google-cloud/storage');
const path = require('path');
const serviceKey = path.join(__dirname, './config/keys.json');

const { Storage } = Cloud;
const storage = new Storage({
	keyFilename: serviceKey,
	projectId: process.env.GCP_PROJECT_NAME,
});

const bucket = storage.bucket(process.env.GCP_BUCKET_NAME);

module.exports = bucket;
