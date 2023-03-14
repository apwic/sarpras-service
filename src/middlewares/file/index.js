const util = require('util');
const multer = require('multer');
const maxSize = 64 * 1024 * 1024;

const fileFilter = (req, file, cb) => {
	if (file.fieldname === 'image') {
		if (
			file.mimetype === 'image/png' ||
			file.mimetype === 'image/jpg' ||
			file.mimetype === 'image/jpeg'
		) {
			// check file type to be png, jpeg, or jpg
			cb(null, true);
		} else {
			cb(null, false); // else fails
		}
	} else if (file.fieldname === 'video') {
		if (
			file.mimetype === 'video/3gpp' ||
			file.mimetype === 'video/quicktime' ||
			file.mimetype === 'video/x-msvideo' ||
			file.mimetype === '	video/x-ms-wmv'
		) {
			// check file type to be png, jpeg, or jpg
			cb(null, true);
		} else {
			cb(null, false); // else fails
		}
	} else if (file.fieldname === 'file') {
		if (
			file.mimetype === 'application/pdf' ||
			file.mimetype === 'application/msword' ||
			file.mimetype ===
				'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
		) {
			// check file type to be pdf, doc, or docx
			cb(null, true);
		} else {
			cb(null, false); // else fails
		}
	} else {
		cb(null, false);
	}
};

let uploadFileMulter = multer({
	// storage: fileStorage,
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

const uploadFile = util.promisify(uploadFileMulter);
module.exports = uploadFile;
