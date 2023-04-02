const GCPStorageClient = require('../clients/google-cloud-storage/index');
const path = require('path');
const crypto = require('crypto');
const convert = require('heic-convert');

async function heicConvert(file) {
    file.buffer = await convert({
        buffer: file.buffer,
        format: 'JPEG',
        quality: 1,
    });

    file.mimetype = 'image/jpeg';
    file.originalname = 'sarpras.jpeg';
}

async function uploadImageUser(file) {
    if (file.mimetype === 'image/heic') {
        await heicConvert(file);
    }

    const fileName = `image/user/${
        crypto.randomBytes(20).toString('hex') +
        path.parse(file.originalname).ext
    }`;
    return await GCPStorageClient.uploadPromise(file, fileName);
}

async function uploadFileBooking(id, file) {
    const fileName = `document/booking-${id}/${
        crypto.randomBytes(20).toString('hex') +
        path.parse(file.originalname).ext
    }`;
    return await GCPStorageClient.uploadPromise(file, fileName);
}

async function uploadImageFacility(id, file) {
    if (file.mimetype === 'image/heic') {
        await heicConvert(file);
    }

    const fileName = `image/facility/facility-${id}/${
        crypto.randomBytes(20).toString('hex') +
        path.parse(file.originalname).ext
    }`;
    return await GCPStorageClient.uploadPromise(file, fileName);
}

async function deleteFile(filePath) {
    filePath = filePath.replace('https://storage.googleapis.com/sarpras/', '');

    return await GCPStorageClient.deletePromise(filePath);
}

async function uploadImageIssue(file) {
    if (file.mimetype === 'image/heic') {
        await heicConvert(file);
    }

    const fileName = `image/issue/${
        crypto.randomBytes(20).toString('hex') +
        path.parse(file.originalname).ext
    }`;
    return await GCPStorageClient.uploadPromise(file, fileName);
}

const ImageUserStorage = {
    upload: uploadImageUser,
    delete: deleteFile,
};

const FileBookingStorage = {
    upload: uploadFileBooking,
    delete: deleteFile,
};

const ImageFacilityStorage = {
    upload: uploadImageFacility,
    delete: deleteFile,
};

const ImageIssueStorage = {
    upload: uploadImageIssue,
    delete: deleteFile,
};

module.exports = {
    ImageUserStorage,
    FileBookingStorage,
    ImageFacilityStorage,
    ImageIssueStorage,
};
