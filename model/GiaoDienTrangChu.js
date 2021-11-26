const { Schema, model } = require('mongoose');

const GiaoDienTrangChu = new Schema(
	{
		TuyChinhDienThoaiBanChay: {
			type: Boolean,
			default: false,
		},
		TuyChinhDienThoaiNoiBat: {
			type: Boolean,
			default: false,
		},
		TuyChinhTabletNoiBat: {
			type: Boolean,
			default: false,
		},
		DienThoaiBanChay: {
			type: [
				{
					IdSanPhamDienThoai: String,
				},
			],
			default: [],
		},
		DienThoaiNoiBat: {
			type: [{ IdSanPhamDienThoai: String }],
			default: [],
		},
		TabletNoiBat: {
			type: [{ IdSanPhamTablet: String }],
			default: [],
		},
	},
	{
		timestamps: true,
	},
);

module.exports = model('GiaoDienTrangChu', GiaoDienTrangChu);
