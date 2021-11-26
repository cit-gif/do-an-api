require('dotenv/config');
const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');
mongoose.Promise = global.Promise;
const arrayUniquePlugin = require('mongoose-unique-array');
(async () => {
	await mongoose.connect(
		'mongodb://localhost:27017/phonex',
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true,
		},
		err => {
			if (!err) {
				console.log('MongoDB Connection Succeeded.');
			} else {
				console.log('Error in DB connection: ' + err);
			}
		},
	);
	const sanPham = new Schema({
		Ten: {
			type: String,
			unique: true,
		},
		Date: {
			type: Date,
			default: Date.now,
		},
	});
	const NhomSanPham = model(
		'NhomSanPham',
		new Schema({
			Ten: {
				unique: true,
				type: String,
			},
			SanPham: {
				type: [sanPham],
				default: undefined,
			},
		}),
	);
	const c1 = new NhomSanPham({
		Ten: '331d',
		SanPham: [
			{
				Ten: 'fd1d',
			},
		],
	});
	await c1.save((er, doc) => {
		if (er) console.log(er);
		console.log(`doc`, doc);
	});
	const f = await NhomSanPham.findOne({ Ten: '331d' });

	f.save((er, doc) => {
		if (er) {
			console.log(er);
		} else {
			console.log(doc);
		}
	});
})();
(async () => {
	// await mongoose.connect(
	// 	"mongodb://localhost:27017/phonex",
	// 	{
	// 		useNewUrlParser: true,
	// 		useUnifiedTopology: true,
	// 		useFindAndModify: false,
	// 		useCreateIndex: true,
	// 	},
	// 	(err) => {
	// 		if (!err) {
	// 			console.log("MongoDB Connection Succeeded.");
	// 		} else {
	// 			console.log("Error in DB connection: " + err);
	// 		}
	// 	}
	// );
	// const obj = new Schema(
	// 	{
	// 		name: {
	// 			type: String,
	// 			unique: true,
	// 			index: true,
	// 		},
	// 		age: String,
	// 	},
	// 	{ timestamps: true }
	// );
	// const testSchema = new Schema(
	// 	{
	// 		gt: {
	// 			type: String,
	// 			unique: true,
	// 		},
	// 		arr: {
	// 			type: [obj],
	// 			default: undefined,
	// 		},
	// 	},
	// 	{ timestamps: true }
	// );
	// const testUnique = model("testModel", testSchema);
	// const c1 = new testUnique({
	// 	gt: "nama",
	// 	arr: [],
	// });
	// c1.arr.push({
	// 	name: "baa",
	// 	age: "19",
	// });
	// await c1.save((er, doc) => {
	// 	if (er) {
	// 		console.log(er.message);
	// 	}
	// 	console.log(doc);
	// });
	// a.arr.addToSet({ //Thêm giá trị vào mảng nếu chưa có nhưng không áp dụng được vs obj
	//vì nó có objectId thây đổi, nên không thể coi là trùng
	// 	name: "ba",
	// 	age: "23",
	// });
	//==============================================================================================
	// Nếu trong obj.name có unique = true thì collection sẽ không insert , và update được
	// nhưng trong document sẽ insert đc
	// vì vậy khi ta muốn "khong trùng lặp"trong document thì trướckhi thêm hoặc update ta phải check array
	// var a = await testUnique.findById("60aa1e7dbd399d1ad4daac3d");
	// // console.log(a.arr);
	// let b = a.arr.find((item) => item.name == "bas");
	// if (!b) {
	// 	console.log("true");
	// } else {
	// 	console.log("false");
	// }
	// console.log("find", b);
	// if (b.length === 0) {
	// 	console.log("oke");
	// } else {
	// 	console.log("not oke");
	// }
	// await a.save((err, doc) => {
	// 		if (err) {
	// 			console.log(err);
	// 		}
	// 		console.log(doc);
	// 	});
})();
