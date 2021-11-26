const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');
const Messenger = new Schema({
	Id_User: Schema.Types.ObjectId,
	MessengerContent: String,
	Role: {
		type: String,
		default: 'user',
	},
	Time: {
		type: Date,
		default: Date.now,
	},
});
const User = new Schema(
	{
		Name: {
			type: String,
			required: true,
		},

		PhoneNumber: {
			type: String,
			unique: true,
			required: true,
			min: [10, 'Số điện thoaị phải 10 kí tự'],
			max: [10, 'Số điện thoaị phải 10 kí tự'],
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

		Address: {
			City: {
				type: String,
				default: '',
			},
			District: {
				type: String,
				default: '',
			},

			Wards: {
				type: String,
				default: '',
			},
			Details: {
				type: String,
				default: '',
			},
		},
		Notification: {
			type: Array,
			default: [],
		},
		Message: {
			type: [Messenger],
			default: [],
		},
		TimeMessageUpdate: {
			type: Date,
			default: Date.now,
		},
		Cart: {
			type: [
				{
					Id_Product: Schema.Types.ObjectId,
					Amount: Number,
				},
			],
			default: [],
		},
		ShoppingHistory: {
			type: [
				{
					Name: String,
					PhoneNumber: String,
					Address: {
						City: String,
						District: String,
						Wards: String,
						Details: String,
					},
					Products: [
						{
							Id_Product: Schema.Types.ObjectId,
							ProductName: String,
							Path: String,
							BrandImage: String,
							BrandName: String,
							Id_Brand: Schema.Types.ObjectId,
							Amount: Number,
							Price: Number,
							PriceSale: Number,
							DisplayImage: String,
							Configuration: Array,
							ProductType: String,
						},
					],
					Time: {
						type: Date,
						default: Date.now,
					},
					Status: String,
					TotalMoney: Number,
				},
			],
			default: [],
		},
		LastTimeActive: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	},
);

User.path('PhoneNumber').validate(async value => {
	var checkUnique = await mongoose.models.User.findOne({
		PhoneNumber: value,
	});
	return !checkUnique;
}, 'Số điện thoại đã tồn tại');
module.exports = model('User', User);
