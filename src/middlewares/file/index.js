const util = require('util');
const multer = require('multer');
const maxSize = 64 * 1024 * 1024;
const directoryPath = '/../public/uploads';

let storage = multer.memoryStorage({
	destination: (req, file, cb) => {
		cb(null, __basedir + directoryPath);
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});

let uploadSingle = multer({
	storage: storage,
	limits: { fileSize: maxSize },
}).single('file');

let uploadMultiple = multer({
	storage: storage,
	limits: { fileSize: maxSize },
}).array('file', 10);

let uploadSingleFile = util.promisify(uploadSingle);
let uploadMultipleFile = util.promisify(uploadMultiple);
module.exports = {
	uploadSingleFile,
	uploadMultipleFile,
};
