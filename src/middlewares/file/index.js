const util = require('util');
const multer = require('multer');
const maxSize = 64 * 1024 * 1024;

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'image') {
        if (
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/heic'
        ) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    } else if (file.fieldname === 'video') {
        if (
            file.mimetype === 'video/3gpp' ||
            file.mimetype === 'video/quicktime' ||
            file.mimetype === 'video/x-msvideo' ||
            file.mimetype === '	video/x-ms-wmv'
        ) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    } else if (file.fieldname === 'file') {
        if (
            file.mimetype === 'application/pdf' ||
            file.mimetype === 'application/msword' ||
            file.mimetype ===
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    } else {
        cb(null, false);
    }
};

let uploadFileMulter = multer({
    limits: {
        fileSize: maxSize,
    },
    fileFilter: fileFilter,
}).fields([
    {
        name: 'image',
        maxCount: 10,
    },
    {
        name: 'video',
        maxCount: 10,
    },
    {
        name: 'file',
        maxCount: 10,
    },
]);

const uploader = util.promisify(uploadFileMulter);

const fileParser = (req, res, next) => {
    if (req.files.file) {
        req.body.file = req.files.file;
    }

    if (req.files.image) {
        req.body.image = req.files.image;
    }

    if (req.files.video) {
        req.body.video = req.files.video;
    }

    next();
};

const uploadFile = [uploader, fileParser];

module.exports = { uploadFile };
