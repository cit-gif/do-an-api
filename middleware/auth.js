const jwt = require('jsonwebtoken');
const {
	registerValidator,
	loginValidator,
	loginValidatorAdmin,
	registerValidatorAdmin,
} = require('../helper/validate');
const { createAccessTokenUser, createAccessTokenAdmin } = require('../helper/token');
const User = require('../model/User');
const Admin = require('../model/Admin');
const hashPassword = require('../helper/hashPassOrCheck');

const ROLE_ADMIN = 'admin';
const ROLE_USER = 'user';
const ERR_JWT_INVALID = 'invalid token';
const ERR_JWT_EXPIRED = 'jwt expired'; //hết hạn

//#region User
function sendToken(res, accessToken) {
	res.json({
		success: true,
		accessToken,
	});
}
async function loginUser(req, res, next) {
	const { error } = await loginValidator(req.body);
	if (error) {
		return res.status(400).json({
			error: {
				code: 400,
				message: error?.details?.[0]?.message,
			},
		});
	}
	const user = await User.findOne({ PhoneNumber: req.body.PhoneNumber });
	// user.
	if (user) {
		const checkPass = await hashPassword.check(req.body.Password, user.Password);
		if (checkPass) {
			const payload = {
				_id: user._id,
				Name: user.Name,
				Role: ROLE_USER,
				Avatar: user.Avatar,
			};
			const accessToken = createAccessTokenUser(payload);
			return sendToken(res, accessToken);
		}
		return res.status(400).json({
			error: {
				code: 400,
				message: 'Password không chính xác',
			},
		});
	}
	return res.json({
		error: {
			code: 400,
			message: 'Không tìm thấy tài khoản',
		},
	});
}
async function registerUser(req, res, next) {
	const { error } = await registerValidator(req.body);
	if (error) {
		return res.status(400).json({
			error: {
				code: 400,
				message: error?.details?.[0]?.message,
			},
		});
	}
	const newUser = req.body;
	const user = new User({
		Name: newUser.Name,
		PhoneNumber: newUser.PhoneNumber,
		Password: await hashPassword.hash(newUser.Password),
	});
	try {
		await user.save();
		// req.user = { ...newUser, createdAt: user.createdAt };
		// gửi socket cho admin
		arraySocketIdOfAdmin.forEach(socketIdAdmin => {
			io.of('/chat')
				.to(socketIdAdmin)
				.emit('user:create', {
					_id: user._id,
					Address: {
						City: '',
						District: '',
						Wards: '',
						Details: '',
					},
					Avatar: '',
					Name: user.Name,
					PhoneNumber: user.PhoneNumber,
					createdAt: user.createdAt,
				});
		});
		return res.status(201).json({ ...newUser, Avatar: '', createdAt: user.createdAt });
	} catch (err) {
		return res.status(400).json({
			error: {
				code: 400,
				message: err?.message?.split(': ')?.[2],
			},
		});
	}
}

async function loginAdmin(req, res, next) {
	const { error } = await loginValidatorAdmin(req.body);
	if (error) {
		return res.status(400).json({
			error: {
				code: 400,
				message: error?.details?.[0]?.message,
			},
		});
	}
	const user = await Admin.findOne({ UserName: req.body.UserName });
	// user.
	if (user) {
		const checkPass = await hashPassword.check(req.body.Password, user.Password);
		if (checkPass) {
			const payload = {
				_id: user._id,
				DisplayName: user.DisplayName,
				Role: ROLE_ADMIN,
				Avatar: user.Avatar,
			};
			const accessToken = createAccessTokenAdmin(payload);
			return sendToken(res, accessToken);
		}
		return res.status(400).json({
			error: {
				code: 400,
				message: 'Password không chính xác',
			},
		});
	}
	return res.status(400).json({
		error: {
			code: 400,
			message: 'Không tìm thấy tài khoản',
		},
	});
}
// switch user

async function verifyTokenUser(req, res, next) {
	const authorization = req.body.accessToken || req.headers['authorization'] || req.cookies.accessToken;
	const accessToken = authorization && authorization.split(' ')[1];
	if (accessToken == null)
		return res.status(400).json({
			message: 'Access token is required',
		});
	try {
		res.locals.payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_USER);
		req.locals = {};
		req.locals.payload = res.locals.payload;

		if (res.locals.payload.Role == ROLE_USER) {
			return next();
		} else {
			return res.status(400).json({
				message: 'Token không chính xác',
			});
		}
	} catch (error) {
		return res.status(400).json({
			message: 'Token không chính xác',
		});
	}
}
async function verifyTokenAdmin(req, res, next) {
	const authorization = req.body.accessToken || req.headers['authorization'] || req.cookies.accessToken;
	const accessToken = authorization && authorization.split(' ')[1];
	if (accessToken == null)
		return res.status(400).json({
			message: 'Access token is required',
		});
	try {
		res.locals.payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_ADMIN);
		if (res.locals.payload.Role == ROLE_ADMIN) {
			return next();
		} else {
			return res.status(400).json({
				message: 'Token không chính xác',
			});
		}
	} catch (error) {
		return res.status(400).json({
			message: 'Token không chính xác',
		});
	}
}
module.exports = {
	registerUser,
	loginUser,
	loginAdmin,
	verifyTokenUser,
	verifyTokenAdmin,
};
