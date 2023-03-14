const { format } = require('util');
const path = require('path');

const bucket = require('./connector');

const uploadPromise = (oldPath, file, path) =>
	new Promise((resolve, reject) => {
		const { buffer } = file;

		const blob = bucket.file(path);
		const blobStream = blob.createWriteStream({
			resumable: false,
		});
		blobStream
			.on('finish', async () => {
				if (oldPath !== null) {
					await bucket.file(oldPath).delete();
				}

				const publicUrl = format(
					`https://storage.googleapis.com/${bucket.name}/${blob.name}`
				);
				resolve(publicUrl);
			})
			.on('error', (err) => {
				throw new StandardError(
					500,
					'CLOUD_ERROR',
					'Something is wrong with the cloud storage',
					err
				);
			})
			.end(buffer);
	});

module.exports = uploadPromise;
