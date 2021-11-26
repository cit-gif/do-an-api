const { Schema, model } = require('mongoose');
//mặc định người nhận là : admin

const TroChuyenTuVan = new Schema({
	IdNguoiDung: {
		type: Schema.Types.ObjectId,
		unique: true,
	},
	NoiDung: {
		type: [
			{
				IdNguoiGui: String,
				NoiDungTinNhan: String,
				ThoiGian: {
					type: Date,
					default: Date.now,
				},
			},
		],
		default: [],
	},
});
module.exports = model('TroChuyenTuVan', TroChuyenTuVan);
