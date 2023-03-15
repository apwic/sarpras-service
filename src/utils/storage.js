const GCPStorageClient = require('../clients/google-cloud-storage/index');
const path = require('path');
const crypto = require('crypto');

async function uploadImageUser(file) {
	const fileName = `image/user/${
		crypto.randomBytes(20).toString('hex') + path.parse(file.originalname).ext
	}`;
	return await GCPStorageClient.uploadPromise(file, fileName);
}

async function uploadFileBooking(id, file) {
	const fileName = `document/booking-${id}/${
		crypto.randomBytes(20).toString('hex') + path.parse(file.originalname).ext
	}`;
	return await GCPStorageClient.uploadPromise(file, fileName);
}

async function uploadImageFacility(id, file) {
	const fileName = `image/facility/facility-${id}/${
		crypto.randomBytes(20).toString('hex') + path.parse(file.originalname).ext
	}`;
	return await GCPStorageClient.uploadPromise(file, fileName);
}

async function deleteFile(filePath) {
	filePath = filePath.replace('https://storage.googleapis.com/sarpras/', '');

	return await GCPStorageClient.deletePromise(filePath);
}

const ImageUser = {
	upload: uploadImageUser,
	delete: deleteFile,
};

const FileBooking = {
	upload: uploadFileBooking,
	delete: deleteFile,
};

const ImageFacility = {
	upload: uploadImageFacility,
	delete: deleteFile,
};

module.exports = {
	ImageUser,
	FileBooking,
	ImageFacility,
};