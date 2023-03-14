const GCPStorageClient = require('../clients/google-cloud-storage/index');
const path = require('path');
const crypto = require('crypto');

async function uploadImageUser(oldPath, file) {
	const filePath = `image/user/${path.parse(oldPath).name + path.parse(oldPath).ext}`;
	const fileName = `image/user/${
		crypto.randomBytes(20).toString('hex') + path.parse(file.originalname).ext
	}`;
	return await GCPStorageClient.uploadPromise(filePath, file, fileName);
}

async function uploadFileBooking(id, file) {
	const fileName = `document/booking-${id}/${
		crypto.randomBytes(20).toString('hex') + path.parse(file.originalname).ext
	}`;
	return await GCPStorageClient.uploadPromise(null, file, fileName);
}

async function uploadImageFacility(id, file) {
	const fileName = `image/facility/facility-${id}/${
		crypto.randomBytes(20).toString('hex') + path.parse(file.originalname).ext
	}`;
	return await GCPStorageClient.uploadPromise(null, file, fileName);
}

async function deleteImageFacility(filePath) {
	filePath = filePath.replace('https://storage.googleapis.com/sarpras/', '');

	return await GCPStorageClient.deletePromise(filePath);
}

const ImageFacility = {
	upload: uploadImageFacility,
	delete: deleteImageFacility,
}

module.exports = {
	uploadImageUser,
	uploadFileBooking,
	ImageFacility,
};
