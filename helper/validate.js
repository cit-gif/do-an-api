const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const registerValidator = async data => {
	const Schema = Joi.object({
		// name: Joi.string()
		// 	.regex(/^[a-zA-Z0-9]{3,50}$/)
		// 	.required(),
		Name: Joi.string().min(3).max(50).required(),
		PhoneNumber: Joi.string()
			.regex(/^[0-9]{10,10}$/)
			.required(),
		Password: Joi.string().min(8).required(),
	});
	try {
		return await Schema.validateAsync(data);
	} catch (error) {
		return {
			error,
		};
	}
};
const loginValidator = async data => {
	const Schema = Joi.object({
		PhoneNumber: Joi.string()
			.regex(/^[0-9]{10,10}$/)
			.required(),
		Password: Joi.string().min(8).required(),
	});
	try {
		return await Schema.validateAsync(data);
	} catch (error) {
		return {
			error,
		};
	}
};
const registerValidatorAdmin = async data => {
	const Schema = Joi.object({
		Ten: Joi.string().min(3).max(50).required(),
		TenDangNhap: Joi.string().required(),
		MatKhau: Joi.string().min(8).required(),
	});
	try {
		return await Schema.validateAsync(data);
	} catch (error) {
		return {
			error,
		};
	}
};
const loginValidatorAdmin = async data => {
	const Schema = Joi.object({
		UserName: Joi.string().min(2).required(),
		Password: Joi.string().min(8).required(),
	});
	try {
		return await Schema.validateAsync(data);
	} catch (error) {
		return {
			error,
		};
	}
};
const addressUser = async data => {
	const Schema = Joi.object({
		City: Joi.string().min(3).required(),
		District: Joi.string().min(3).required(),
		Wards: Joi.string().min(3).required(),
		Details: Joi.string().min(3).required(),
	});
	try {
		return await Schema.validateAsync(data);
	} catch (error) {
		return {
			error,
		};
	}
};
const changePassword = async data => {
	const Schema = Joi.object({
		NewPassword: Joi.string().min(8).required(),
		OldPassword: Joi.string().min(8).required(),
		RetypePassword: Joi.string().min(8).required(),
	});
	try {
		return await Schema.validateAsync(data);
	} catch (error) {
		return {
			error,
		};
	}
};
const userPayment = async data => {
	const Schema = Joi.object({
		Name: Joi.string().min(3).max(50).required(),
		PhoneNumber: Joi.string()
			.regex(/^[0-9]{10,10}$/)
			.required(),
		Address: {
			City: Joi.string().min(3).max(150).required(),
			District: Joi.string().min(3).max(150).required(),
			Wards: Joi.string().min(3).max(150).required(),
			Details: Joi.string().min(3).max(150).required(),
		},
	});
	try {
		return await Schema.validateAsync(data);
	} catch (error) {
		return {
			error,
		};
	}
};
const editUser = async data => {
	const Schema = Joi.object({
		Name: Joi.string().min(3).max(50).required(),
		PhoneNumber: Joi.string()
			.regex(/^[0-9]{10,10}$/)
			.required(),
		Address: {
			City: Joi.string().allow(''),
			District: Joi.string().allow(''),
			Wards: Joi.string().allow(''),
			Details: Joi.string().allow(''),
		},
		Password: Joi.string().min(8),
	});
	try {
		return await Schema.validateAsync(data);
	} catch (error) {
		return {
			error,
		};
	}
};
const groupProduct = async data => {
	const Schema = Joi.object({
		GroupName: Joi.string().min(1).max(150).required(),
		ProductType: Joi.string().valid('phone', 'tablet').required(),
		Brand: Joi.objectId(),
		Describe: {
			deltaOps: Joi.object().required(),
			html: Joi.string().required(),
		},
	});
	try {
		return await Schema.validateAsync(data);
	} catch (error) {
		return {
			error,
		};
	}
};
module.exports = {
	registerValidator,
	loginValidator,
	loginValidatorAdmin,
	registerValidatorAdmin,
	addressUser,
	changePassword,
	userPayment,
	editUser,
	groupProduct,
};
