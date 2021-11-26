const util = require('util');
const multer = require('multer');
const path = require('path');
const maxSizeImage = 3000; // mb
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join('public/backend/post'));
	},
	filename: (req, file, cb) => {
		const fileType = file.mimetype.split('/')[1];
		cb(null, uuidv4().replaceAll('-', '') + '.' + fileType);
	},
});
const uploadFile = multer({
	storage: storage,
	limits: {
		files: maxSizeImage,
	},
	fileFilter: (req, file, cb) => {
		if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
			cb(null, true);
		} else {
			cb(null, false);
			return cb(new Error('Chấp nhận định dạng .png  .jpg .jpeg'));
		}
	},
}).single('image');
const uploadImage = util.promisify(uploadFile);
module.exports = uploadImage;
