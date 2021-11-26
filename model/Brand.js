const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');
const Brand = new Schema(
	{
		BrandName: {
			type: String,
			unique: true,
			index: true,
		},
		BrandImage: {
			type: String,
			default: '',
		},
	},
	{
		timestamps: true,
	},
);
// Brand.set("validateBeforeSave", false);
Brand.path('BrandName').validate(async value => {
	var checkUnique = await mongoose.models.Brand.findOne({
		BrandName: value,
	});
	return !checkUnique;
}, 'Tên thương hiệu đã tồn tại');
module.exports = model('Brand', Brand);
