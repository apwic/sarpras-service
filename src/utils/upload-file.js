const { format } = require('util');
const gc = require('../clients/google-cloud-storage');
const bucket = gc.bucket('sarpras'); // should be your bucket name

/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */

const uploadImageUser = (file, filename) =>
	new Promise((resolve, reject) => {
		const { buffer } = file;

		const blob = bucket.file(`image/user/${filename.replace(/ /g, '_')}`);
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
				console.log(err);
				reject(`Unable to upload image, something went wrong`);
			})
			.end(buffer);
	});

const uploadFileBooking = (id, file, filename) => {
	new Promise((resolve, reject) => {
		const { buffer } = file;

		const blob = bucket.file(`document/booking-${id}/${filename.replace(/ /g, '_')}`);
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
			.on('error', () => {
				reject(`Unable to upload image, something went wrong`);
			})
			.end(buffer);
	});
};

module.exports = {
	uploadImageUser,
	uploadFileBooking,
};
