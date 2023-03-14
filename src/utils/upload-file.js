const uploadPromise = require('../clients/google-cloud-storage/index');
const path = require('path');

async function uploadImageUser(oldPath, file) {
  const filePath = `image/user/${path.parse(oldPath).name + path.parse(oldPath).ext}`
  const fileName = `image/user/${file.originalname.replace(/ /g, '_')}`;
  return await uploadPromise(filePath, file, fileName);
}

async function uploadFileBooking(id, oldPath, file) {
  const filePath = `document/booking-${id}/${path.parse(oldPath).name + path.parse(oldPath).ext}`
  const fileName = `document/booking-${id}/${file.originalname.replace(/ /g, '_')}`;
  return await uploadPromise(filePath, file, fileName);
}

module.exports = {
	uploadImageUser,
	uploadFileBooking,
};
