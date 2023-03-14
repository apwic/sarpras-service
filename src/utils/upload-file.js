const uploadPromise = require('../clients/google-cloud-storage/index');
const path = require('path');
const crypto = require('crypto');

async function uploadImageUser(oldPath, file) {
  const filePath = `image/user/${path.parse(oldPath).name + path.parse(oldPath).ext}`
  const fileName = `image/user/${crypto.randomBytes(20).toString('hex') + path.parse(file.originalname).ext}`;
  return await uploadPromise(filePath, file, fileName);
}

async function uploadFileBooking(id, oldPath, file) {
  const filePath = `document/booking-${id}/${path.parse(oldPath).name + path.parse(oldPath).ext}`
  const fileName = `document/booking-${id}/${crypto.randomBytes(20).toString('hex') + path.parse(file.originalname).ext}`;
  return await uploadPromise(filePath, file, fileName);
}

module.exports = {
	uploadImageUser,
	uploadFileBooking,
};
