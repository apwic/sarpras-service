const Cloud = require('@google-cloud/storage');
const path = require('path');
const serviceKey = path.join(__dirname, './config/keys.json');

const { GCP_PROJECT_NAME, GCP_BUCKET_NAME } = process.env;

const { Storage } = Cloud;
const storage = new Storage({
    keyFilename: serviceKey,
    projectId: GCP_PROJECT_NAME,
});

const bucket = storage.bucket(GCP_BUCKET_NAME);

module.exports = bucket;
