const { format } = require('util');
const path = require('path');

const bucket = require('./connector');
const StandardError = require('../../utils/standard-error');

class GCPStorageClient {
	static async uploadPromise(file, path) {
		return new Promise((resolve, reject) => {
			const { buffer } = file;

			const blob = bucket.file(path);
			const blobStream = blob.createWriteStream({
				resumable: false,
			});
			blobStream
				.on('finish', async () => {
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
	}

	static async deletePromise(path) {
		return new Promise((resolve, reject) => {
			bucket
				.file(path)
				.delete()
				.then(() => {
					resolve();
				})
				.catch((err) => {
					throw new StandardError(
						500,
						'CLOUD_ERROR',
						'Something is wrong with the cloud storage',
						err
					);
				});
		});
	}
}

module.exports = GCPStorageClient;
