const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

const Admin = new Schema(
	{
		DisplayName: {
			type: String,
			required: true,
		},
		UserName: {
			type: String,
			unique: true,
			required: true,
		},
		Password: {
			type: String,
			maxlength: [100, 'Mật khẩu tối đa 100 kí tự'],
			minlength: [8, 'Mật khẩu tối thiểu 8 kí tự'],
			require: [true, 'Mật khẩu là bắt buộc'],
		},
		Avatar: {
			type: String,
			default: '',
		},
	},
	{
		timestamps: true,
	},
);
Admin.path('UserName').validate(async value => {
	var checkUnique = await mongoose.models.Admin.findOne({
		UserName: value,
	});
	return !checkUnique;
}, 'Tên đăng nhập đã tồn tại');
module.exports = model('Admin', Admin);
