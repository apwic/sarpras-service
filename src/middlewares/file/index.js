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

let uploadFile = multer({
	storage: storage,
	limits: { fileSize: maxSize },
}).single('image');

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
