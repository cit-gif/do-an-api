const express = require('express');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const router = express.Router();
const GroupProduct = require('../../model/GroupProduct');
const formatQuery = module.require('../../helper/formatQuery');
const get_params_or_query_limit = require('../../helper/get_params_or_query_limit');
// láy thông tin danh sách sản phẩm đã xem bằng id
const findProductViewed = async (req, res) => {
	// console.log()
	if (Array.isArray(req.body) == false) {
		return res.status(400).send('Thông tin không hợp lệ');
	}
	const arrayIdProduct = req.body.map(idProduct => {
		if (ObjectId.isValid(idProduct)) return ObjectId(idProduct);
	});
	const limit = 50; //tối đa 50 sản phẩm
	try {
		const result = await GroupProduct.aggregate([
			{ $unwind: '$Product' },
			{
				$match: {
					'Product._id': { $in: arrayIdProduct },
				},
			},
			// { $sort:  },
			{ $limit: limit },
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
					ProductName: '$Product.ProductName',
					Price: '$Product.Information.Price',
					DisplayImage: '$Product.Information.DisplayImage',
					Path: '$Product.Path',
					PriceSale: '$Product.Information.PriceSale',
					RemainingAmount: '$Product.Information.RemainingAmount',
					Id_Product: '$Product._id',
					BrandImage: '$brands.BrandImage',
					BrandName: '$brands.BrandName',
					ProductType: '$ProductType',
					CountEvaluate: { $size: '$Product.Evaluate' },
					// "loaisanphams.Ten": 1,
					Star: { $avg: '$Product.Evaluate.Star' },
				},
			},
		]);

		if (result.length !== 0) {
			return res.status(200).json(result);
		}

		return res.status(500).json({
			error: 'Server not found',
		});
	} catch (error) {
		return res.status(500).json({
			error: 'server error',
		});
	}
};
router.post('/api/products/productViewed', (req, res) => {
	findProductViewed(req, res);
});
const find = async (req, res, type, sortby, limit = 5) => {
	try {
		if (isNaN(limit) || limit < 0) {
			return res.status(400).json({
				error: 'Invalid limit',
			});
		}

		limit = parseInt(limit);
		const sort = {
			[sortby]: -1,
		};

		const result = await GroupProduct.aggregate([
			{
				$match: {
					ProductType: type,
				},
			},
			{ $unwind: '$Product' },
			{ $sort: sort },
			{ $limit: limit },
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
					ProductName: '$Product.ProductName',
					Price: '$Product.Information.Price',
					DisplayImage: '$Product.Information.DisplayImage',
					Path: '$Product.Path',
					PriceSale: '$Product.Information.PriceSale',
					RemainingAmount: '$Product.Information.RemainingAmount',
					Id_Product: '$Product._id',
					BrandImage: '$brands.BrandImage',
					BrandName: '$brands.BrandName',
					ProductType: type,
					CountEvaluate: { $size: '$Product.Evaluate' },
					// "loaisanphams.Ten": 1,
					Star: { $avg: '$Product.Evaluate.Star' },
				},
			},
		]);

		if (result.length !== 0) {
			return res.status(200).json(result);
		}

		return res.status(500).json({
			error: 'Server not found',
		});
	} catch (error) {
		return res.status(500).json({
			error: 'server error',
		});
	}
};

router.get('/api/public/products/:param/:limit', async (req, res) => {
	const limit = req.params.limit;
	switch (req.params.param) {
		case 'bestsellingphone':
			return find(req, res, 'phone', 'Product.ProductSold', limit);
		case 'newestphone':
			return find(req, res, 'phone', 'Product.createdAt', limit);
		case 'newesttablet':
			return find(req, res, 'tablet', 'Product.createdAt', limit);
		default:
			return res.status(400).json({
				error: 'request invalid',
			});
	}
});

const findProductDetail = async (req, res, linkproduct) => {
	try {
		const result = await GroupProduct.aggregate([
			{ $unwind: '$Product' },
			{
				$match: {
					'Product.Path': linkproduct,
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
					Describe: '$Describe.html',
					ProductType: 1,
					ProductName: '$Product.ProductName',
					Id_Product: '$Product._id',
					Path: '$Product.Path',
					Information: '$Product.Information',
					Image: '$Product.Image',
					Brand: {
						BrandName: '$brands.BrandName',
						BrandImage: '$brands.BrandImage',
					},
					CountReviews: { $size: '$Product.Evaluate' },
					Star: { $avg: '$Product.Evaluate.Star' },
				},
			},
			{ $limit: 1 },
		]);
		// thêm lượt xem khi khách hàng xem sản phầm
		if (result.length !== 0) {
			return res.status(200).json(result);
		}
		return res.status(500).json({
			error: 'Server not found',
		});
	} catch (error) {
		return res.status(500).json({
			error: 'server error',
		});
	}
};

router.get('/api/public/products/:linkproduct', async (req, res) => {
	const linkproduct = req.params.linkproduct;
	return findProductDetail(req, res, linkproduct);
});
// cập nhật lượt xem khi người dùng vào sản phẩm
router.post('/api/productAddview', async (req, res) => {
	try {
		const Id_Product = req.body.Id_Product;
		if (!ObjectId.isValid(Id_Product)) return res.status(400).json({ message: 'không tìm thấy sản phẩm' });
		await GroupProduct.findOneAndUpdate(
			{
				'Product._id': Id_Product,
			},
			{
				$inc: {
					'Product.$[idproduct].Views': 1,
				},
			},
			{
				arrayFilters: [{ 'idproduct._id': ObjectId(Id_Product) }],
				// upsert: true,
				// new: true,
			}
		).lean();
		return res.json({ message: 'oke' });
	} catch (error) {
		return res.status(500).json({ message: 'not oke' });
	}
});
//lấy danh sách sản phẩm trong cùng 1 danh mục
const getProductOptions = async (req, res, linkproduct) => {
	try {
		const result = await GroupProduct.aggregate([
			{
				$match: {
					'Product.Path': linkproduct,
				},
			},
			{
				$project: {
					_id: 0,
					'Product._id': 1,
					'Product.ProductName': 1,
					'Product.Path': 1,
					'Product.Information.Price': 1,
					'Product.Information.DisplayImage': 1,
					'Product.Information.PriceSale': 1,
					'Product.Information.RemainingAmount': 1,
					'Product.Information.Configuration': 1,
				},
			},
			{
				$limit: 1,
			},
		]);
		res.json(result[0].Product);
	} catch (error) {
		return res.status(500).json({
			error: 'server error',
		});
	}
};

router.get('/api/public/productoptions/:linkproduct', async (req, res) => {
	const linkproduct = req.params.linkproduct;
	return getProductOptions(req, res, linkproduct);
});

const findProductRated = async (req, res, product_path, page, limit, skip) => {
	try {
		const result = await GroupProduct.aggregate([
			// $unwind chia tách mảng Sanpham . trong $facet tiếp tục dùng uwind chia tách mảng

			{ $unwind: '$Product' },
			{
				$facet: {
					Data: [
						// { $unwind: "$Product" },

						{
							$match: {
								'Product.Path': product_path,
							},
						},
						{ $unwind: '$Product.Evaluate' },
						{
							$lookup: {
								from: 'users',
								localField: 'Product.Evaluate.Id_User',
								foreignField: '_id',
								as: 'users',
							},
						},
						{
							$project: {
								_id: 0,
								Id_Evaluate: '$Product.Evaluate._id',
								Id_User: '$Product.Evaluate.Id_User',
								Name: '$users.Name',
								Avatar: '$users.Avatar',
								Star: '$Product.Evaluate.Star',
								ContentRated: '$Product.Evaluate.ContentRated',
								Time: '$Product.Evaluate.Time',
							},
						},
						{
							$sort: {
								Time: -1,
							},
						},
						{ $skip: skip },
						{ $limit: limit },
					],
					MetaData: [
						//vì ở trên chia $unwind SanPham nên ở dưới sẽ lấy đc
						//1 thay vì tất cả SanPham trong NHomSanPham
						{
							$match: {
								'Product.Path': product_path,
							},
						},
						{
							$addFields: {
								Limit: limit,
								Skip: skip,
								CountEvaluate: {
									$size: '$Product.Evaluate',
								},
							},
						},
						{
							$project: {
								_id: 0, //id NhomSanPham
								CountEvaluate: 1,
								Limit: 1, //hiển thị limit ở trên
								Skip: 1,
								// Page:page,
								totalPage: {
									// làm tròn
									//nếu nhiều phép tính hơn :
									//https://stackoverflow.com/questions/55606675/how-to-divide-two-numbers-and-get-the-result-in-whole-numbers-mongodb
									$ceil: {
										$divide: ['$CountEvaluate', '$Limit'],
									},
								},
							},
						},
					],
				},
			},
		]);
		return res.status(200).json(result);
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: 'server error',
		});
	}
};
//dánh gia
// const get_params_or_query_limit = (params) => {
// 	try {
// 		if (params && parseInt(params) > 0) {
// 			return parseInt(params);
// 		} else {
// 			return 1;
// 		}
// 	} catch (error) {
// 		return 1;
// 	}
// };
router.get('/api/public/product/rated/:LinkProduct/:page/:limit', async (req, res) => {
	const productId = req.params.LinkProduct;

	const page = get_params_or_query_limit(req.params.page);
	const limit = get_params_or_query_limit(req.params.limit);
	const skip = (page - 1) * limit;
	// total page

	return findProductRated(req, res, productId, page, limit, skip);
});
//////////////////////////////////////////
const findProductComment = async (req, res, product_path, page, limit, skip) => {
	try {
		const result = await GroupProduct.aggregate([
			// từ khóa tìm kiếm "reverse unwind mongodb"
			// $unwind chia tách mảng Sanpham . trong $facet tiếp tục dùng uwind chia tách mảng
			{ $unwind: '$Product' },
			{
				$match: {
					'Product.Path': product_path,
				},
			},
			{ $unwind: '$Product.Comment' }, //phải uwin từng cái ko thể một lúc
			{
				$lookup: {
					from: 'users',
					localField: 'Product.Comment.Id_User',
					foreignField: '_id',
					as: 'users',
				},
			},
			{
				$lookup: {
					from: 'admins',
					localField: 'Product.Comment.Id_User',
					foreignField: '_id',
					as: 'admins',
				},
			},
			// {
			// 	$addFields: {
			// 		Role: {
			// 			$cond: { if: { $eq: ["$Product.Comment.Role", "admin"] }, then: "admin", else: "user" }, //them một field để kiểm tra khỏi phải tính lại
			// 		},
			// 	},
			// },

			{
				$facet: {
					Comment: [
						{
							$project: {
								_id: 0,
								Id_Comment: '$Product.Comment._id',
								Id_User: '$Product.Comment.Id_User',
								Name: {
									$cond: {
										if: {
											$eq: ['$Product.Comment.Role', 'admin'],
										},
										then: '$admins.DisplayName',
										else: '$users.Name',
									}, //if(check == admin thì ...)
								},
								Avatar: {
									$cond: {
										if: {
											$eq: ['$Product.Comment.Role', 'admin'],
										},
										then: '$admins.Avatar',
										else: '$users.Avatar',
									},
								},
								CommentContent: '$Product.Comment.CommentContent',
								Reply: '$Product.Comment.Reply',
								Role: '$Product.Comment.Role',
								Time: '$Product.Comment.Time',
							},
						},
						{
							$sort: {
								Time: -1,
							},
						},
						{ $skip: skip },
						{ $limit: limit },
						{
							$set: {
								ReplyIsEmpty: {
									$cond: {
										if: {
											$eq: ['$Reply', []],
										},
										then: true,
										else: false,
									},
								},
							},
						},
						{
							$unwind: {
								path: '$Reply',
								preserveNullAndEmptyArrays: true,
							},
						},
						{
							$lookup: {
								from: 'users',
								localField: 'Reply.Id_User',
								foreignField: '_id',
								as: 'users',
							},
						},
						{
							$lookup: {
								from: 'admins',
								localField: 'Reply.Id_User',
								foreignField: '_id',
								as: 'admins',
							},
						},
						{
							$set: {
								'Reply.Name': {
									$cond: {
										if: {
											$eq: ['$Reply.Role', 'admin'],
										},
										then: '$admins.DisplayName',
										else: '$users.Name',
									}, //if(check == admin thì ...)
								},
							},
						},
						{
							$set: {
								'Reply.Avatar': {
									$cond: {
										if: {
											$eq: ['$Reply.Role', 'admin'],
										},
										then: '$admins.Avatar',
										else: '$users.Avatar',
									}, //if(check == admin thì ...)
								},
							},
						},

						{
							$project: {
								_id: 0,
								Id_Comment: 1,
								Id_Reply: 1,
								Id_User: 1,
								Name: 1,
								Avatar: 1,
								CommentContent: 1,
								Time: 1,
								Reply: 1,
								Role: 1,
								ReplyIsEmpty: 1,
							},
						},
						{
							$group: {
								_id: '$Id_Comment',
								Avatar: { $first: '$Avatar' },
								Id_User: { $first: '$Id_User' },
								Role: { $first: '$Role' },
								Name: { $first: '$Name' },
								Time: { $first: '$Time' },
								ReplyIsEmpty: {
									$first: '$ReplyIsEmpty',
								},
								CommentContent: {
									$first: '$CommentContent',
								},
								Reply: { $push: '$Reply' },
							},
						},
					],
					MetaData: [
						//vì ở trên chia $unwind SanPham.comment nên ở dưới sẽ lấy đc
						//1 thay vì tất cả SanPham.comment trong NHomSanPham
						{
							$group: {
								_id: null,
								CountComment: { $sum: 1 },
							},
						},
						{
							$addFields: {
								Limit: limit,
								Skip: skip,
							},
						},
						{
							$project: {
								_id: 0, //id NhomSanPham
								CountComment: 1,
								Limit: 1, //hiển thị limit ở trên
								Skip: 1,
								// Page:page,
								totalPage: {
									// làm tròn
									//nếu nhiều phép tính hơn :
									//https://stackoverflow.com/questions/55606675/how-to-divide-two-numbers-and-get-the-result-in-whole-numbers-mongodb
									$ceil: {
										$divide: ['$CountComment', '$Limit'],
									},
								},
							},
						},
					],
				},
			},
		]);
		return res.status(200).json(result);
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: 'server error',
		});
	}
};
router.get('/api/public/product/comment/:LinkProduct/:page/:limit', async (req, res) => {
	const productId = req.params.LinkProduct;

	const page = get_params_or_query_limit(req.params.page);
	const limit = get_params_or_query_limit(req.params.limit);
	const skip = (page - 1) * limit;
	// total page

	return findProductComment(req, res, productId, page, limit, skip);
});

const search = async (res, query, priceSort = 1, limit, skip) => {
	try {
		const queryFormat = formatQuery(query);
		const result = await GroupProduct.aggregate([
			{ $unwind: '$Product' },

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
					BrandImage: '$brands.BrandImage',
					BrandName: '$brands.BrandName',
					ProductType: '$ProductType',
					Star: { $avg: '$Product.Evaluate.Star' },
					CountEvaluate: { $size: '$Product.Evaluate' },
					Price: '$Product.Information.Price',
					DisplayImage: '$Product.Information.DisplayImage',
					RemainingAmount: '$Product.Information.RemainingAmount',
					Configuration: '$Product.Information.Configuration',
					Path: '$Product.Path',
					PriceSale: '$Product.Information.PriceSale',
				},
			},
			{
				$match: {
					$or: [
						{
							ProductName: {
								$regex: `${queryFormat}`,
								$options: 'i',
							},
						},
						{
							Brand: {
								$regex: `${queryFormat}`,
								$options: 'i',
							},
						},
						{
							ProductType: {
								$regex: `${queryFormat}`,
								$options: 'i',
							},
						},
					],
				},
			},
			{
				$sort: {
					PriceSale: priceSort,
				},
			},
			{
				$facet: {
					Data: [{ $skip: skip }, { $limit: limit }],
					MetaData: [
						{
							$group: {
								_id: null,
								CountProduct: { $sum: 1 },
							},
						},
						{
							$addFields: {
								Limit: limit,
								Skip: skip,
							},
						},
						{
							$project: {
								_id: 0, //id NhomSanPham
								CountProduct: 1,
								Limit: 1, //hiển thị limit ở trên
								Skip: 1,
								// Page:page,
								totalPage: {
									// làm tròn
									//nếu nhiều phép tính hơn :
									//https://stackoverflow.com/questions/55606675/how-to-divide-two-numbers-and-get-the-result-in-whole-numbers-mongodb
									$ceil: {
										$divide: ['$CountProduct', '$Limit'],
									},
								},
							},
						},
					],
				},
			},
		]);
		// lọc mmảng
		// if (result.length !== 0) {
		// 	const unique = [...new Set(result.map((item) => item.SanPhamId))];
		// 	console.log(unique.length);
		// }
		return res.json(result);
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: 'server error',
		});
	}
};

router.get('/api/public/search/:query', async (req, res) => {
	const query = req.params.query;
	const priceSort = req.query.price;

	let price = 1;
	const page = get_params_or_query_limit(req.query.page);
	const limit = get_params_or_query_limit(req.query.limit);
	const skip = (page - 1) * limit;

	// const Filter = () => {
	// 	const query = req.query.query || "^";
	// 	const brands = {

	// 	}
	// 	//lọc query,brand, type,giá từ khoản đến khoảng,bộ nhớ ,ram,sản phẩm có khuyến mại
	// 	return({
	// 			$match: {
	// 				$or: [{ ProductName: { $regex: `${queryFormat}`, $options: "i" } }, { Brand: { $regex: `${queryFormat}`, $options: "i" } }, { ProductType: { $regex: `${queryFormat}`, $options: "i" } }],
	// 			},
	// 		})

	// }
	if (priceSort == 'desc') {
		price = -1;
	}
	search(res, query, price, limit, skip);
});

router.get('/api/u/:id&:pending', function (req, res) {
	console.log(req.params.id);
	console.log(req.params.pending);
	res.json({ a: req.params.id });
});
// search_in_header;
//tim kiếm khớp với 1 từ " iphone " chứ không phải "ip"
//link https://stackoverflow.com/questions/28775051/best-way-to-perform-a-full-text-search-in-mongodb-and-mongoose
const search_in_header = async (req, res, query, limit) => {
	try {
		const result = await GroupProduct.aggregate([
			{
				$match: {
					$text: {
						$search: query,
						$diacriticSensitive: false,
					},
				},
			},

			{ $unwind: '$Product' },
			{
				$facet: {
					Phone: [
						{
							$match: { ProductType: 'phone' },
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
							$sort: {
								'Product.CreatedAt': -1,
							},
						},
						{
							$project: {
								_id: 0,
								// Describe: 1,
								// ProductType: 1,
								ProductName: '$Product.ProductName',
								ID_Product: '$Product._id',
								Path: '$Product.Path',
								Information: '$Product.Information',
								// Image: "$Product.Image",
								Price: '$Product.Information.Price',
								PriceSale: '$Product.Information.PriceSale',
								DisplayImage: '$Product.Information.DisplayImage',
								RemainingAmount: '$Product.Information.RemainingAmount',
								Brand: {
									BrandName: '$brands.BrandName',
									BrandImage: '$brands.BrandImage',
								},
								CountReviews: {
									$size: '$Product.Evaluate',
								},
								Star: {
									$avg: '$Product.Evaluate.Star',
								},
							},
						},
						{ $limit: limit },
					],
					Tablet: [
						{
							$match: { ProductType: 'tablet' },
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
							$sort: {
								'Product.CreatedAt': -1,
							},
						},
						{
							$project: {
								_id: 0,
								// Describe: 1,
								// ProductType: 1,
								ProductName: '$Product.ProductName',
								ID_Product: '$Product._id',
								Path: '$Product.Path',
								Information: '$Product.Information',
								// Image: "$Product.Image",
								Price: '$Product.Information.Price',
								PriceSale: '$Product.Information.PriceSale',
								DisplayImage: '$Product.Information.DisplayImage',
								RemainingAmount: '$Product.Information.RemainingAmount',
								Brand: {
									BrandName: '$brands.BrandName',
									BrandImage: '$brands.BrandImage',
								},
								CountReviews: {
									$size: '$Product.Evaluate',
								},
								Star: {
									$avg: '$Product.Evaluate.Star',
								},
							},
						},
						{ $limit: limit },
					],
				},
			},

			{ $limit: limit },
		]);
		return res.json(result);
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: '500',
			message: 'eroor',
		});
	}

	// GroupProduct.find({ $text: { $search: query } })
	// 	.limit(limit)

	// 	.exec(function (err, docs) {
	// 		if (err) return console.log(err);
	// 		return res.json(docs);
	// 	});
};
const search_in_header2 = async (res, query, limit) => {
	try {
		const arr_search = type => {
			return [
				{
					$match: {
						ProductType: type,
					},
				},
				{
					$sort: sort,
				},
				{
					$project: {
						_id: 0,
						// Describe: 1,
						// ProductType: 1,
						ProductName: '$Product.ProductName',
						ID_Product: '$Product._id',
						Path: '$Product.Path',
						// Information: "$Product.Information",
						// Image: "$Product.Image",
						Price: '$Product.Information.Price',
						PriceSale: '$Product.Information.PriceSale',
						DisplayImage: '$Product.Information.DisplayImage',
						RemainingAmount: '$Product.Information.RemainingAmount',
						Configuration: '$Product.Information.Configuration',
						Brand: {
							BrandName: '$brands.BrandName',
							BrandImage: '$brands.BrandImage',
						},
						CountReviews: {
							$size: '$Product.Evaluate',
						},
						Star: {
							$avg: '$Product.Evaluate.Star',
						},
					},
				},
				{
					$match: {
						$or: [
							{
								ProductType: 'phone',
							},
							{
								ProductName: {
									$regex: `${queryFormat}`,
									$options: 'i',
								},
							},
							{
								Brand: {
									$regex: `${queryFormat}`,
									$options: 'i',
								},
							},
							{
								Price: {
									$regex: `${queryFormat}`,
									$options: 'i',
								},
							},
							{
								PriceSale: {
									$regex: `${queryFormat}`,
									$options: 'i',
								},
							},
							{
								Configuration: {
									$regex: `${queryFormat}`,
									$options: 'i',
								},
							},
						],
					},
				},
				{ $limit: limit },
			];
		};
		const sort = {
			'Product.CreatedAt': -1,
		};
		const queryFormat = formatQuery(query);
		console.log(queryFormat);
		const result = await GroupProduct.aggregate([
			{ $unwind: '$Product' },

			{
				$lookup: {
					from: 'brands',
					localField: 'Brand',
					foreignField: '_id',
					as: 'brands',
				},
			},

			{
				$facet: {
					Phone: arr_search('phone'),
					Tablet: arr_search('tablet'),
				},
			},
		]);

		return res.json(result);
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: 'server error',
		});
	}
};
router.get('/api/public/search_in_header/:query/:limit', async (req, res) => {
	const query = req.params.query;
	const limit = get_params_or_query_limit(req.params.limit);
	if (query.trim() == '') {
		return res.status(404).json({
			message: 'not found',
		});
	}
	search_in_header2(res, query, limit);

	// search_in_header(req, res, query, limit);
});

//tìm kiếm điện thoại
const findPhoneOrTablet = async (res, type, brand = '^', price = 1) => {
	try {
		const result = await GroupProduct.aggregate([
			{ $unwind: '$Product' },
			{
				$lookup: {
					from: 'loaisanphams',
					localField: 'LoaiSanPham',
					foreignField: '_id',
					as: 'loaisanphams',
				},
			},
			{
				$lookup: {
					from: 'thuonghieus',
					localField: 'ThuongHieu',
					foreignField: '_id',
					as: 'thuonghieus',
				},
			},
			{
				$project: {
					_id: 0,
					SanPhamId: '$Product._id',
					Ten: '$Product.Ten',
					ThuongHieu: '$thuonghieus.Ten',

					Loai: '$loaisanphams.Ten',
					Star: { $avg: '$Product.Evaluate.Star' },
					Gia: '$Product.Information.Price',
					HinhAnhHienThi: '$Product.ThongTin.HinhAnhHienThi',
					SoLuongCon: '$Product.ThongTin.SoLuongCon',
					CauHinh: '$Product.ThongTin.CauHinh',
					DuongDan: '$Product.DuongDan',
					GiaKhuyenMai: '$Product.ThongTin.GiaKhuyenMai',
				},
			},
			{
				$match: {
					$and: [
						{
							ThuongHieu: {
								$regex: brand,
								$options: 'i',
							},
						},
						{ Loai: { $regex: type, $options: 'i' } },
					],
				},
			},
			{
				$sort: {
					GiaBanRa: price,
				},
			},
		]);
		return res.json(result);
	} catch (error) {
		res.status(500).json({
			error: 'server error',
		});
	}
};
router.get('/api/public/finphoneortablet/:type/:brand/:price', async (req, res) => {
	const { type, brand, price } = req.params;
	return await findPhoneOrTablet(res, type, brand, price);
});
// tìm kiếm lọc phân trang
const Search = async (res, match, sort, limit, skip, page) => {
	try {
		const result = await GroupProduct.aggregate([
			{ $unwind: '$Product' },
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
					BrandImage: '$brands.BrandImage',
					BrandName: '$brands.BrandName',
					ProductType: '$ProductType',
					Star: { $avg: '$Product.Evaluate.Star' },
					CountEvaluate: { $size: '$Product.Evaluate' },
					Price: '$Product.Information.Price',
					DisplayImage: '$Product.Information.DisplayImage',
					RemainingAmount: '$Product.Information.RemainingAmount',
					Configuration: '$Product.Information.Configuration',
					Path: '$Product.Path',
					PriceSale: '$Product.Information.PriceSale',
				},
			},
			{
				$match: match,
			},
			{
				$sort: sort,
			},
			{
				$facet: {
					Data: [{ $skip: skip }, { $limit: limit }],
					MetaData: [
						{
							$group: {
								_id: null,
								CountProduct: { $sum: 1 },
							},
						},
						{
							$addFields: {
								Limit: limit,
								Skip: skip,
								CurrentPage: page,
							},
						},
						{
							$project: {
								_id: 0, //id NhomSanPham
								CountProduct: 1,
								Limit: 1, //hiển thị limit ở trên
								Skip: 1,
								CurrentPage: 1,
								// Page:page,
								totalPage: {
									// làm tròn
									//nếu nhiều phép tính hơn :
									//https://stackoverflow.com/questions/55606675/how-to-divide-two-numbers-and-get-the-result-in-whole-numbers-mongodb
									$ceil: {
										$divide: ['$CountProduct', '$Limit'],
									},
								},
							},
						},
					],
				},
			},
		]);
		return res.json(result);
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: 'server error',
		});
	}
};
const getSort = sort => {
	if (sort == 'priceUp') {
		return { Price: 1 };
	}
	if (sort == 'priceDown') {
		return { Price: -1 };
	}
	if (sort == 'AZ') {
		return { ProductName: 1 };
	}
	if (sort == 'ZA') {
		return { ProductName: -1 };
	}
	//default
	return {
		Price: 1,
	};
};
const Filter = (query, brands, type, price, memory, ram, sale) => {
	//lọc query,brand, type,giá từ khoản đến khoảng,bộ nhớ ,ram,sản phẩm có khuyến mại
	let match = {};
	const queryFormat = formatQuery(query);
	let matchQuery = [{ ProductName: { $regex: `${queryFormat}`, $options: 'i' } }];

	if (brands) {
		match = {
			...match,
			BrandName: { $in: [...brands.split('.')] },
		};
	} else {
		matchQuery.push({
			Brand: { $regex: `${queryFormat}`, $options: 'i' },
		});
	}
	if (type) {
		match = {
			...match,
			ProductType: { $in: [...type.split('.')] },
		};
	} else {
		matchQuery.push({
			ProductType: { $regex: `${queryFormat}`, $options: 'i' },
		});
	}
	if (ram) {
		match = {
			...match,
			'Configuration.RAM': { $in: [...ram.split('.')] },
		};
	}
	if (memory) {
		match = {
			...match,
			'Configuration.Bộ nhớ trong': { $in: [...memory.split('.')] },
		};
	}
	if (sale) {
		match = {
			...match,
			PriceSale: { $gt: 0 },
		};
	}
	if (price) {
		let intancePrice = price.split('.');
		let arrayIntance = [];
		let result = [];
		for (const intance of intancePrice) {
			const intanceItem = intance.split('-');
			if (
				intanceItem.length === 2 &&
				!intanceItem.some(isNaN) &&
				parseInt(intanceItem[0]) <= parseInt(intanceItem[1])
			) {
				//check giá phải là number và khoảng giá có 2 item
				arrayIntance.push(intanceItem);
			}
		}
		for (const priceItem of arrayIntance) {
			result.push({
				Price: {
					$gte: parseInt(priceItem[0]),
					$lte: parseInt(priceItem[1]),
				},
			});
		}
		if (result.length !== 0) {
			match = {
				...match,
				$and: [{ $or: [...matchQuery] }, { $or: [...result] }],
			};
		} else {
			match = {
				...match,
				$or: [...matchQuery],
			};
		}
	} else {
		match = {
			...match,
			$or: [...matchQuery],
		};
	}
	return match;
};
router.get('/api/public/search', async (req, res) => {
	//lọc
	const query = req.query.query || '^';
	const brands = req.query.brands;
	const type = req.query.types;
	const price = req.query.prices;
	const memory = req.query.memorys;
	const ram = req.query.rams;
	const sale = req.query.sales;
	//phân trang
	const page = get_params_or_query_limit(req.query.page);
	const limit = get_params_or_query_limit(req.query.limit);
	const skip = (page - 1) * limit;
	//sort
	const sort = getSort(req.query.sort);
	//
	const match = Filter(query, brands, type, price, memory, ram, sale);
	Search(res, match, sort, limit, skip, page);
});
module.exports = router;
