const util = require('util');
const multer = require('multer');
const path = require('path');
const maxSizeAvatar = process.env.LIMIT_SIZE_AVATAR_USER; //mb

const { v4: uuid } = require('uuid');

const uploadImageCreateProductMiddleware = async (req, res, { typeProduct, fileName }) => {
	/**
	 * vì path của tưng loại sản phẩm khác nhau
	 */
	const storage = multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, path.join(`public/backend/${typeProduct}`));
		},
		filename: (req, file, cb) => {
			cb(null, fileName + '-' + uuid() + path.extname(file.originalname));
		},
	});
	const upload = multer({
		storage: storage,
		limits: {
			files: maxSizeAvatar,
		},
		fileFilter: (req, file, cb) => {
			var ext = path.extname(file.originalname);
			if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
				return cb(new Error('Chấp nhận định dạng .png  .jpg .jpeg'));
			}
			cb(null, true);
		},
	}).fields([
		{ name: 'Image', maxCount: 25 },
		{ name: 'DisplayImage', maxCount: 1 },
	]);
	return await util.promisify(upload)(req, res);
};

module.exports = uploadImageCreateProductMiddleware;
