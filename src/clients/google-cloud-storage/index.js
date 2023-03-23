const { format } = require('util');

const { getBucket } = require('./connector');
const StandardError = require('../../utils/standard-error');

class GCPStorageClient {
    static async uploadPromise(file, path) {
        try {
            return new Promise((resolve) => {
                const { buffer } = file;

                const bucket = getBucket();
                const blob = bucket.file(path);
                const blobStream = blob.createWriteStream({
                    resumable: false,
                });
                blobStream
                    .on('finish', async () => {
                        const publicUrl = format(
                            `https://storage.googleapis.com/${bucket.name}/${blob.name}`,
                        );
                        resolve(publicUrl);
                    })
                    .end(buffer);
            });
        } catch (err) {
            throw new StandardError(
                500,
                'CLOUD_ERROR',
                'Something is wrong with the cloud storage',
                err,
            );
        }
    }

    static async deletePromise(path) {
        try {
            const bucket = getBucket();

            return new Promise((resolve) => {
                bucket
                    .file(path)
                    .delete()
                    .then(() => {
                        resolve();
                    });
            });
        } catch (err) {
            throw new StandardError(
                500,
                'CLOUD_ERROR',
                'Something is wrong with the cloud storage',
                err,
            );
        }
    }
}

module.exports = GCPStorageClient;
