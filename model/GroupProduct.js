const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');
const Comment = new Schema({
	Id_User: Schema.Types.ObjectId,
	CommentContent: String,
	Role: {
		type: String,
		default: 'user',
	},
	Reply: {
		type: [
			{
				Id_User: Schema.Types.ObjectId,
				ReplyContent: String,
				ReplyTime: {
					type: Date,
					default: Date.now,
				},
				Role: {
					type: String,
					default: 'user',
				},
			},
		],
		default: [],
	},
	Time: {
		type: Date,
		default: Date.now,
	},
});
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
const Evaluate = new Schema({
	Id_User: Schema.Types.ObjectId,
	Star: Number,
	ContentRated: String,
	Time: {
		type: Date,
		default: Date.now,
	},
});

const Product = new Schema(
	{
		ProductName: {
			type: String,
			unique: true,
			required: true,
			index: true,
			sparse: true, //bỏ qua trường null
		},
		Path: {
			type: String,
			required: true,
		},
		Information: {
			DisplayImage: String,
			Price: Number,
			PriceSale: Number,
			RemainingAmount: Number,
			Configuration: {
				type: Schema.Types.Array,
				default: [],
			},
		},

		Image: {
			type: [String],
			default: [],
		},
		Comment: {
			type: [Comment],
			default: [],
		},
		Evaluate: {
			type: [Evaluate],
			default: [],
		},
		Views: {
			type: Number,
			default: 0,
		},
		ProductSold: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	},
);

const GroupProduct = new Schema(
	{
		GroupName: {
			type: String,
			reuired: true,
			unique: true,
		},
		Brand: {
			type: Schema.Types.ObjectId,
			reuired: true,
		},
		ProductType: {
			type: String,
			reuired: true,
		},
		Product: {
			type: [Product],
			default: [],
		},
		Describe: {
			deltaOps: {
				type: Schema.Types.Mixed,
				default: {},
			},
			html: {
				type: String,
				default: '',
			},
		},
	},
	{
		timestamps: true,
	},
);
GroupProduct.index({ '$**': 'text' });
GroupProduct.path('GroupName').validate(async value => {
	var checkUnique = await mongoose.models.GroupProduct.findOne({
		GroupName: value,
	});
	return !checkUnique;
}, 'Tên nhóm đã tồn tại');

module.exports = model('GroupProduct', GroupProduct);
