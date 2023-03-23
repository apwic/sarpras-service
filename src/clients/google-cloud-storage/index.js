const { format } = require('util');

const { getBucket } = require('./connector');
const StandardError = require('../../utils/standard-error');

class GCPStorageClient {
    static async uploadPromise(file, path) {
        try {
            const bucket = await getBucket();
            return new Promise((resolve, reject) => {
                const { buffer } = file;

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
                    .on('error', (err) => {
                        reject(
                            new StandardError(
                                500,
                                'CLOUD_ERROR',
                                'Something is wrong when uploading to the cloud storage',
                                err,
                            ),
                        );
                    })
                    .end(buffer);
            });
        } catch (err) {
            throw new StandardError(
                500,
                'CLOUD_ERROR',
                'Unexpected error when uploading to the cloud storage',
                err,
            );
        }
    }

    static async deletePromise(path) {
        try {
            const bucket = await getBucket();

            return new Promise((resolve, reject) => {
                bucket
                    .file(path)
                    .delete()
                    .then(() => {
                        resolve();
                    })
                    .catch((err) => {
                        reject(
                            new StandardError(
                                500,
                                'CLOUD_ERROR',
                                'Something is wrong when deleting from the cloud storage',
                                err,
                            ),
                        );
                    });
            });
        } catch (err) {
            throw new StandardError(
                500,
                'CLOUD_ERROR',
                'Unexpected error when deleting from the cloud storage',
                err,
            );
        }
    }
}

module.exports = GCPStorageClient;
