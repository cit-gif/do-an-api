const express = require('express');
const router = express.Router();
const User = require('../../model/User');
const authMiddleware = require('../../middleware/auth');
const GroupProduct = require('../../model/GroupProduct');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const uploadAvatar = require('../../middleware/uploadAvatar');
const checkMagicNumbersImage = require('../../helper/CheackMagicNumberImage');
const fs = require('fs');
const path = require('path');
const HelperValidate = require('../../helper/validate');
const hashPassword = require('../../helper/hashPassOrCheck');
const HelperArray = require('../../helper/Array');
const sharp = require('sharp');
// var ObjectId = require("mongodb").ObjectID;

//#region Cart
router.post('/api/user/cart/add', authMiddleware.verifyTokenUser, async (req, res) => {
	const { Id_Product } = req.body;
	if (!ObjectId.isValid(Id_Product)) {
		return res.status(400).json({
			error: 400,
			message: 'Không tìm thấy sản phẩm',
		});
	}
	const _id = res.locals.payload._id;

	try {
		User.findById(_id, 'Cart', {}, async (err, user) => {
			if (!user) {
				if (err) {
					return res.status(500).json({
						error: 500,
						message: 'server error',
					});
				}
				return res.status(400).json({
					error: 400,
					message: 'Không tìm thấy người dùng',
				});
			}

			if (user) {
				// kiểm tra có id sản phẩm như vậy ko
				const product = await GroupProduct.findOne({ 'Product._id': ObjectId(Id_Product) }, { _id });
				if (!product) {
					return res.status(400).json({
						error: 400,
						message: 'Không tìm thấy sản phẩm',
					});
				}
				const cart = user.Cart;
				let check_exits_product_in_cart = false;
				let count_item_in_cart = cart.length;
				let index = 0;
				let position_product_exits = -1;
				for (index; index < count_item_in_cart; index++) {
					if (cart[index].Id_Product == Id_Product) {
						position_product_exits = index;
						check_exits_product_in_cart = true;
						break;
					}
				}
				if (!check_exits_product_in_cart) {
					// nếu chưa có
					user.Cart.push({ Id_Product, Amount: 1 });
					await user.save();
					return res.json({ Id_Product, Amount: 1 });
				} else {
					user.Cart[position_product_exits].Amount += 1;
					await user.save();
					return res.json(user.Cart[position_product_exits]);
				}
			}
		});
	} catch (error) {
		return res.status(500).json({
			error: 'server error',
		});
	}
});
// giảm số lượng sản phẩm
router.post('/api/user/cart/subtract', authMiddleware.verifyTokenUser, async (req, res) => {
	const { Id_Product } = req.body;
	if (!ObjectId.isValid(Id_Product)) {
		return res.status(400).json({
			error: 400,
			message: 'Không tìm thấy sản phẩm',
		});
	}
	const _id = res.locals.payload._id;

	try {
		User.findById(_id, 'Cart', {}, async (err, user) => {
			if (err) {
				return res.status(500).json({
					error: 500,
					message: 'server error',
				});
			}
			if (!user) {
				return res.status(400).json({
					error: 400,
					message: 'Không tìm thấy người dùng',
				});
			}

			if (user) {
				// kiểm tra có id sản phẩm như vậy ko
				const product = await GroupProduct.findOne({ 'Product._id': ObjectId(Id_Product) }, { _id });
				if (!product) {
					return res.status(400).json({
						error: 400,
						message: 'Không tìm thấy sản phẩm',
					});
				}
				const cart = user.Cart;
				let check_exits_product_in_cart = false;
				let count_item_in_cart = cart.length;
				let index = 0;
				let position_product_exits = -1;
				for (index; index < count_item_in_cart; index++) {
					if (cart[index].Id_Product == Id_Product) {
						position_product_exits = index;
						check_exits_product_in_cart = true;
						break;
					}
				}
				if (!check_exits_product_in_cart) {
					// nếu chưa có
					return res.status(400).json({
						error: 400,
						message: 'Không tìm thấy sản phẩm trong giỏ hàng',
					});
				}
				//nếu số lượng bằng 1 hì xóa luôn
				const Amount_product_in_cart = user.Cart[position_product_exits].Amount;
				if (Amount_product_in_cart == 1) {
					user.Cart.pull(user.Cart[position_product_exits]._id);
					await user.save();
					return res.json({ Id_Product, Amount: -1 });
				} else {
					user.Cart[position_product_exits].Amount = Amount_product_in_cart - 1;
					await user.save();
					return res.json(user.Cart[position_product_exits]);
				}
			}
		});
	} catch (error) {
		return res.status(500).json({
			error: 'server error',
		});
	}
});
router.post('/api/user/cart', authMiddleware.verifyTokenUser, async (req, res) => {
	try {
		//https://docs.mongodb.com/v4.0/reference/operator/aggregation/lookup/
		const Id_User = res.locals.payload._id;
		if (!ObjectId.isValid(Id_User)) {
			return res.status(400).json({
				error: 400,
				message: 'Không tìm thấy tài khoản',
			});
		}
		const result = await User.aggregate([
			{
				$match: {
					_id: ObjectId(Id_User),
				},
			},
			{ $unwind: '$Cart' },
			{
				$lookup: {
					from: 'groupproducts',
					let: { id_product: '$Cart.Id_Product' }, //tạo biến
					pipeline: [
						{ $unwind: '$Product' },
						{
							$match: {
								$expr: {
									//cho phép thực hiện tính toán
									$eq: ['$Product._id', '$$id_product'], //sủ dụng biến
								},
							},
						},
						{
							$lookup: {
								from: 'brands',
								localField: 'Brand',
								foreignField: '_id',
								as: 'brands',
							},
						},
						{
							$project: {
								Path: '$Product.Path',
								ProductName: '$Product.ProductName',
								DisplayImage: '$Product.Information.DisplayImage',
								Price: '$Product.Information.Price',
								PriceSale: '$Product.Information.PriceSale',
								RemainingAmount: '$Product.Information.RemainingAmount',
								BrandName: '$brands.BrandName',
								BrandImage: '$brands.BrandImage',
							},
						},
					],
					as: 'Product', //giá trị trả về
				},
			},
			{
				$project: {
					_id: 0,
					Id_Cart: '$Cart._id',
					Id_Product: '$Cart.Id_Product',
					ProductName: '$Product.ProductName',
					DisplayImage: '$Product.DisplayImage',
					Price: '$Product.Price',
					PriceSale: '$Product.PriceSale',
					Path: '$Product.Path',
					RemainingAmount: '$Product.RemainingAmount',
					Amount: '$Cart.Amount',
					BrandName: '$Product.BrandName',
					BrandImage: '$Product.BrandImage',
				},
			},
		]);

		res.json(result);
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: 'server error',
		});
	}
});
router.post('/api/user/cart/delete', authMiddleware.verifyTokenUser, async (req, res) => {
	const Id_Product = req.body.Id_Product;
	if (!Id_Product || !ObjectId.isValid(Id_Product)) {
		return res.status(400).json({
			error: 400,
			message: 'miss Id_Product',
		});
	}
	const Id_User = res.locals.payload._id;
	try {
		await User.findByIdAndUpdate(
			Id_User,
			{ $pull: { Cart: { Id_Product: Id_Product } } },
			{ safe: true, upsert: true }
		);
		res.json({ success: true });
	} catch (error) {
		res.status(500).json({ error: 'Đã xảy ra lỗi!' });
	}
});
// #endregion

router.post('/api/user/addEvaluate/:Id_Product', authMiddleware.verifyTokenUser, async (req, res) => {
	const Id_User = res.locals.payload._id;
	const Id_Product = req.params.Id_Product;
	const check_ready_evaluate = await GroupProduct.aggregate([
		{ $unwind: '$Product' },
		{
			$match: {
				'Product._id': ObjectId(Id_Product),
				'Product.Evaluate.Id_User': ObjectId(Id_User),
			},
		},
	]);
	if (check_ready_evaluate && check_ready_evaluate.length != 0) {
		return res.status(400).json({
			error: 400,
			message: 'Bạn đã đánh giá!',
		});
	}

	const newEvaluate = {
		Id_User: Id_User,
		Star: req.body.Star,
		ContentRated: req.body.ContentRated,
	};
	GroupProduct.findOneAndUpdate(
		{ 'Product._id': Id_Product },
		{ $push: { 'Product.$.Evaluate': newEvaluate } },
		{ upsert: true, new: true },
		function (err, doc) {
			if (err) {
				return res.status(500).json({
					error: 500,
					message: 'Not allowed',
				});
			}

			return res.json({
				...newEvaluate,
				Time: 'Vừa xong',
			});
		}
	);
});
router.post('/api/user/addComment/:Id_Product', authMiddleware.verifyTokenUser, async (req, res) => {
	//add comment : _id propduct _id user, Role.
	const Id_User = res.locals.payload._id;
	const Role = res.locals.payload.Role;
	const Id_Product = req.params.Id_Product;
	const CommentContent = req.body.CommentContent;
	if (!ObjectId.isValid(Id_Product)) {
		return res.status(400).json({
			error: 400,
			message: 'Không tìm thấy sản phẩm',
		});
	}

	const newComment = {
		Id_User: Id_User,
		Role: Role,
		CommentContent: CommentContent,
	};
	GroupProduct.findOneAndUpdate(
		{ 'Product._id': Id_Product },
		{ $push: { 'Product.$.Comment': newComment } },
		{ upsert: true, new: true },
		function (err, doc) {
			if (err) {
				return res.status(500).json({
					error: 500,
					message: 'Not allowed',
				});
			}

			return res.json({
				...newComment,
				Time: 'Vừa xong',
			});
		}
	);
});
router.post('/api/user/addReplyComment/:Id_Product', authMiddleware.verifyTokenUser, async (req, res) => {
	//add comment : _id propduct _id user, Role.
	const Id_User = res.locals.payload._id;
	const Role = res.locals.payload.Role;
	const Id_Product = req.params.Id_Product;
	const ReplyContent = req.body.ReplyContent;
	const Id_Comment = req.body.Id_Comment;
	if (!ObjectId.isValid(Id_Product) || !ObjectId.isValid(Id_Comment)) {
		return res.status(400).json({
			error: 400,
			message: 'Không tìm thấy sản phẩm',
		});
	}

	const newReply = {
		Id_User: Id_User,
		Role: Role,
		ReplyContent: ReplyContent,
	};
	// https://stackoverflow.com/questions/49095532/how-yo-use-arrayfilters-with-mongoose-5-x-x
	//https://jira.mongodb.org/browse/SERVER-831
	GroupProduct.findOneAndUpdate(
		{
			'Product._id': Id_Product,
			'Product.Comment._id': Id_Comment,
		},
		{
			$push: {
				'Product.$[idproduct].Comment.$[idcomment].Reply': newReply,
			},
		},
		{
			arrayFilters: [{ 'idproduct._id': ObjectId(Id_Product) }, { 'idcomment._id': ObjectId(Id_Comment) }],
			upsert: true,
			new: true,
		},
		function (err, doc) {
			if (err) {
				console.log(err.message);
				return res.status(500).json({
					error: 500,
					message: 'Not allowed',
				});
			}

			return res.json({
				...newReply,
				ReplyTime: 'Vừa xong',
			});
		}
	);
});
//get profile
router.post('/api/user/profile', authMiddleware.verifyTokenUser, async (req, res) => {
	const getUser = async _id => {
		try {
			const user = await User.findById(_id).select({
				_id: 1,
				Avatar: 1,
				Name: 1,
				PhoneNumber: 1,
				Address: 1,
			});
			if (user) {
				return res.json(user);
			} else {
				res.status(400).json({
					error: 'not found user',
				});
			}
		} catch (error) {
			console.log(error);
			res.status(500).json({
				error: 'server error',
			});
		}
	};
	getUser(res.locals.payload._id);
});
//edit profile
router.post('/api/user/profile/edit/profile', authMiddleware.verifyTokenUser, async (req, res) => {
	try {
		const Id_User = res.locals.payload._id;
		const update = { Avatar: '', Name: '' };
		await uploadAvatar(req, res);
		if (req.file) {
			const pathAvatar = path.join(__dirname, '../../public/backend/user/avatar', req.file.filename);
			const bitmap = fs.readFileSync(pathAvatar).toString('hex', 0, 4);
			if (checkMagicNumbersImage(bitmap) === false) {
				fs.unlinkSync(pathAvatar);
				return res.status(400).json({
					error: 400,
					message: 'Chỉ hỗ trợ định dạng jpg, png, jpeg!',
				});
			}
			sharp(req.file.path)
				.resize(200, 200, { fit: 'cover' })
				.toBuffer((err, buffer) => {
					if (err) throw err;
					fs.writeFile(req.file.path, buffer, e => {
						if (e) throw e;
					});
				});
			update.Avatar = '/backend/user/avatar/' + req.file.filename;
		}
		const UserName = req.body.Name;
		if (UserName) {
			if (UserName.trim().length >= 3) {
				update.Name = UserName;
			} else {
				return res.status(400).json({
					error: 400,
					message: 'Tên phải 3 kí tự trở lên!',
				});
			}
		} else {
			return res.status(400).json({
				error: 400,
				message: 'Tên không được để trống!',
			});
		}
		if (update.Avatar == '') {
			delete update.Avatar;
		}
		const user = await User.findByIdAndUpdate(
			Id_User,
			{ ...update },
			{ safe: true, upsert: true, new: true }
		).select({
			_id: 0,
			Avatar: 1,
			Name: 1,
		});
		res.status(200).json(user);
	} catch (error) {
		console.log(error);
		if (error.code == 'LIMIT_FILE_SIZE') {
			return res.status(500).send({
				message: 'File size cannot be larger than 2MB!',
			});
		}
		res.status(500).json({
			// message: `Could not upload the file: ${req.file.originalname}. ${error}`,
			message: error.message || 'Đã xảy ra lỗi. Vui lòng kiểm tra lại!',
		});
	}
});
router.post('/api/user/profile/edit/address', authMiddleware.verifyTokenUser, async (req, res) => {
	try {
		const { error } = await HelperValidate.addressUser(req.body);
		if (error) {
			return res.status(400).json({
				error: 400,
				message: 'Vui lòng kiểm tra lại thông tin!',
			});
		}
		const Id_User = res.locals.payload._id;
		const user = await User.findByIdAndUpdate(
			Id_User,
			{ Address: req.body },
			{ safe: true, upsert: true, new: true }
		).select({
			Address: 1,
		});
		res.status(200).json(user);
	} catch (error) {
		res.status(500).send({
			// message: `Could not upload the file: ${req.file.originalname}. ${error}`,
			message: 'Đã xảy ra lỗi. Vui lòng kiểm tra lại!',
		});
	}
});
router.post('/api/user/profile/edit/password', authMiddleware.verifyTokenUser, async (req, res) => {
	try {
		const { error } = await HelperValidate.changePassword(req.body);
		if (error) {
			return res.status(400).json({
				error: 400,
				message: 'Vui lòng kiểm tra lại thông tin!',
			});
		}
		const { NewPassword, OldPassword, RetypePassword } = req.body;
		if (NewPassword == OldPassword) {
			return res.status(400).json({
				error: 400,
				message: 'Mật khẩu mới trùng mật khẩu cũ!',
			});
		}
		if (NewPassword !== RetypePassword) {
			return res.status(400).json({
				error: 400,
				message: 'Nhập lại mật khẩu không đúng!',
			});
		}
		const Id_User = res.locals.payload._id;
		User.findById(Id_User, 'Password', {}, async (err, doc) => {
			if (err) {
				return res.status(500).json({
					message: 'Đã xảy ra lỗi!',
				});
			}
			const checkPassword = await hashPassword.check(OldPassword, doc.Password);

			if (checkPassword) {
				const NewPasswordHash = await hashPassword.hash(NewPassword);
				doc.Password = NewPasswordHash;
				await doc.save();
				return res.json({
					message: 'Đổi mật khẩu thành công!',
				});
			}
			return res.status(400).json({
				error: 400,
				message: 'Mật khẩu cũ không chính xác!',
			});
		});
	} catch (error) {
		res.status(500).json({
			// message: `Could not upload the file: ${req.file.originalname}. ${error}`,
			message: 'Đã xảy ra lỗi. Vui lòng kiểm tra lại!',
		});
	}
});
// payment
router.post('/api/user/payment', authMiddleware.verifyTokenUser, async (req, res) => {
	const userPayment = async Id_User => {
		try {
			const { Name, Address, PhoneNumber } = req.body;
			// khi thanh toán thì thanh toán tất cả các sản phẩm còn hàng

			const { error } = await HelperValidate.userPayment({
				Name,
				Address,
				PhoneNumber,
			});
			if (error) {
				return res.status(400).json({
					error: 400,
					message: 'Vui lòng kiểm tra lại thông tin trước khi đặt hàng!',
				});
			}
			User.findById(Id_User, 'Cart ShoppingHistory Name', {}, async (err, doc) => {
				if (err) {
					return res.status(500).json({
						message: 'Đã xảy ra lỗi!',
					});
				}
				// nếu giỏ hàng không có sản phẩm mà người dùng thanh toán
				if (doc.Cart.length === 0) {
					return res.status(400).json({
						message: 'Không có sản phẩm trong giỏ hàng!',
					});
				}
				// lấy nhưng sản phẩm có trong bảng sản phẩm
				// từ id sản phẩm của giỏ hàng
				const products = await GroupProduct.aggregate([
					{ $unwind: '$Product' },
					{
						$match: {
							'Product._id': {
								$in: [...doc.Cart.map(item => item.Id_Product)], // get array id product
							},
						},
					},
					{
						$lookup: {
							from: 'brands',
							localField: 'Brand',
							foreignField: '_id',
							as: 'brands',
						},
					},
					{
						$project: {
							_id: 0,
							Id_Product: '$Product._id',
							ProductName: '$Product.ProductName',
							BrandImage: {
								$first: '$brands.BrandImage',
							},
							BrandName: {
								$first: '$brands.BrandName',
							},
							Id_Brand: {
								$first: '$brands._id',
							},
							ProductType: '$ProductType',
							Price: '$Product.Information.Price',
							DisplayImage: '$Product.Information.DisplayImage',
							Configuration: '$Product.Information.Configuration',
							RemainingAmount: '$Product.Information.RemainingAmount',
							Path: '$Product.Path',
							PriceSale: '$Product.Information.PriceSale',
						},
					},
				]);

				// nếu không có
				if (products.length === 0) {
					return res.status(500).json({
						error: 500,
						message: 'server not found ',
					});
				}
				//lấy những sản phẩm còn Hàng

				// kết quả của mongodb còn có những phương thức khác
				// hợp nhất hai bảng
				// lấy giá tiền từ bảng sản phẩm

				let merged = [];
				let newArrayCart = []; // giỏ hàn của user

				const productLength = products.length;
				const cartLength = doc.Cart.length;
				let i = 0;
				for (i; i < productLength; i++) {
					let j = 0;
					for (j; j < cartLength; j++) {
						if (products[i].Id_Product.equals(doc.Cart[j].Id_Product)) {
							// không thể so sánh trực tiếp ID của mongoodb
							//https://stackoverflow.com/questions/11637353/comparing-mongoose-id-and-strings
							// id trong giỏ hàng cũng có trong bảng product và sô lượng sản phẩm lớn lớn 0
							// chỉ thanh toán nhưng đơn hàng còn hàng và số lượng mua của đơn hàng ko vượt quá số lượng trong kho
							if (
								products[i].RemainingAmount > 0 &&
								products[i].RemainingAmount >= doc.Cart[j].Amount
							) {
								merged.push({
									...products[i],
									...doc.Cart[j]._doc,
								});
								// bớt số lượng sản phẩm trong bảng sản phẩm
								// tăng số lượn bán
								const amountProduct = parseInt(doc.Cart[j].Amount);
								await GroupProduct.findOneAndUpdate(
									{
										'Product._id': products[i].Id_Product,
									},
									{
										$inc: {
											'Product.$[idproduct].Information.RemainingAmount':
												-amountProduct, // giảm số luowuonjg trong kho -- cộng cho âm

											'Product.$[idproduct].ProductSold': amountProduct,
										},
									},
									{
										arrayFilters: [
											{
												'idproduct._id': ObjectId(
													products[i].Id_Product
												),
											},
										],
									}
								).lean();
							} else {
								newArrayCart.push(doc.Cart[j].Id_Product);
							}
						}
					}
				}

				// tính tông tiền
				const totalMoney = merged.reduce((previousValue, currentValue, index) => {
					const priceProduct =
						currentValue.PriceSale > 0 ? currentValue.PriceSale : currentValue.Price;
					previousValue += priceProduct * currentValue.Amount;
					return previousValue;
				}, 0);
				const Id_Order = new ObjectId();
				const newPayment = {
					_id: Id_Order,
					Name: Name,
					PhoneNumber: PhoneNumber,
					Address: {
						...Address,
					},
					Products: [...merged],

					Status: 'Giao thành công!',
					TotalMoney: totalMoney,
				};
				// thêm lịch sử mua hàng mới cho người dùng
				doc.ShoppingHistory.push(newPayment);
				// gửi socket cho admin
				arraySocketIdOfAdmin.forEach(socketIdAdmin => {
					io.of('/chat').to(socketIdAdmin).emit('userPayment', newPayment);
				});
				// set lại giỏ hàng của người dùng
				// lấy ra những sãn phẩm chua được thanh toán
				doc.Cart = doc.Cart.filter(item => newArrayCart.includes(item.Id_Product));
				// set lại số lượng sản phẩm trong giỏ hàng
				await doc.save();
				return res.status(200).json({
					success: true,
					Id_Order,
					Cart: doc.Cart,
				});
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({
				error: 'server error',
			});
		}
	};
	userPayment(res.locals.payload._id);
});
router.get('/api/user/shoppingHistory', authMiddleware.verifyTokenUser, async (req, res) => {
	try {
		const Id_User = res.locals.payload._id;
		const history = await User.aggregate([
			{ $match: { _id: ObjectId(Id_User) } },
			{ $unwind: '$ShoppingHistory' },
			{
				$project: {
					_id: 0,
					Id_History: '$ShoppingHistory._id',
					Time: '$ShoppingHistory.Time',
					TotalMoney: '$ShoppingHistory.TotalMoney',
					Status: '$ShoppingHistory.Status',
				},
			},
			{
				$sort: {
					Time: -1,
				},
			},
		]);
		res.json(history);
	} catch (error) {
		res.status(500).json({ error: 500, message: 'server error' });
	}
});
router.get('/api/user/shoppingHistory/:Id_History', authMiddleware.verifyTokenUser, async (req, res) => {
	try {
		const Id_History = req.params.Id_History;
		console.log(ObjectId(Id_History));
		const Id_User = res.locals.payload._id;
		const historyDetails = await User.aggregate([
			{ $match: { _id: ObjectId(Id_User) } },
			{ $unwind: '$ShoppingHistory' },
			{
				$match: {
					'ShoppingHistory._id': ObjectId(Id_History),
				},
			},
			{ $project: { _id: 0, ShoppingHistory: 1 } },
		]);

		res.json(historyDetails);
	} catch (error) {
		res.status(500).json({ error: 500, message: 'server error' });
	}
});
module.exports = router;
