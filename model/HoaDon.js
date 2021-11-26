const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

const mau = [{ mauSac: 'vàng', gia: 1000, hinhanh: ['a', 'b', 'c'] }];
const hoadon = [
	{
		//một hóa đơn cho một khách hàng
		//khách hàng có thể có nhiều hóa đơn
		//một hóa đơn có nhiều sản phẩm
		// một sản phẩm có số lượn
		id: 1,
		idkhachhang: 1,
		sanphamban: [
			{
				idsanpham: 2,
				ten: 'a',
				gia: 3000,
				'mẫu mã': 'màu vàng/ 8g/128gb',
			},
		],
		makhuyenmai: {
			appdung: true,
			ma: 122,
			tiengiam: 300,
		},
		thanhtien: 1000,
	},
];

const HoaDon = new Schema(
	{
		IdNguoiDung: Schema.Types.ObjectId,
		SanPham: {
			type: [
				{
					IdSanPham: Schema.Types.ObjectId,
					TenSanPham: String,
					DuongDan: String,

					Gia: Number,
					Soluong: Number,
					TuyChon: String,
				},
			],
			require: true,
		},

		ThanhTien: Number,
		HinhThucThanhToan: String,
	},
	{
		timestamps: true,
	},
);
HoaDon.path('Ten').validate(async value => {
	var checkUnique = await mongoose.models.HoaDon.findOne({ Ten: value });
	return !checkUnique;
}, 'Tên đã tồn tại');
module.exports = model('HoaDon', HoaDon);
