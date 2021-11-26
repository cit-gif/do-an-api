const util = require('util');
const multer = require('multer');
const path = require('path');
const maxSizeAvatar = process.env.LIMIT_SIZE_AVATAR_USER; //mb

const uuid = require('uuid');
const uploadFileMiddleware = async (req, res, { typeProduct, pathSaveImage, fileName, nameRequestBodyOfImage }) => {
	/**
	 * vì path của tưng loại sản phẩm khác nhau
	 */
	const storage = multer.diskStorage({
		destination: (req, file, cb) => {
			switch (typeProduct) {
				case 'phone':
					cb(null, path.join(pathSaveImage));
					break;
				case 'tablet':
					cb(null, path.join(pathSaveImage));
					break;
			}
		},
		filename: (req, file, cb) => {
			// const Id_User = req.locals.payload._id;
			const fileType = file.mimetype.split('/')[1];
			cb(null, fileName + '.' + fileType);
		},
	});
	const upload = multer({
		storage: storage,
		limits: {
			files: maxSizeAvatar,
		},
		fileFilter: (req, file, cb) => {
			if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
				cb(null, true);
			} else {
				cb(null, false);
				return cb(new Error('Chấp nhận định dạng .png  .jpg .jpeg'));
			}
		},
	}).single(nameRequestBodyOfImage);
	return await util.promisify(upload)(req, res);
};

module.exports = uploadFileMiddleware;
