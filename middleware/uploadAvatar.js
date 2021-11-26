const util = require('util');
const multer = require('multer');
const path = require('path');
const maxSizeAvatar = process.env.LIMIT_SIZE_AVATAR_USER; //mb

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join('public/backend/user/avatar'));
	},
	filename: (req, file, cb) => {
		const Id_User = req.locals.payload._id;
		const fileType = file.mimetype.split('/')[1];
		cb(null, Id_User + '.' + fileType);
	},
});
const uploadFile = multer({
	storage: storage,
	limits: {
		files: maxSizeAvatar,
	},
	fileFilter: (req, file, cb) => {
		if (
			file.mimetype == 'image/png' ||
			file.mimetype == 'image/jpg' ||
			file.mimetype == 'image/jpeg'
		) {
			cb(null, true);
		} else {
			cb(null, false);
			return cb(new Error('Chấp nhận định dạng .png  .jpg .jpeg'));
		}
	},
}).single('Avatar');
const uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
