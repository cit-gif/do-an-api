/// import
require('dotenv/config');
const Brand = require('./model/Brand');
// const LoaiSanPham = require("../model/LoaiSanPham");
// const GroupProduct = require("../model/GroupProduct");
const GroupProduct = require('./model/GroupProduct');
const Admin = require('./model/Admin');
const Post = require('./model/Post');
// const TroChuyenTuVan = require("../model/TroChuyenTuVan");
const FormatUrlToEN = require('./helper/FormatUrlToEN');
const User = require('./model/User');
// faker
const faker = require('faker/locale/vi');
//bcryptjs
const bcrypt = require('bcryptjs');
const hashPassword = require('./helper/hashPassOrCheck');
const path = require('path');
const fs = require('fs');
const download = require('image-downloader');
const MoTa = `Hiệu năng cao vượt mọi thử thách`;
const { v4: uuid } = require('uuid');
/**
 * tạo thư mục public
 * backend
 * 	tablet
 * 	phone
 * 	admin
 * 	Brands và Brands2\\\ không được xóa
 * 	use/avatar
 * 	post // bắt buộc tạo
 * 	images// bắt buộc tạo// để lư hình ảnh upload
 */
(async () => {
	//database
	const mongoose = require('mongoose');
	mongoose.Promise = global.Promise;

	// Connect MongoDB at default port 27017.
	await mongoose.connect(
		process.env.URL_DB,
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
		}
	);

	// init
	const puclicPath = 'public';
	const backendPath = 'backend';
	// const ousideForder = `${path.join(__dirname).slice(0, -3)}/${puclicPath}/${backendPath}`;
	const ousideForder = `${path.join(__dirname)}/${puclicPath}/${backendPath}`;
	//C:\gameLOL\WEB_BACK_END_NODE_JS\web_ban_hang\server\public/backend
	const brandFoder = 'Brands';
	const phoneFolder = 'phone';
	const tabletFolder = 'tablet';
	const resultFolder = {
		brandPath: `${ousideForder}/${brandFoder}/`,
		//C:\gameLOL\WEB_BACK_END_NODE_JS\web_ban_hang\server\public/backend/Brands
		phonePath: `${ousideForder}/${phoneFolder}/`,
		tabletPath: `${ousideForder}/${tabletFolder}/`,
	};
	const publicforderPhone = `/${backendPath}/${phoneFolder}/`;
	const savePublicForder = `${path.join(__dirname)}/${puclicPath}/${backendPath}/${phoneFolder}/`;
	const publicforderTablet = `/${backendPath}/${tabletFolder}/`;
	const savePublicForderTablet = `${path.join(__dirname)}/${puclicPath}/${backendPath}/${tabletFolder}/`;
	// const publicforderBrand = `/${puclicPath}/${backendPath}/${phoneFolder}`;
	function createFolder() {
		if (!fs.existsSync(ousideForder)) {
			fs.mkdirSync(ousideForder);
		}
		//brands folder
		if (!fs.existsSync(resultFolder.brandPath)) {
			fs.mkdirSync(resultFolder.brandPath);
		}
		// phone
		if (!fs.existsSync(resultFolder.phonePath)) {
			fs.mkdirSync(resultFolder.phonePath);
		}
		// tablet
		if (!fs.existsSync(resultFolder.tabletPath)) {
			fs.mkdirSync(resultFolder.tabletPath);
		}
	}
	const Thuong_hieu = [
		{
			name: 'Apple',
			src: '/backend/Brands/Apple.jpg',
		},
		{
			name: 'Xiaomi',
			src: '/backend/Brands/xiaomi.png',
		},
		{
			name: 'SamSung',
			src: '/backend/Brands/Samsung.jpg',
		},
		{
			name: 'Oppo',
			src: '/backend/Brands/OPPO.jpg',
		},
		{
			name: 'Vivo',
			src: '/backend/Brands/Vivo.jpg',
		},
	];

	const Admin_ = [
		{
			anhdaidien: '/backend/admin/avatar.jpg',
			name: 'Dương SƠn Bá',
			username: 'admin',
			password: '12345678',
		},
	];
	const so_nguoi_dung = 25;
	const header_phone = '09';
	const CountEvaluate = 17;
	const CountComment = 18;
	const countMess = 6;
	const RemainingAmountSetting = 99999;
	const default_pass = '12345678';
	const salt = await bcrypt.genSalt(10);

	var arrIdThuong_hieu = [],
		arrIdNhoai_san_ph = [],
		arrIDSan_pham = [];
	var arr_id_user = [];
	var arr_id_admin = [];
	//tạo folder
	createFolder();

	// tạo thương hiệu
	console.log('Brand-----------------------------');

	for (let index = 0; index < Thuong_hieu.length; index++) {
		const thuong_hieuObj = new Brand({
			BrandName: Thuong_hieu[index].name,
			BrandImage: Thuong_hieu[index].src,
		});

		await thuong_hieuObj.save(function (err) {
			if (err) {
				console.log(err);
				console.log(err.message.split(': ')[2]);
				console.log('Thương hiệu không insert được tại ; ', index);
				return;
			}

			// saved!
		});
		arrIdThuong_hieu.push(thuong_hieuObj.id);
	}

	//#region
	const NhomSanPham = [
		{
			GroupName: 'Điện thoại iPhone 12 Pro Max',
			brand: arrIdThuong_hieu[0],
			type: 'phone',
			product: [
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/228744/iphone-12-pro-max-xanh-duong-new-600x600-200x200.jpg',
						Price: 42990000,
						PriceSale: 39990000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'OLED6.7 Super Retina XDR',
							},
							{
								'Hệ điều hành': 'iOS 14',
							},
							{
								'Camera sau': '3 camera 12 MP',
							},
							{
								'Camera trước': '12 MP',
							},
							{
								RAM: '6 GB',
							},
							{
								'Bộ nhớ trong': '512 GB',
							},
							{ 'Vi xử lí': 'Apple A14 Bionic' },
							{
								SIM: '1 Nano SIM & 1 eSIMHỗ trợ 5G',
							},
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/228744/iphone-12-pro-max-512gb-xanh-duong-',
						dynamic: 12,
						file: '-org.jpg',
					},
				},
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/228743/iphone-12-pro-max-vang-new-600x600-1-200x200.jpg',
						Price: 37490000,
						PriceSale: 34690000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'OLED6.7 Super Retina XDR',
							},
							{
								'Hệ điều hành': 'iOS 14',
							},
							{
								'Camera sau': '3 camera 12 MP',
							},
							{
								'Camera trước': '12 MP',
							},
							{
								RAM: '6 GB',
							},
							{
								'Bộ nhớ trong': '256 GB',
							},
							{ 'Vi xử lí': 'Apple A14 Bionic' },
							{
								SIM: '1 Nano SIM & 1 eSIMHỗ trợ 5G',
							},
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/228743/iphone-12-pro-max-256gb-',
						dynamic: 12,
						file: '-org.jpg',
					},
				},
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/228743/iphone-12-pro-max-trang-bac-600x600-1-200x200.jpg',
						Price: 32990000,
						PriceSale: 30990000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'OLED6.7 Super Retina XDR',
							},
							{
								'Hệ điều hành': 'iOS 14',
							},
							{
								'Camera sau': '3 camera 12 MP',
							},
							{
								'Camera trước': '12 MP',
							},
							{
								RAM: '6 GB',
							},
							{
								'Bộ nhớ trong': '128 GB',
							},
							{ 'Vi xử lí': 'Apple A14 Bionic' },
							{
								SIM: '1 Nano SIM & 1 eSIMHỗ trợ 5G',
							},
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/213033/iphone-12-pro-max-bac-',
						dynamic: 12,
						file: '-org.jpg',
					},
				},
			],
		},
		{
			GroupName: 'Điện thoại iPhone 12',
			brand: arrIdThuong_hieu[0],
			type: 'phone',
			product: [
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/228736/iphone-12-do-200x200.jpg',
						Price: 22990000,
						PriceSale: 20990000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'OLED6.1 Super Retina XDR',
							},
							{
								'Hệ điều hành': 'iOS 14',
							},
							{
								'Camera sau': '2 camera 12 MP',
							},
							{
								'Camera trước': '12 MP',
							},
							{
								RAM: '4 GB',
							},
							{
								'Bộ nhớ trong': '64 GB',
							},
							{ 'Vi xử lí': 'Apple A14 Bionic' },
							{
								SIM: '1 Nano SIM & 1 eSIMHỗ trợ 5G',
							},
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/213031/iphone-12-do-',

						dynamic: 11,
						file: '-org.jpg',
						start: 2,
					},
				},
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/228736/iphone-12-trang-200x200.jpg',
						Price: 24990000,
						PriceSale: 22990000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'OLED6.1 Super Retina XDR',
							},
							{
								'Hệ điều hành': 'iOS 14',
							},
							{
								'Camera sau': '2 camera 12 MP',
							},
							{
								'Camera trước': '12 MP',
							},
							{
								RAM: '4 GB',
							},
							{
								'Bộ nhớ trong': '128 GB',
							},
							{ 'Vi xử lí': 'Apple A14 Bionic' },
							{
								SIM: '1 Nano SIM & 1 eSIMHỗ trợ 5G',
							},
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/228736/iphone-12-128gb-trang-',
						dynamic: 12,
						file: '-org.jpg',
					},
				},
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/228736/iphone-12-trang-200x200.jpg',
						Price: 26990000,
						PriceSale: 24990000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'OLED6.1 Super Retina XDR',
							},
							{
								'Hệ điều hành': 'iOS 14',
							},
							{
								'Camera sau': '2 camera 12 MP',
							},
							{
								'Camera trước': '12 MP',
							},
							{
								RAM: '4 GB',
							},
							{
								'Bộ nhớ trong': '256 GB',
							},
							{ 'Vi xử lí': 'Apple A14 Bionic' },
							{
								SIM: '1 Nano SIM & 1 eSIMHỗ trợ 5G',
							},
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/228737/iphone-12-256gb-xanh--la-2',
						dynamic: 10,
						file: '-org.jpg',
						start: 2,
					},
				},
			],
		},
		{
			GroupName: 'Điện thoại iPhone 12 Pro',
			brand: arrIdThuong_hieu[0],
			type: 'phone',
			product: [
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/228739/iphone-12-pro-xanh-duong-new-600x600-200x200.jpg',
						Price: 38990000,
						PriceSale: 35990000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'OLED6.1 Super Retina XDR',
							},
							{
								'Hệ điều hành': 'iOS 14',
							},
							{
								'Camera sau': '2 camera 12 MP',
							},
							{
								'Camera trước': '12 MP',
							},
							{
								RAM: '6 GB',
							},
							{
								'Bộ nhớ trong': '512 GB',
							},
							{ 'Vi xử lí': 'Apple A14 Bionic' },
							{
								SIM: '1 Nano SIM & 1 eSIMHỗ trợ 5G',
							},
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/228739/iphone-12-pro-512gb-xanh-',
						dynamic: 11,
						file: '-org.jpg',
					},
				},
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/228738/iphone-12-pro-xam-new-600x600-200x200.jpg',
						Price: 32990000,
						PriceSale: 31990000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'OLED6.1 Super Retina XDR',
							},
							{
								'Hệ điều hành': 'iOS 14',
							},
							{
								'Camera sau': '2 camera 12 MP',
							},
							{
								'Camera trước': '12 MP',
							},
							{
								RAM: '6 GB',
							},
							{
								'Bộ nhớ trong': '256 GB',
							},
							{ 'Vi xử lí': 'Apple A14 Bionic' },
							{
								SIM: '1 Nano SIM & 1 eSIMHỗ trợ 5G',
							},
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/228738/iphone-12-pro-256gb-',
						dynamic: 12,
						file: '-org.jpg',
					},
				},
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/213032/iphone-12-pro-bac-new-600x600-200x200.jpg',
						Price: 30990000,
						PriceSale: 28990000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'OLED6.1 Super Retina XDR',
							},
							{
								'Hệ điều hành': 'iOS 14',
							},
							{
								'Camera sau': '2 camera 12 MP',
							},
							{
								'Camera trước': '12 MP',
							},
							{
								RAM: '4 GB',
							},
							{
								'Bộ nhớ trong': '128 GB',
							},
							{ 'Vi xử lí': 'Apple A14 Bionic' },
							{
								SIM: '1 Nano SIM & 1 eSIMHỗ trợ 5G',
							},
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/213032/iphone-12-pro-bac-',
						dynamic: 12,
						file: '-org.jpg',
					},
				},
			],
		},
		{
			GroupName: 'Điện thoại iPhone 11',
			brand: arrIdThuong_hieu[0],
			type: 'phone',
			product: [
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/153856/iphone-xi-den-200x200.jpg',
						Price: 17490000,
						PriceSale: 16490000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'IPS LCD6.1 Liquid Retina',
							},
							{
								'Hệ điều hành': 'iOS 14',
							},
							{
								'Camera sau': '2 camera 12 MP',
							},
							{
								'Camera trước': '12 MP',
							},
							{
								RAM: '4 GB',
							},
							{
								'Bộ nhớ trong': '64 GB',
							},
							{ 'Vi xử lí': 'Apple A13 Bionic' },
							{
								SIM: '1 Nano SIM & 1 eSIMHỗ trợ 4G',
							},
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/153856/iphone-11-den-',
						dynamic: 11,
						start: 2,
						file: '-1-org.jpg',
					},
				},
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/210644/iphone-11-xanhla-200x200.jpg',
						Price: 19490000,
						PriceSale: 18490000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'IPS LCD6.1 Liquid Retina',
							},
							{
								'Hệ điều hành': 'iOS 14',
							},
							{
								'Camera sau': '2 camera 12 MP',
							},
							{
								'Camera trước': '12 MP',
							},
							{
								RAM: '4 GB',
							},
							{
								'Bộ nhớ trong': '128 GB',
							},
							{ 'Vi xử lí': 'Apple A13 Bionic' },
							{
								SIM: '1 Nano SIM & 1 eSIMHỗ trợ 4G',
							},
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/210644/iphone-11-128gb-xanh-la-',
						dynamic: 12,
						file: '-org.jpg',
					},
				},
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/210648/iphone-11-trang-200x200.jpg',
						Price: 21490000,
						PriceSale: 19490000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'IPS LCD6.1 Liquid Retina',
							},
							{
								'Hệ điều hành': 'iOS 14',
							},
							{
								'Camera sau': '2 camera 12 MP',
							},
							{
								'Camera trước': '12 MP',
							},
							{
								RAM: '4 GB',
							},
							{
								'Bộ nhớ trong': '256 GB',
							},
							{ 'Vi xử lí': 'Apple A13 Bionic' },
							{
								SIM: '1 Nano SIM & 1 eSIMHỗ trợ 4G',
							},
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/210648/iphone-11-trang-',
						dynamic: 12,
						file: '-org.jpg',
					},
				},
			],
		},
		{
			GroupName: 'Điện thoại Xiaomi Mi 11 5G',
			brand: arrIdThuong_hieu[1],
			type: 'phone',
			product: [
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/226264/xiaomi-mi-11-xamdam-600x600-200x200.jpg',
						Price: 21490000,
						PriceSale: 19490000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'AMOLED6.81 Quad HD+ (2K+)',
							},
							{
								'Hệ điều hành': 'Android 11',
							},
							{
								'Camera sau': 'Chính 108 MP & Phụ 13 MP, 5 MP',
							},
							{
								'Camera trước': '20 MP',
							},
							{
								RAM: '8 GB',
							},
							{
								'Bộ nhớ trong': '256 GB',
							},
							{ 'Vi xử lí': 'Snapdragon 888' },
							{ SIM: '2 Nano SIMHỗ trợ 5G' },
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/226264/xiaomi-mi-11-xamdam-',
						dynamic: 13,
						file: '-org.jpg',
					},
				},
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/226264/xiaomi-mi-11-xanhduong-600x600-200x200.jpg',
						Price: 24490000,
						PriceSale: 22490000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'AMOLED6.81 Quad HD+ (2K+)',
							},
							{
								'Hệ điều hành': 'Android 11',
							},
							{
								'Camera sau': 'Chính 108 MP & Phụ 13 MP, 5 MP',
							},
							{
								'Camera trước': '20 MP',
							},
							{
								RAM: '8 GB',
							},
							{
								'Bộ nhớ trong': '512 GB',
							},
							{ 'Vi xử lí': 'Snapdragon 888' },
							{ SIM: '2 Nano SIMHỗ trợ 5G' },
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/226264/xiaomi-mi-11-xanhduong-',
						dynamic: 13,
						file: '-org.jpg',
					},
				},
			],
		},
		{
			GroupName: 'Điện thoại Xiaomi Mi 11 Lite',
			brand: arrIdThuong_hieu[1],
			type: 'phone',
			product: [
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/233241/xiaomi-mi-11-lite-4g-pink-1-200x200.jpg',
						Price: 7490000,
						PriceSale: 6490000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'AMOLED6.55 Full HD+',
							},
							{
								'Hệ điều hành': 'Android 11',
							},
							{
								'Camera sau': 'Chính 64 MP & Phụ 8 MP, 5 MP',
							},
							{
								'Camera trước': '16 MP',
							},
							{
								RAM: '8 GB',
							},
							{
								'Bộ nhớ trong': '128 GB',
							},
							{ 'Vi xử lí': 'Snapdragon 732G' },
							{ SIM: '2 Nano SIMHỗ trợ 5G' },
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/233241/xiaomi-mi-11-lite-4g-hong-',
						dynamic: 12,
						file: '-org.jpg',
					},
				},
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/233241/xiaomi-mi-11-lite-4g-black-1-200x200.jpg',
						Price: 8490000,
						PriceSale: 7490000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'AMOLED6.55 Full HD+',
							},
							{
								'Hệ điều hành': 'Android 11',
							},
							{
								'Camera sau': 'Chính 64 MP & Phụ 8 MP, 5 MP',
							},
							{
								'Camera trước': '16 MP',
							},
							{
								RAM: '8 GB',
							},
							{
								'Bộ nhớ trong': '256 GB',
							},
							{ 'Vi xử lí': 'Snapdragon 732G' },
							{ SIM: '2 Nano SIMHỗ trợ 5G' },
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/233241/xiaomi-mi-11-lite-4g-den-',
						dynamic: 12,
						file: '-org.jpg',
					},
				},
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/233241/xiaomi-mi-11-lite-4g-blue-200x200.jpg',
						Price: 9490000,
						PriceSale: 8490000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'AMOLED6.55 Full HD+',
							},
							{
								'Hệ điều hành': 'Android 11',
							},
							{
								'Camera sau': 'Chính 64 MP & Phụ 8 MP, 5 MP',
							},
							{
								'Camera trước': '16 MP',
							},
							{
								RAM: '8 GB',
							},
							{
								'Bộ nhớ trong': '512 GB',
							},
							{ 'Vi xử lí': 'Snapdragon 732G' },
							{ SIM: '2 Nano SIMHỗ trợ 5G' },
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/233241/xiaomi-mi-11-lite-4g-xanh-duong-',
						dynamic: 12,
						file: '-org.jpg',
					},
				},
			],
		},
		{
			GroupName: 'Điện thoại Xiaomi Redmi Note 10 5G',
			brand: arrIdThuong_hieu[1],
			type: 'phone',
			product: [
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/235971/xiaomi-redmi-note-10-5g-xanh-bong-dem-1-200x200.jpg',
						Price: 5490000,
						PriceSale: 4990000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'IPS LCD6.5 Full HD+',
							},
							{
								'Hệ điều hành': 'Android 11',
							},
							{
								'Camera sau': 'Chính 48 MP & Phụ 2 MP, 2 MP',
							},
							{
								'Camera trước': '8 MP',
							},
							{
								RAM: '8 GB',
							},
							{
								'Bộ nhớ trong': '128 GB',
							},
							{
								'Vi xử lí': 'MediaTek Dimensity 700',
							},
							{ SIM: '2 Nano SIM, Hỗ trợ 5G' },
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/235971/xiaomi-redmi-note-10-5g-xanh-duong-',
						dynamic: 12,
						file: '-org.jpg',
					},
				},
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/235971/xiaomi-redmi-note-10-5g-xanh-cuc-quang-200x200.jpg',
						Price: 6490000,
						PriceSale: 5990000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'IPS LCD6.5 Full HD+',
							},
							{
								'Hệ điều hành': 'Android 11',
							},
							{
								'Camera sau': 'Chính 48 MP & Phụ 2 MP, 2 MP',
							},
							{
								'Camera trước': '8 MP',
							},
							{
								RAM: '8 GB',
							},
							{
								'Bộ nhớ trong': '256 GB',
							},
							{
								'Vi xử lí': 'MediaTek Dimensity 700',
							},
							{ SIM: '2 Nano SIM, Hỗ trợ 5G' },
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/235971/xiaomi-redmi-note-10-5g-xanh-la-',
						dynamic: 12,
						file: '-org.jpg',
					},
				},
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/235971/xiaomi-redmi-note-10-5g-xam-200x200.jpg',
						Price: 9490000,
						PriceSale: 8990000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'IPS LCD6.5 Full HD+',
							},
							{
								'Hệ điều hành': 'Android 11',
							},
							{
								'Camera sau': 'Chính 48 MP & Phụ 2 MP, 2 MP',
							},
							{
								'Camera trước': '8 MP',
							},
							{
								RAM: '8 GB',
							},
							{
								'Bộ nhớ trong': '512 GB',
							},
							{
								'Vi xử lí': 'MediaTek Dimensity 700',
							},
							{ SIM: '2 Nano SIM, Hỗ trợ 5G' },
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/235971/xiaomi-redmi-note-10-5g-xam-',
						dynamic: 13,
						file: '-org.jpg',
					},
				},
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/235971/xiaomi-redmi-note-10-5g-bac-200x200.jpg',
						Price: 4490000,
						PriceSale: 3990000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'IPS LCD6.5 Full HD+',
							},
							{
								'Hệ điều hành': 'Android 11',
							},
							{
								'Camera sau': 'Chính 48 MP & Phụ 2 MP, 2 MP',
							},
							{
								'Camera trước': '8 MP',
							},
							{
								RAM: '4 GB',
							},
							{
								'Bộ nhớ trong': '64 GB',
							},
							{
								'Vi xử lí': 'MediaTek Dimensity 700',
							},
							{ SIM: '2 Nano SIM, Hỗ trợ 5G' },
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/235971/xiaomi-redmi-note-10-5g-bac-',
						dynamic: 13,
						file: '-org.jpg',
					},
				},
			],
		},
		{
			GroupName: 'Điện thoại Samsung Galaxy Z Fold2 5G',
			brand: arrIdThuong_hieu[2],
			type: 'phone',
			product: [
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/226099/samsung-galaxy-z-fold-2-den-200x200.jpg',
						Price: 50000000,
						// PriceSale: 3990000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình':
									'Chính: Dynamic AMOLED, Phụ: Super AMOLEDChính 7.59 & Phụ 6.23Full HD+',
							},
							{
								'Hệ điều hành': 'Android 10',
							},
							{
								'Camera sau': '3 camera 12 MP',
							},
							{
								'Camera trước': 'Trong 10 MP & Ngoài 10 MP',
							},
							{
								RAM: '12 GB',
							},
							{
								'Bộ nhớ trong': '128 GB',
							},
							{ 'Vi xử lí': 'Snapdragon 865+' },
							{
								SIM: '1 Nano SIM & 1 eSIMHỗ trợ 5G',
							},
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/226099/samsung-galaxy-z-fold-2-den-',
						dynamic: 16,
						file: '-org.jpg',
					},
				},
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/226099/samsung-galaxy-z-fold-2-den-200x200.jpg',
						Price: 53000000,
						// PriceSale: 3990000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình':
									'Chính: Dynamic AMOLED, Phụ: Super AMOLEDChính 7.59 & Phụ 6.23Full HD+',
							},
							{
								'Hệ điều hành': 'Android 10',
							},
							{
								'Camera sau': '3 camera 12 MP',
							},
							{
								'Camera trước': 'Trong 10 MP & Ngoài 10 MP',
							},
							{
								RAM: '12 GB',
							},
							{
								'Bộ nhớ trong': '256 GB',
							},
							{ 'Vi xử lí': 'Snapdragon 865+' },
							{
								SIM: '1 Nano SIM & 1 eSIMHỗ trợ 5G',
							},
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/226099/samsung-galaxy-z-fold-2-den-',
						dynamic: 16,
						file: '-org.jpg',
					},
				},
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/226099/samsung-galaxy-z-fold-2-den-200x200.jpg',
						Price: 60000000,
						PriceSale: 5990000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình':
									'Chính: Dynamic AMOLED, Phụ: Super AMOLEDChính 7.59 & Phụ 6.23Full HD+',
							},
							{
								'Hệ điều hành': 'Android 10',
							},
							{
								'Camera sau': '3 camera 12 MP',
							},
							{
								'Camera trước': 'Trong 10 MP & Ngoài 10 MP',
							},
							{
								RAM: '12 GB',
							},
							{
								'Bộ nhớ trong': '512 GB',
							},
							{ 'Vi xử lí': 'Snapdragon 865+' },
							{
								SIM: '1 Nano SIM & 1 eSIMHỗ trợ 5G',
							},
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/226099/samsung-galaxy-z-fold-2-den-',
						dynamic: 16,
						file: '-org.jpg',
					},
				},
			],
		},
		{
			GroupName: 'Điện thoại Samsung Galaxy S21 5G',
			brand: arrIdThuong_hieu[2],
			type: 'phone',
			product: [
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/220833/samsung-galaxy-s21-tim-200x200.jpg',
						Price: 20990000,
						PriceSale: 1990000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'Dynamic AMOLED 2X6.2 Full HD+',
							},
							{
								'Hệ điều hành': 'Android 10',
							},
							{
								'Camera sau': 'Chính 12 MP & Phụ 64 MP, 12 MP',
							},
							{
								'Camera trước': '10 MP',
							},
							{
								RAM: '8 GB',
							},
							{
								'Bộ nhớ trong': '128 GB',
							},
							{ 'Vi xử lí': 'Exynos 2100' },
							{
								SIM: '2 Nano SIM hoặc 1 Nano SIM + 1 eSIMHỗ trợ 5G',
							},
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/220833/samsung-galaxy-s21-tim-',
						dynamic: 12,
						file: '-org.jpg',
					},
				},
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/220833/samsung-galaxy-s21-trang-200x200.jpg',
						Price: 22990000,
						PriceSale: 2190000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'Dynamic AMOLED 2X6.2 Full HD+',
							},
							{
								'Hệ điều hành': 'Android 10',
							},
							{
								'Camera sau': 'Chính 12 MP & Phụ 64 MP, 12 MP',
							},
							{
								'Camera trước': '10 MP',
							},
							{
								RAM: '8 GB',
							},
							{
								'Bộ nhớ trong': '256 GB',
							},
							{ 'Vi xử lí': 'Exynos 2100' },
							{
								SIM: '2 Nano SIM hoặc 1 Nano SIM + 1 eSIMHỗ trợ 5G',
							},
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/220833/samsung-galaxy-s21-trang-',
						dynamic: 12,
						file: '-org.jpg',
					},
				},
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/220833/samsung-galaxy-s21-xam-200x200.jpg',
						Price: 24990000,
						PriceSale: 2390000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'Dynamic AMOLED 2X6.2 Full HD+',
							},
							{
								'Hệ điều hành': 'Android 10',
							},
							{
								'Camera sau': 'Chính 12 MP & Phụ 64 MP, 12 MP',
							},
							{
								'Camera trước': '10 MP',
							},
							{
								RAM: '8 GB',
							},
							{
								'Bộ nhớ trong': '512 GB',
							},
							{ 'Vi xử lí': 'Exynos 2100' },
							{
								SIM: '2 Nano SIM hoặc 1 Nano SIM + 1 eSIMHỗ trợ 5G',
							},
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/220833/samsung-galaxy-s21-xam-',
						dynamic: 12,
						file: '-org.jpg',
					},
				},
			],
		},
		{
			GroupName: 'Điện thoại Samsung Galaxy Note 20 Ultra 5G',
			brand: arrIdThuong_hieu[2],
			type: 'phone',
			product: [
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/230867/samsunggalaxynote20ultratrangnew-600x600-200x200.jpg',
						Price: 23990000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'Dynamic AMOLED 2X6.9 Quad HD+ (2K+)',
							},
							{
								'Hệ điều hành': 'Android 10',
							},
							{
								'Camera sau': 'Chính 108 MP & Phụ 12 MP, 12 MP, cảm biến Laser AF',
							},
							{
								'Camera trước': '10 MP',
							},
							{
								RAM: '12 GB',
							},
							{
								'Bộ nhớ trong': '128 GB',
							},
							{ 'Vi xử lí': 'Exynos 990' },
							{
								SIM: '2 Nano SIM hoặc 1 Nano SIM + 1 eSIMHỗ trợ 5G',
							},
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/230867/samsung-galaxy-note-20-ultra-5g-trang-',
						dynamic: 16,
						file: '-org.jpg',
					},
				},
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/230867/samsunggalaxynote20ultratrangnew-600x600-200x200.jpg',
						Price: 25990000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'Dynamic AMOLED 2X6.9 Quad HD+ (2K+)',
							},
							{
								'Hệ điều hành': 'Android 10',
							},
							{
								'Camera sau': 'Chính 108 MP & Phụ 12 MP, 12 MP, cảm biến Laser AF',
							},
							{
								'Camera trước': '10 MP',
							},
							{
								RAM: '12 GB',
							},
							{
								'Bộ nhớ trong': '256 GB',
							},
							{ 'Vi xử lí': 'Exynos 990' },
							{
								SIM: '2 Nano SIM hoặc 1 Nano SIM + 1 eSIMHỗ trợ 5G',
							},
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/230867/samsung-galaxy-note-20-ultra-5g-trang-',
						dynamic: 16,
						file: '-org.jpg',
					},
				},
			],
		},
		{
			GroupName: 'Điện thoại Samsung Galaxy Note 10+',
			brand: arrIdThuong_hieu[2],
			type: 'phone',
			product: [
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/206176/samsung-galaxy-note-10-plus-silver-new-200x200.jpg',
						Price: 17990000,
						PriceSale: 16590000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'Dynamic AMOLED6.8 Quad HD+ (2K+)',
							},
							{
								'Hệ điều hành': 'Android 9 (Pie)',
							},
							{
								'Camera sau': 'Chính 12 MP & Phụ 12 MP, 16 MP, TOF 3D',
							},
							{
								'Camera trước': '10 MP',
							},
							{
								RAM: '12 GB',
							},
							{
								'Bộ nhớ trong': '128 GB',
							},
							{ 'Vi xử lí': 'Exynos 990' },
							{
								SIM: '2 Nano SIM (SIM 2 chung khe thẻ nhớ)Hỗ trợ 4G',
							},
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/206176/samsung-galaxy-note-10-plus-bac-',
						dynamic: 13,
						file: '-org.jpg',
					},
				},
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/206176/samsung-galaxy-note-10-plus-black-new-200x200.jpg',
						Price: 19990000,
						PriceSale: 17590000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'Dynamic AMOLED6.8 Quad HD+ (2K+)',
							},
							{
								'Hệ điều hành': 'Android 9 (Pie)',
							},
							{
								'Camera sau': 'Chính 12 MP & Phụ 12 MP, 16 MP, TOF 3D',
							},
							{
								'Camera trước': '10 MP',
							},
							{
								RAM: '12 GB',
							},
							{
								'Bộ nhớ trong': '256 GB',
							},
							{ 'Vi xử lí': 'Exynos 990' },
							{
								SIM: '2 Nano SIM (SIM 2 chung khe thẻ nhớ)Hỗ trợ 4G',
							},
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/206176/samsung-galaxy-note-10-plus-den-',
						dynamic: 14,
						file: '-org.jpg',
					},
				},
			],
		},
		{
			GroupName: 'Điện thoại OPPO Find X3 Pro 5G',
			brand: arrIdThuong_hieu[3],
			type: 'phone',
			product: [
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/232190/oppo-find-x3-pro-black-001-1-200x200.jpg',
						Price: 27990000,
						PriceSale: 26590000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'AMOLED6.7 Quad HD+ (2K+)',
							},
							{
								'Hệ điều hành': 'Android 11',
							},
							{
								'Camera sau': 'Chính 50 MP & Phụ 50 MP, 13 MP, 3 MP',
							},
							{
								'Camera trước': '32 MP',
							},
							{
								RAM: '12 GB',
							},
							{
								'Bộ nhớ trong': '128 GB',
							},
							{ 'Vi xử lí': 'Snapdragon 8880' },
							{ SIM: '2 Nano SIMHỗ trợ 5G' },
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/232190/oppo-find-x3-pro-den-',
						dynamic: 13,
						file: '-org.jpg',
					},
				},
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/232190/oppo-find-x3-pro-blue-001-200x200.jpg',
						Price: 27990000,
						PriceSale: 26590000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'AMOLED6.7 Quad HD+ (2K+)',
							},
							{
								'Hệ điều hành': 'Android 11',
							},
							{
								'Camera sau': 'Chính 50 MP & Phụ 50 MP, 13 MP, 3 MP',
							},
							{
								'Camera trước': '32 MP',
							},
							{
								RAM: '12 GB',
							},
							{
								'Bộ nhớ trong': '256 GB',
							},
							{ 'Vi xử lí': 'Snapdragon 8880' },
							{ SIM: '2 Nano SIMHỗ trợ 5G' },
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/232190/oppo-find-x3-pro-xanh-',
						dynamic: 13,
						file: '-org.jpg',
					},
				},
			],
		},
		{
			GroupName: 'Điện thoại OPPO Reno5',
			brand: arrIdThuong_hieu[3],
			type: 'phone',
			product: [
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/220438/oppo-reno5-trang-600x600-1-200x200.jpg',
						Price: 8990000,
						PriceSale: 7590000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'AMOLED6.43 Full HD+',
							},
							{
								'Hệ điều hành': 'Android 11',
							},
							{
								'Camera sau': 'Chính 64 MP & Phụ 8 MP, 2 MP, 2 MP',
							},
							{
								'Camera trước': '44 MP',
							},
							{
								RAM: '12 GB',
							},
							{
								'Bộ nhớ trong': '128 GB',
							},
							{ 'Vi xử lí': 'Snapdragon 720G' },
							{ SIM: '2 Nano SIMHỗ trợ 4G' },
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/220438/oppo-reno5-bac-',
						dynamic: 13,
						file: '-org.jpg',
					},
				},
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/220438/oppo-reno5-den-600x600-1-200x200.jpg',
						Price: 9990000,
						PriceSale: 8590000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'AMOLED6.43 Full HD+',
							},
							{
								'Hệ điều hành': 'Android 11',
							},
							{
								'Camera sau': 'Chính 64 MP & Phụ 8 MP, 2 MP, 2 MP',
							},
							{
								'Camera trước': '44 MP',
							},
							{
								RAM: '12 GB',
							},
							{
								'Bộ nhớ trong': '256 GB',
							},
							{ 'Vi xử lí': 'Snapdragon 720G' },
							{ SIM: '2 Nano SIMHỗ trợ 4G' },
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/220438/oppo-reno5-den-',
						dynamic: 13,
						file: '-org.jpg',
					},
				},
			],
		},
		{
			GroupName: 'Điện thoại OPPO A74 5G',
			brand: arrIdThuong_hieu[3],
			type: 'phone',
			product: [
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/236559/oppo-a74-5g-silver-01-200x200.jpg',
						Price: 6990000,
						PriceSale: 5590000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'IPS LCD6.5 Full HD+',
							},
							{
								'Hệ điều hành': 'Android 11',
							},
							{
								'Camera sau': 'Chính 64 MP & Phụ 8 MP, 2 MP, 2 MP',
							},
							{
								'Camera trước': '44 MP',
							},
							{
								RAM: '12 GB',
							},
							{
								'Bộ nhớ trong': '128 GB',
							},
							{
								'Vi xử lí': 'Snapdragon 480 8 nhân 5G',
							},
							{ SIM: '2 Nano SIMHỗ trợ 5G' },
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/236559/oppo-a74-5g-bac-',
						dynamic: 13,
						file: '-org.jpg',
					},
				},
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/236559/oppo-a74-5g-black-01-200x200.jpg',
						Price: 8990000,
						PriceSale: 7690000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'IPS LCD6.5 Full HD+',
							},
							{
								'Hệ điều hành': 'Android 11',
							},
							{
								'Camera sau': 'Chính 64 MP & Phụ 8 MP, 2 MP, 2 MP',
							},
							{
								'Camera trước': '44 MP',
							},
							{
								RAM: '12 GB',
							},
							{
								'Bộ nhớ trong': '256 GB',
							},
							{
								'Vi xử lí': 'Snapdragon 480 8 nhân 5G',
							},
							{ SIM: '2 Nano SIMHỗ trợ 5G' },
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/236559/oppo-a74-5g-den-',
						dynamic: 13,
						file: '-org.jpg',
					},
				},
			],
		},
		{
			GroupName: 'Điện thoại Vivo Y72 5G ',
			brand: arrIdThuong_hieu[4],
			type: 'phone',
			product: [
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/236431/vivo-y72-5g-blue-200x200.jpg',
						Price: 7990000,
						PriceSale: 7590000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'IPS LCD6.58 Full HD+',
							},
							{
								'Hệ điều hành': 'Android 11',
							},
							{
								'Camera sau': 'Chính 64 MP & Phụ 8 MP, 2 MP',
							},
							{
								'Camera trước': '16 MP',
							},
							{
								RAM: '12 GB',
							},
							{
								'Bộ nhớ trong': '128 GB',
							},
							{
								'Vi xử lí': 'MediaTek Dimensity 700',
							},
							{
								SIM: '2 Nano SIM (SIM 2 chung khe thẻ nhớ)Hỗ trợ 5G',
							},
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/236431/vivo-y72-5g-xanh-hong-',
						dynamic: 12,
						file: '-1-org.jpg',
					},
				},
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/236431/vivo-y72-5g-black-200x200.jpg',
						Price: 8990000,
						PriceSale: 8590000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'IPS LCD6.58 Full HD+',
							},
							{
								'Hệ điều hành': 'Android 11',
							},
							{
								'Camera sau': 'Chính 64 MP & Phụ 8 MP, 2 MP',
							},
							{
								'Camera trước': '16 MP',
							},
							{
								RAM: '12 GB',
							},
							{
								'Bộ nhớ trong': '256 GB',
							},
							{
								'Vi xử lí': 'MediaTek Dimensity 700',
							},
							{
								SIM: '2 Nano SIM (SIM 2 chung khe thẻ nhớ)Hỗ trợ 5G',
							},
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/236431/vivo-y72-5g-den-',
						dynamic: 12,
						file: '-org.jpg',
					},
				},
			],
		},
		{
			GroupName: 'Điện thoại Vivo V21 5G',
			brand: arrIdThuong_hieu[4],
			type: 'phone',
			product: [
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/238047/vivo-v21-5g-xanh-den-200x200.jpg',
						Price: 9990000,
						PriceSale: 8590000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'AMOLED6.44 Full HD+',
							},
							{
								'Hệ điều hành': 'Android 11',
							},
							{
								'Camera sau': 'Chính 64 MP & Phụ 8 MP, 2 MP',
							},
							{
								'Camera trước': '16 MP',
							},
							{
								RAM: '12 GB',
							},
							{
								'Bộ nhớ trong': '128 GB',
							},
							{
								'Vi xử lí': 'MediaTek Dimensity 800U 5G',
							},
							{ SIM: '2 Nano SIMHỗ trợ 5G' },
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/238047/vivo-v21-5g-xanh-den-',
						dynamic: 12,
						file: '-1-org.jpg',
					},
				},
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/238047/vivo-v21-5g-tim-hong-200x200.jpg',
						Price: 10990000,
						PriceSale: 9590000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'IPS LCD6.58 Full HD+',
							},
							{
								'Hệ điều hành': 'Android 11',
							},
							{
								'Camera sau': 'Chính 64 MP & Phụ 8 MP, 2 MP',
							},
							{
								'Camera trước': '16 MP',
							},
							{
								RAM: '12 GB',
							},
							{
								'Bộ nhớ trong': '256 GB',
							},
							{
								'Vi xử lí': 'MediaTek Dimensity 700',
							},
							{
								SIM: '2 Nano SIM (SIM 2 chung khe thẻ nhớ)Hỗ trợ 5G',
							},
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/238047/vivo-v21-5g-tim-hong-',
						dynamic: 12,
						file: '-3-org.jpg',
					},
				},
			],
		},
		{
			GroupName: 'Điện thoại Vivo Y53s',
			brand: arrIdThuong_hieu[4],
			type: 'phone',
			product: [
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/240286/vivo-y53s-xanh-tim-1-org.jpg',
						Price: 6990000,
						PriceSale: 6590000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'AMOLED6.44 Full HD+',
							},
							{
								'Hệ điều hành': 'Android 11',
							},
							{
								'Camera sau': 'Chính 64 MP & Phụ 8 MP, 2 MP',
							},
							{
								'Camera trước': '16 MP',
							},
							{
								RAM: '12 GB',
							},
							{
								'Bộ nhớ trong': '128 GB',
							},
							{
								'Vi xử lí': 'MediaTek Dimensity 800U 5G',
							},
							{ SIM: '2 Nano SIMHỗ trợ 5G' },
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/240286/vivo-y53s-xanh-tim-',
						dynamic: 12,
						file: '-org.jpg',
					},
				},
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/240286/vivo-y53s-den-200x200.jpg',
						Price: 7990000,
						PriceSale: 7590000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'AMOLED6.44 Full HD+',
							},
							{
								'Hệ điều hành': 'Android 11',
							},
							{
								'Camera sau': 'Chính 64 MP & Phụ 8 MP, 2 MP',
							},
							{
								'Camera trước': '16 MP',
							},
							{
								RAM: '12 GB',
							},
							{
								'Bộ nhớ trong': '256 GB',
							},
							{
								'Vi xử lí': 'MediaTek Dimensity 800U 5G',
							},
							{ SIM: '2 Nano SIMHỗ trợ 5G' },
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/240286/vivo-y53s-den-',
						dynamic: 12,
						file: '-org.jpg',
					},
				},
			],
		},
		{
			GroupName: 'Điện thoại Vivo Y51 (2020) ',
			brand: arrIdThuong_hieu[4],
			type: 'phone',
			product: [
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/228950/vivo-y51-bac-600x600-200x200.jpg',
						Price: 6290000,
						PriceSale: 5990000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'IPS LCD6.58 Full HD+',
							},
							{
								'Hệ điều hành': 'Android 11',
							},
							{
								'Camera sau': 'Chính 48 MP & Phụ 8 MP, 2 MP',
							},
							{
								'Camera trước': '16 MP',
							},
							{
								RAM: '12 GB',
							},
							{
								'Bộ nhớ trong': '128 GB',
							},
							{
								'Vi xử lí': 'MediaTek Dimensity 800U 5G',
							},
							{ SIM: '2 Nano SIMHỗ trợ 5G' },
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/228950/vivo-y51-2020-tim-bac-',
						dynamic: 12,
						file: '-org.jpg',
					},
				},
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/42/228950/vivo-y51-xanhduong-600x600-200x200.jpg',
						Price: 7990000,
						PriceSale: 7490000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': 'AMOLED6.44 Full HD+',
							},
							{
								'Hệ điều hành': 'Android 11',
							},
							{
								'Camera sau': 'Chính 64 MP & Phụ 8 MP, 2 MP',
							},
							{
								'Camera trước': '16 MP',
							},
							{
								RAM: '12 GB',
							},
							{
								'Bộ nhớ trong': '256 GB',
							},
							{
								'Vi xử lí': 'MediaTek Dimensity 800U 5G',
							},
							{ SIM: '2 Nano SIMHỗ trợ 5G' },
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/42/228950/vivo-y51-2020-xanh-duong-',
						dynamic: 12,
						file: '-org.jpg',
					},
				},
			],
		},
		{
			GroupName: 'Máy tính bảng iPad Pro M1 12.9 inch WiFi Cellular 256GB (2021)',
			brand: arrIdThuong_hieu[0],
			type: 'tablet',
			product: [
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/522/238651/ipad-pro-2021-129-inch-gray-200x200.jpg',
						Price: 43990000,
						PriceSale: 40990000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': '12.9 Liquid Retina XDR mini-LED LCD',
							},
							{
								'Hệ điều hành': 'iPadOS 14',
							},
							{
								'Camera sau': 'Chính 48 MP & Phụ 8 MP, 2 MP',
							},
							{
								'Camera trước': '16 MP',
							},
							{
								RAM: '8 GB',
							},
							{
								'Bộ nhớ trong': '512 GB',
							},
							{ 'Vi xử lí': 'Apple M1 8 nhân' },
							{ SIM: '1 Nano SIM hoặc 1 eSIM' },
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/522/238651/ipad-pro-m1-129-inch-wifi-cellular-256gb-2021-xam-',
						dynamic: 2,
						file: '-org.jpg',
					},
				},
			],
		},
		{
			GroupName: 'Máy tính bảng iPad Air 4 Wifi 64GB (2020)',
			brand: arrIdThuong_hieu[0],
			type: 'tablet',
			product: [
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/522/228808/ipad-air-4-wifi-64gb-2020-xanhduong-600x600-200x200.jpg',
						Price: 16990000,
						PriceSale: 15990000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': '10.9 Liquid Retina',
							},
							{
								'Hệ điều hành': 'iPadOS 14',
							},
							{
								'Camera sau': 'Chính 48 MP & Phụ 8 MP, 2 MP',
							},
							{
								'Camera trước': '16 MP',
							},
							{
								RAM: '8 GB',
							},
							{
								'Bộ nhớ trong': '256 GB',
							},
							{ 'Vi xử lí': 'Apple A14 Bionic' },
							{ SIM: '1 Nano SIM hoặc 1 eSIM' },
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/522/228808/ipad-air-4-sky-blue-',
						dynamic: 1,
						file: '020x680-org.jpg',
					},
				},
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/522/228808/ipad-air-4-wifi-64gb-2020-bac-600x600-200x200.jpg',
						Price: 15990000,
						PriceSale: 14990000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': '10.9 Liquid Retina',
							},
							{
								'Hệ điều hành': 'iPadOS 14',
							},
							{
								'Camera sau': 'Chính 48 MP & Phụ 8 MP, 2 MP',
							},
							{
								'Camera trước': '16 MP',
							},
							{
								RAM: '8 GB',
							},
							{
								'Bộ nhớ trong': '128 GB',
							},
							{ 'Vi xử lí': 'Apple A14 Bionic' },
							{ SIM: '1 Nano SIM hoặc 1 eSIM' },
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/522/228808/ipad-air-4-silver-',
						dynamic: 1,
						file: '020x680-org.jpg',
					},
				},
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/522/228808/ipad-air-4-wifi-64gb-2020-xam-600x600-200x200.jpg',
						Price: 18990000,
						PriceSale: 17990000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': '10.9 Liquid Retina',
							},
							{
								'Hệ điều hành': 'iPadOS 14',
							},
							{
								'Camera sau': 'Chính 48 MP & Phụ 8 MP, 2 MP',
							},
							{
								'Camera trước': '16 MP',
							},
							{
								RAM: '8 GB',
							},
							{
								'Bộ nhớ trong': '512 GB',
							},
							{ 'Vi xử lí': 'Apple A14 Bionic' },
							{ SIM: '1 Nano SIM hoặc 1 eSIM' },
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/522/228808/ipad-air-4-grey-',
						dynamic: 1,
						file: '020x680-org.jpg',
					},
				},
			],
		},
		{
			GroupName: 'Máy tính bảng Samsung Galaxy Tab S7',
			brand: arrIdThuong_hieu[2],
			type: 'tablet',
			product: [
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/522/225031/samsung-galaxy-tab-s7-gold-new-200x200.jpg',
						Price: 18490000,
						PriceSale: 17990000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': '11 LTPS IPS LCD',
							},
							{
								'Hệ điều hành': 'Android 10',
							},
							{
								'Camera sau': 'Chính 13 MP & Phụ 5 MP',
							},
							{
								'Camera trước': '16 MP',
							},
							{
								RAM: '8 GB',
							},
							{
								'Bộ nhớ trong': '128 GB',
							},
							{ 'Vi xử lí': 'Snapdragon 865+' },
							{ SIM: '1 Nano SIM hoặc 1 eSIM' },
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/522/225031/samsung-galaxy-tab-s7-vang-dong-',
						dynamic: 15,
						file: '-org.jpg',
					},
				},
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/522/225031/samsung-galaxy-tab-s7-black-new-200x200.jpg',
						Price: 19490000,
						PriceSale: 18990000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': '11 LTPS IPS LCD',
							},
							{
								'Hệ điều hành': 'Android 10',
							},
							{
								'Camera sau': 'Chính 13 MP & Phụ 5 MP',
							},
							{
								'Camera trước': '16 MP',
							},
							{
								RAM: '8 GB',
							},
							{
								'Bộ nhớ trong': '256 GB',
							},
							{ 'Vi xử lí': 'Snapdragon 865+' },
							{ SIM: '1 Nano SIM hoặc 1 eSIM' },
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/522/225031/samsung-galaxy-tab-s7-den-',
						dynamic: 14,
						file: '-org.jpg',
					},
				},
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/522/225031/samsung-galaxy-tab-s7-thumb-xanh-600x600-200x200.jpg',
						Price: 21490000,
						PriceSale: 20990000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': '11 LTPS IPS LCD',
							},
							{
								'Hệ điều hành': 'Android 10',
							},
							{
								'Camera sau': 'Chính 13 MP & Phụ 5 MP',
							},
							{
								'Camera trước': '16 MP',
							},
							{
								RAM: '8 GB',
							},
							{
								'Bộ nhớ trong': '128 GB',
							},
							{ 'Vi xử lí': 'Snapdragon 865+' },
							{ SIM: '1 Nano SIM hoặc 1 eSIM' },
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/522/225031/samsung-galaxy-tab-s7-xanh-duong-',
						dynamic: 16,
						file: '-org.jpg',
					},
				},
			],
		},
		{
			GroupName: 'Máy tính bảng Samsung Galaxy Tab A7 Lite ',
			brand: arrIdThuong_hieu[2],
			type: 'tablet',
			product: [
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/522/237325/samsung-galaxy-tab-a7-lite-gray-200x200.jpg',
						Price: 5490000,
						PriceSale: 4990000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': '8.7 TFT LCD',
							},
							{
								'Hệ điều hành': 'Android 10',
							},
							{
								'Camera sau': 'Chính 13 MP & Phụ 5 MP',
							},
							{
								'Camera trước': '16 MP',
							},
							{
								RAM: '3 GB',
							},
							{
								'Bộ nhớ trong': '64 GB',
							},
							{
								'Vi xử lí': 'MediaTek MT8768T 8 nhân',
							},
							{ SIM: '1 Nano SIM hoặc 1 eSIM' },
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/522/237325/samsung-galaxy-tab-a7-lite-',
						dynamic: 13,
						file: '-2-org.jpg',
					},
				},
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/522/237325/samsung-galaxy-tab-a7-lite-sliver-200x200.jpg',
						Price: 5490000,
						PriceSale: 4990000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': '8.7 TFT LCD',
							},
							{
								'Hệ điều hành': 'Android 10',
							},
							{
								'Camera sau': 'Chính 13 MP & Phụ 5 MP',
							},
							{
								'Camera trước': '16 MP',
							},
							{
								RAM: '3 GB',
							},
							{
								'Bộ nhớ trong': '128 GB',
							},
							{
								'Vi xử lí': 'MediaTek MT8768T 8 nhân',
							},
							{ SIM: '1 Nano SIM hoặc 1 eSIM' },
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/522/237325/samsung-galaxy-tab-a7-lite-',
						dynamic: 13,
						file: '-3-org.jpg',
					},
				},
			],
		},
		{
			GroupName: 'Máy tính bảng Samsung Galaxy Tab A8 8 T295 (2019)',
			brand: arrIdThuong_hieu[2],
			type: 'tablet',
			product: [
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/522/205751/samsung-galaxy-tab-a8-t295-2019-silver-1-200x200.jpg',
						Price: 3490000,
						PriceSale: 2990000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': '8 TFT LCD',
							},
							{
								'Hệ điều hành': 'Android 10',
							},
							{
								'Camera sau': 'Chính 13 MP & Phụ 5 MP',
							},
							{
								'Camera trước': '32 MP',
							},
							{
								RAM: '2 GB',
							},
							{
								'Bộ nhớ trong': '64 GB',
							},
							{ 'Vi xử lí': 'Snapdragon 429' },
							{ SIM: '1 Nano SIM hoặc 1 eSIM' },
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/522/205751/samsung-galaxy-tab-a8-t295-2019-bac-',
						dynamic: 11,
						file: '-org.jpg',
					},
				},
				{
					productName: '',
					Information: {
						DisplayImage:
							'https://cdn.tgdd.vn/Products/Images/522/205751/samsung-galaxy-tab-a8-t295-2019-black-1-200x200.jpg',
						Price: 4090000,
						PriceSale: 3990000,
						RemainingAmount: RemainingAmountSetting,
						Configuration: [
							{
								'Màn hình': '8.7 TFT LCD',
							},
							{
								'Hệ điều hành': 'Android 10',
							},
							{
								'Camera sau': 'Chính 13 MP & Phụ 5 MP',
							},
							{
								'Camera trước': '16 MP',
							},
							{
								RAM: '3 GB',
							},
							{
								'Bộ nhớ trong': '64 GB',
							},
							{
								'Vi xử lí': 'MediaTek MT8768T 8 nhân',
							},
							{ SIM: '1 Nano SIM hoặc 1 eSIM' },
						],
					},
					Image: {
						path: 'https://cdn.tgdd.vn/Products/Images/522/205751/samsung-galaxy-tab-a8-t295-2019-den-',
						dynamic: 10,
						file: '-org.jpg',
					},
				},
			],
		},
	];
	const evaluateList = [
		{
			Star: 1,
			ContentRated: 'Sản phẩm tệ',
		},
		{
			Star: 2,
			ContentRated: 'Sản phẩm tạm được',
		},
		{
			Star: 3,
			ContentRated: 'Sản phẩm được',
		},
		{
			Star: 4,
			ContentRated: 'Tôi rất thích sản phẩm này, nó rất tốt!',
		},
		{
			Star: 5,
			ContentRated: 'Sản phẩm Rất tốt. Tôi muốn muya thêm một cái nữa!',
		},
	];

	const RandomEvaluate = Id_User => {
		// 0 -4
		const randomNumber = Math.floor(Math.random() * 5);
		return {
			Id_User,
			...evaluateList[randomNumber],
		};
	};
	const commentList = [
		{
			CommentContent: 'Sản phẩm này có trả góp ko',
			Reply: [
				{
					type: 'admin',
					ReplyContent: 'Dạ có ạ',
				},
				{
					ReplyContent: 'oke',
				},
			],
		},
		{
			CommentContent: 'bên shop còn máy này ko ạ|?',
			Reply: [
				{
					type: 'admin',
					ReplyContent: `Dạ model đã hết máy ạ Anh có thể inbox lên fanpage hoặc liên hệ qua hotline  để bên em hỗ trợ tư vấn cho anh ạ`,
				},
				{ ReplyContent: 'cảm ơn' },
			],
		},
	];

	// tao user
	//tạo admin
	for (let index = 0; index < Admin_.length; index++) {
		const Obj = new Admin({
			DisplayName: Admin_[index].name,
			UserName: Admin_[index].username,
			Avatar: Admin_[index].anhdaidien,
			Password: await hashPassword.hash(Admin_[index].password),
		});

		await Obj.save(function (err) {
			if (err) {
				console.log(err);
				console.log(err.message.split(': ')[2]);
				console.log('Admin không insert được tại ; ', index);
				return;
			}

			// saved!
		});
		arr_id_admin.push(Obj.id);
	}
	for (let index = 0; index < so_nguoi_dung; index++) {
		const Obj = new User({
			Name: `${faker.name.lastName()} ${faker.name.firstName()}`,
			PhoneNumber: faker.phone.phoneNumber(`${header_phone}########`),
			Password: await hashPassword.hash(default_pass),
		});
		const createMes = Id_User => {
			let arr = [];
			for (let v = 0; v < countMess; v++) {
				const randomNumber = Math.floor(Math.random() * 20);
				if (randomNumber % 2 == 0) {
					arr.push({
						Id_User,
						MessengerContent: faker.lorem.paragraphs(
							faker.random.number({
								min: 1,
								max: 2,
							})
						),
					});
				} else {
					arr.push({
						Id_User: arr_id_admin[0],
						MessengerContent: faker.lorem.paragraphs(
							faker.random.number({
								min: 1,
								max: 2,
							})
						),
						Role: 'admin',
					});
				}
			}
			return arr;
		};
		Obj.Message = createMes(Obj.id);

		await Obj.save(function (err) {
			if (err) {
				console.log(err);
				console.log(err.message.split(': ')[2]);
				console.log('Nguoi dung không insert được tại ; ', index);
				return;
			}

			// saved!
		});
		arr_id_user.push(Obj.id);
	}
	const randomId_User = () => {
		const length = arr_id_user.length;
		const randomNumber = Math.floor(Math.random() * length);
		return arr_id_user[randomNumber];
	};

	//#endregion
	const ArrSanPham = await (async arr => {
		let arrSp = [];
		for (const item of arr) {
			const newObject = {
				GroupName: item.GroupName,
				Brand: item.brand,
				ProductType: item.type,
				Describe: MoTa,
				Product: await (async props => {
					let b = [];
					for (const item2 of props) {
						const { ram, memory } = (d => {
							let f = {};
							d.forEach((item3, id3) => {
								if (item3.RAM) {
									f.ram = item3.RAM;
								}
								if (item3['Bộ nhớ trong']) {
									f.memory = item3['Bộ nhớ trong'];
								}
							});
							return f;
						})(item2.Information.Configuration);

						const namePro = `${item.GroupName} ${ram} ${memory}`;
						const pathPro = FormatUrlToEN(namePro);
						// get image
						const ArrImage = await (async g => {
							let n = 1;
							let arrImgNew = [];
							if (item.type == 'phone') {
								if (g.start) {
									for (let k = g.start; k <= g.dynamic; k++) {
										const urlImageTgdd = `${g.path}${k}${g.file}`;
										const saveMongo = `${publicforderPhone}${pathPro}-${n}-org.jpg`;
										var options = {
											url: urlImageTgdd,
											dest: `${savePublicForder}${pathPro}-${n}-org.jpg`, // will be saved to /path/to/dest/photo.jpg
										};
										n += 1;
										await download
											.image(options)
											.then(({ filename }) => {
												arrImgNew.push(saveMongo);
												console.log('Saved to', filename); // saved to /path/to/dest/photo.jpg
											})
											.catch(err => console.error(err));
									}
								} else {
									for (let k = 1; k <= g.dynamic; k++) {
										const urlImageTgdd = `${g.path}${k}${g.file}`;
										const saveMongo = `${publicforderPhone}${pathPro}-${k}-org.jpg`;
										var options = {
											url: urlImageTgdd,
											dest: `${savePublicForder}${pathPro}-${k}-org.jpg`, // will be saved to /path/to/dest/photo.jpg
										};

										await download
											.image(options)
											.then(({ filename }) => {
												arrImgNew.push(saveMongo);

												console.log('Saved to', filename); // saved to /path/to/dest/photo.jpg
											})
											.catch(err => console.error(err));
									}
								}
							} else {
								if (g.start) {
									for (let k = g.start; k <= g.dynamic; k++) {
										const urlImageTgdd = `${g.path}${k}${g.file}`;
										const saveMongo = `${publicforderTablet}${pathPro}-${n}-org.jpg`;
										var options = {
											url: urlImageTgdd,
											dest: `${savePublicForderTablet}${pathPro}-${n}-org.jpg`, // will be saved to /path/to/dest/photo.jpg
										};
										n += 1;
										await download
											.image(options)
											.then(({ filename }) => {
												arrImgNew.push(saveMongo);
												console.log('Saved to', filename); // saved to /path/to/dest/photo.jpg
											})
											.catch(err => console.error(err));
									}
								} else {
									for (let k = 1; k <= g.dynamic; k++) {
										const urlImageTgdd = `${g.path}${k}${g.file}`;
										const saveMongo = `${publicforderTablet}${pathPro}-${k}-org.jpg`;
										var options = {
											url: urlImageTgdd,
											dest: `${savePublicForderTablet}${pathPro}-${k}-org.jpg`, // will be saved to /path/to/dest/photo.jpg
										};

										await download
											.image(options)
											.then(({ filename }) => {
												arrImgNew.push(saveMongo);

												console.log('Saved to', filename); // saved to /path/to/dest/photo.jpg
											})
											.catch(err => console.error(err));
									}
								}
							}

							return arrImgNew;
						})(item2.Image);
						// get display img
						const displayImg = await (async url => {
							let strDisplay = '';
							if (item.type == 'phone') {
								const saveMongo = `${publicforderPhone}${pathPro}-org.jpg`;

								var options = {
									url: url,
									dest: `${savePublicForder}${pathPro}-org.jpg`, // will be saved to /path/to/dest/photo.jpg
								};

								await download
									.image(options)
									.then(({ filename }) => {
										strDisplay = saveMongo;

										console.log('Saved to', filename); // saved to /path/to/dest/photo.jpg
									})
									.catch(err => console.error(err));
							} else {
								const saveMongo = `${publicforderTablet}${pathPro}-org.jpg`;

								var options = {
									url: url,
									dest: `${savePublicForderTablet}${pathPro}-org.jpg`, // will be saved to /path/to/dest/photo.jpg
								};

								await download
									.image(options)
									.then(({ filename }) => {
										strDisplay = saveMongo;

										console.log('Saved to', filename); // saved to /path/to/dest/photo.jpg
									})
									.catch(err => console.error(err));
							}
							return strDisplay;
						})(item2.Information.DisplayImage);
						const EvaluateList = () => {
							const list_evaluate = [];
							const array_id_user_unique = [];
							for (let z = 0; z < CountEvaluate; ) {
								const new_id_user = randomId_User();
								if (array_id_user_unique.indexOf(new_id_user) == -1) {
									array_id_user_unique.push(new_id_user);
									list_evaluate.push(RandomEvaluate(new_id_user));
									z += 1;
								}
							}
							return list_evaluate;
						};
						const getComment = id_Admin => {
							let arr = [];
							for (let index = 0; index < CountComment; index++) {
								commentList.forEach((item, key) => {
									const Id_User = randomId_User();
									arr.push({
										Id_User,
										CommentContent: item.CommentContent,
										Reply: (() => {
											let arr_ = [];
											item.Reply.forEach(item2 => {
												if (item2.type == 'admin') {
													arr_.push({
														Id_User: id_Admin,
														ReplyContent: item2.ReplyContent,
														Role: 'admin',
													});
												} else {
													arr_.push({
														Id_User,
														ReplyContent: item2.ReplyContent,
													});
												}
											});
											return arr_;
										})(),
									});
								});
							}

							return arr;
						};
						b.push({
							ProductName: namePro,
							Path: pathPro,
							Information: {
								...item2.Information,
								DisplayImage: displayImg,
							},
							Image: ArrImage,
							Evaluate: EvaluateList(),
							Comment: getComment(arr_id_admin[0]),
						});
					}

					return b;
				})(item.product),
			};

			const Obj = new GroupProduct(newObject);
			await Obj.save(function (err) {
				if (err) {
					console.log(err);
					console.log(err.message.split(': ')[2]);
					console.log('Nhóm sản phẩm không insert được tại ; ', index);
				}
				arrSp.push(newObject);

				// saved!
			});
			arrIdNhoai_san_ph.push(Obj.id);
		}

		return arrSp;
	})(NhomSanPham);

	fs.writeFile('./data.json', JSON.stringify(ArrSanPham), () => {});

	console.log('GroupProduct-----------------------------');
	console.log('tạo bài viết');
	const contentPost = `
	<h3><strong>Trong những tháng cuối năm 2020,&nbsp;</strong><a href="https://www.thegioididong.com/apple" rel="noopener noreferrer" target="_blank" style="color:rgb(47, 128, 237)"><strong>Apple</strong></a><strong>&nbsp;đã chính thức giới thiệu đến người dùng cũng như iFan thế hệ iPhone&nbsp;12&nbsp;series&nbsp;mới với hàng loạt tính năng bứt phá, thiết kế được lột xác hoàn toàn, hiệu năng đầy mạnh mẽ và một trong số đó chính là&nbsp;</strong><a href="https://www.thegioididong.com/dtdd/iphone-12" rel="noopener noreferrer" target="_blank" style="color:rgb(47, 128, 237)"><strong>iPhone 12 64GB</strong></a><strong>.</strong></h3><h3><strong>Hiệu năng vượt xa mọi giới hạn</strong></h3><p>Apple đã trang bị con chip mới nhất của hãng (tính đến 11/2020) cho iPhone 12 đó là&nbsp;<a href="https://www.thegioididong.com/hoi-dap/tim-hieu-ve-chip-apple-a14-bionic-tren-iphone-12-va-ipad-1290695" rel="noopener noreferrer" target="_blank" style="color:rgb(47, 128, 237)">A14 Bionic</a>, được sản xuất trên tiến trình 5 nm với hiệu suất ổn định hơn so với chip A13 được trang bị trên phiên bản tiền nhiệm&nbsp;<a href="https://www.thegioididong.com/dtdd/iphone-11" rel="noopener noreferrer" target="_blank" style="color:rgb(47, 128, 237)">iPhone 11</a>.</p><p><br></p><p><a href="https://www.thegioididong.com/images/42/213031/iphone-12-144220-044259.jpg" rel="noopener noreferrer" target="_blank" style="color:rgb(47, 128, 237)"><img src="https://cdn.tgdd.vn/Products/Images/42/213031/iphone-12-144220-044259.jpg"></a></p><p>Xem thêm:&nbsp;<a href="https://www.thegioididong.com/hoi-dap/tim-hieu-ve-chip-apple-a14-bionic-tren-iphone-12-va-ipad-1290695" rel="noopener noreferrer" target="_blank" style="color:rgb(47, 128, 237)">Tìm hiểu về chip Apple A14 Bionic trên iPhone 12 và iPad Air 2020</a></p><p>Với CPU Apple A14 Bionic, bạn có thể dễ dàng trải nghiệm mọi tựa game với những pha chuyển cảnh mượt mà hay hàng loạt hiệu ứng đồ họa tuyệt đẹp ở mức đồ họa cao mà không lo tình trạng giật lag.</p><p><br></p><p><a href="https://www.thegioididong.com/images/42/213031/iphone-12-18.jpg" rel="noopener noreferrer" target="_blank" style="color:rgb(47, 128, 237)"><img src="https://cdn.tgdd.vn/Products/Images/42/213031/iphone-12-18.jpg"></a></p><p><br></p><p>Chưa hết, Apple còn gây bất ngờ đến người dùng với hệ thống 5G lần đầu tiên được trang bị trên những chiếc&nbsp;<a href="https://www.thegioididong.com/dtdd-apple-iphone" rel="noopener noreferrer" target="_blank" style="color:rgb(47, 128, 237)">iPhone</a>, cho tốc độ truyền tải dữ liệu nhanh hơn, ổn định hơn.</p><p><br></p><p><a href="https://www.thegioididong.com/images/42/213031/iphone-12-20.jpg" rel="noopener noreferrer" target="_blank" style="color:rgb(47, 128, 237)"><img src="https://cdn.tgdd.vn/Products/Images/42/213031/iphone-12-20.jpg"></a></p><p><br></p><p>iPhone 12 sẽ chạy trên hệ điều hành&nbsp;<a href="https://www.thegioididong.com/hoi-dap/ios-14-va-5-tinh-nang-moi-thu-vi-khong-the-bo-qua-tren-1268933" rel="noopener noreferrer" target="_blank" style="color:rgb(47, 128, 237)">iOS 14</a>&nbsp;với nhiều tính năng hấp dẫn như hỗ trợ Widget cũng như những nâng cấp tối ưu phần mềm đáng kể mang lại những trải nghiệm thú vị mới lạ đến người dùng.</p><p><br></p><p><a href="https://www.thegioididong.com/images/42/213031/iphone-12-13.jpg" rel="noopener noreferrer" target="_blank" style="color:rgb(47, 128, 237)"><img src="https://cdn.tgdd.vn/Products/Images/42/213031/iphone-12-13.jpg"></a></p><p><br></p><h3><strong>Cụm camera không ngừng cải tiến</strong></h3><p>iPhone 12 được trang bị hệ thống camera kép bao gồm&nbsp;<a href="https://www.thegioididong.com/dtdd-camera-goc-rong" rel="noopener noreferrer" target="_blank" style="color:rgb(47, 128, 237)">camera góc rộng</a>&nbsp;và camera siêu rộng có cùng độ phân giải là 12 MP, chế độ ban đêm (<a href="https://www.thegioididong.com/hoi-dap/che-do-chup-dem-night-mode-la-gi-907873" rel="noopener noreferrer" target="_blank" style="color:rgb(47, 128, 237)">Night Mode</a>) trên bộ đôi camera này cũng đã được nâng cấp về phần cứng lẫn thuật toán xử lý, khi chụp những bức ảnh thiếu sáng bạn sẽ nhận được kết quả ấn tượng với màu sắc, độ chi tiết rõ nét đáng kinh ngạc.</p><p><br></p><p><a href="https://www.thegioididong.com/images/42/213031/iphone-12-040321-030344.jpg" rel="noopener noreferrer" target="_blank" style="color:rgb(47, 128, 237)"><img src="https://cdn.tgdd.vn/Products/Images/42/213031/iphone-12-040321-030344.jpg"></a></p><p><br></p><p>Bạn có thể khám phá thêm những tính năng của camera trên iPhone 12 như chế độ smart HDR 3 giúp cân bằng yếu tố ánh sáng trong ảnh, làm nổi bật chi tiết đối tượng và cây cối trong khi vẫn giữ được màu sắc phong phú của bầu trời ngay cả vào buổi trưa nắng gắt.</p><p><br></p><p><a href="https://www.thegioididong.com/images/42/213031/iphone-12-9.jpg" rel="noopener noreferrer" target="_blank" style="color:rgb(47, 128, 237)"><img src="https://cdn.tgdd.vn/Products/Images/42/213031/iphone-12-9.jpg"></a></p><p><br></p><p>Chế độ chụp chân dung đã tốt nay còn tốt hơn trong việc làm mờ hậu cảnh một cách nghệ thuật để dồn hết sự tập trung vào đối tượng mà bạn muốn chụp.</p><p><br></p><p><br></p><p><br></p><p>Bạn sẽ dễ dàng quay video 4K HDR với chuẩn điện ảnh&nbsp;<a href="https://www.thegioididong.com/hoi-dap/dolby-vision-la-gi-cac-ung-dung-noi-bat-va-nhung-loai-1226284" rel="noopener noreferrer" target="_blank" style="color:rgb(47, 128, 237)">Dolby Vision</a>&nbsp;và chỉnh sửa ngay trên chiếc điện thoại của mình, bạn có thể đưa video lên TV của bạn để thưởng thức thước phim sắc nét chất lượng cao.</p><p><br></p><p><br></p><p><br></p><p>Sự kết hợp của 2 cảm biến chất lượng này đã tạo nên một hệ thống camera chuyên nghiệp không khác gì những chiếc máy ảnh thực thụ, dễ dàng đem lại những bức hình sắc nét tuyệt đối, độ chi tiết cao và đa dạng chế độ chụp cho người dùng linh hoạt sử dụng.</p><p><br></p><h3><strong>Ghi dấu ấn về mặt thiết kế</strong></h3><p>Về ngoại hình iPhone 12 có thiết kế hoài niệm với phần cạnh được làm vuông vức tương tự trên mẫu iPhone 4 thay vì bo cong như iPhone 11.</p><p><br></p><p><br></p><p><br></p><p>Ở mặt trước iPhone 12 phần tai thỏ được làm nhỏ gọn hơn và cũng là nơi chứa cảm biến Face ID có thể nhận diện khuôn mặt một cách nhanh chóng và chính xác.</p><p>Apple còn mang đến cho người một loạt gam màu cá tính, độc đáo trên những chiếc iPhone của mình để người dùng có sự lựa chọn phù hợp với những phong cách khác nhau.</p><p><br></p><p><br></p><p><br></p><p>iPhone 12 được trang bị màn hình Super Retina XDR OLED tràn viền có kích thước 6.1 inch, cho bạn không gian trải nghiệm lớn cũng như những giây phút giải trí hấp dẫn trên một màn ảnh vô cùng chất lượng.</p><p><br></p><p><br></p><p><br></p><p>Máy được chế tác có độ hoàn thiện cực cao với thiết kế nguyên khối, khung nhôm và mặt sau là kính cường lực cao cấp toát lên vẻ ngoài sang chảnh cũng như mang lại độ hiệu quả an toàn cao mỗi khi sử dụng.</p><p><br></p><p><br></p><p><br></p><p>Mặt trước của iPhone 12 được phủ hoàn toàn bởi lớp kính cường lực Ceramic Shield cứng cáp, được đánh giá là có độ bền cao và cứng cáp hơn hầu hết các loại mặt kính có trên&nbsp;<a href="https://www.thegioididong.com/dtdd" rel="noopener noreferrer" target="_blank" style="color:rgb(47, 128, 237)">điện thoại thông minh</a>&nbsp;khác có mặt trên thị trường.</p><p><br></p><p><br></p><p><br></p><p>Xem thêm:&nbsp;<a href="https://www.thegioididong.com/hoi-dap/mat-kinh-ceramic-shield-tren-iphone-12-la-gi-co-xin-so-nhu-1298900" rel="noopener noreferrer" target="_blank" style="color:rgb(47, 128, 237)">Mặt kính Ceramic Shield trên iPhone 12 là gì? Có xịn sò như quảng cáo?</a></p><p>Và để cho thiết bị trở nên hoàn hảo hơn nên không thể thiếu khả năng kháng nước, bụi chuẩn IP68 giúp người dùng yên tâm sử dụng với những buổi đi chơi biển mà không hề lo chiếc máy bị vô nước.</p><p><br></p><p><a href="https://www.thegioididong.com/images/42/213031/iphone-12-2.jpg" rel="noopener noreferrer" target="_blank" style="color:rgb(47, 128, 237)"><img src="https://cdn.tgdd.vn/Products/Images/42/213031/iphone-12-2.jpg"></a></p><p><br></p><h3><strong>Trải nghiệm xuyên suốt, liền mạch cả ngày dài</strong></h3><p>Để bạn có những giây phút trải nghiệm liền mạch, Apple đã trang bị một viên pin có dung lượng 2815 mAh, tích hợp cho khả năng tiết kiệm pin giúp người dùng có thể giải trí đa phương tiện lên đến 17 giờ và nghe nhạc liên tục lên đến 65 giờ.</p><p><br></p><p><a href="https://www.thegioididong.com/images/42/213031/iphone-12-040321-030358.jpg" rel="noopener noreferrer" target="_blank" style="color:rgb(21, 94, 193)"><img src="https://cdn.tgdd.vn/Products/Images/42/213031/iphone-12-040321-030358.jpg"></a></p><p><br></p><p>Và không thể thiếu đó chính là tính năng sạc nhanh, iPhone 12 có khả năng&nbsp;<a href="https://www.thegioididong.com/dtdd-sac-pin-nhanh" rel="noopener noreferrer" target="_blank" style="color:rgb(47, 128, 237)">sạc pin nhanh</a>&nbsp;qua cáp công suất 20 W, chỉ trong vòng 30 phút thì chiếc máy đã có thế sạc được 50% pin. Thêm vào đó là khả năng&nbsp;<a href="https://www.thegioididong.com/dtdd-sac-khong-day" rel="noopener noreferrer" target="_blank" style="color:rgb(47, 128, 237)">sạc không dây</a>&nbsp;MagSafe vô cùng tiện dụng.</p><p>Lưu ý: Củ sạc không kèm theo máy mà phải mua riêng.</p><p><br></p><p><a href="https://www.thegioididong.com/images/42/213031/iphone-12-16.jpg" rel="noopener noreferrer" target="_blank" style="color:rgb(47, 128, 237)"><img src="https://cdn.tgdd.vn/Products/Images/42/213031/iphone-12-16.jpg"></a></p><p><br></p><p>Xem thêm:&nbsp;<a href="https://www.thegioididong.com/hoi-dap/cong-nghe-magsafe-magsafe-2-la-gi-co-tren-thiet-bi-nao-cua-1241888" rel="noopener noreferrer" target="_blank" style="color:rgb(47, 128, 237)">MagSafe trên iPhone 12 là gì? Dùng để làm gì trên các thiết bị Apple?</a></p><p>Sự lột xác đầy mạnh mẽ lần này của Apple không chỉ gây bất ngờ đến người dùng mà còn đánh dấu một kỷ nguyên mới trong nền phát triển smartphone Apple. Và đây cũng được xem là một trong những bộ series iPhone mà Apple đặt nhiều tâm huyết, mục đích và đầy tính năng mạnh mẽ chưa từng thấy.</p>
	`;
	const listPost = [
		{
			img: 'https://lumen.thinkpro.vn//backend/uploads/banner/2021/6/17/Untitled%204.jpg',
			title: 'Rung phím cơ, Quẩy hết cỡ',
		},
		{
			img: 'https://lumen.thinkpro.vn//backend/uploads/banner/2021/6/7/Untitled.jpg',
			title: 'SURFACE KHUYẾN MÃI, NGẬP TRÀN ƯU ĐÃI! ',
		},
		{
			img: 'https://lumen.thinkpro.vn//backend/uploads/banner/2021/5/27/BannerWeb.jpg',
			title: 'ĐẶT TRƯỚC LG, MÊ LY QUÀ KHỦNG!',
		},
		{
			img: 'https://lumen.thinkpro.vn//backend/uploads/banner/2021/6/15/Mua%20m%C3%A1y%20t%C3%ADnh%20h%E1%BB%8Dc%20t%E1%BB%AB%20xa.jpg',
			title: 'Mua điện thoại học từ xa- hiệu quả, lại nhiều quà!',
		},
		{
			img: 'https://lumen.thinkpro.vn//backend/uploads/banner/2021/6/15/Mua%20m%C3%A1y%20t%C3%ADnh%20h%E1%BB%8Dc%20t%E1%BB%AB%20xa.jpg',
			title: 'Nhiều ưu đãi tháng 12',
		},
		{
			img: 'https://lumen.thinkpro.vn//backend/uploads/banner/2021/6/15/Mua%20m%C3%A1y%20t%C3%ADnh%20h%E1%BB%8Dc%20t%E1%BB%AB%20xa.jpg',
			title: 'Ngập tràn niềm vui',
		},
		{
			img: 'https://lumen.thinkpro.vn//backend/uploads/banner/2021/6/15/Mua%20m%C3%A1y%20t%C3%ADnh%20h%E1%BB%8Dc%20t%E1%BB%AB%20xa.jpg',
			title: 'Mua sắm ngay thôi',
		},
	];
	listPost.forEach(async (item, i) => {
		// tên file sẽ bằng tên bài viết đã format + uuid + đuôi file
		const imageName = FormatUrlToEN(item.title) + uuid() + path.extname(item.img);

		var options = {
			url: item.img,
			dest: `${ousideForder}/post/${imageName}`, // c:...public/backend/post/<tên hình ảnh>
		};
		await download
			.image(options)
			.then(({ filename }) => {
				console.log('Saved to', filename); // saved to /path/to/dest/photo.jpg
			})
			.catch(err => {
				console.log('lỗi tải hình ảnh ở bài viết', i);
				console.error(err);
			});
		const Obj = new Post({
			Title: item.title,
			Content: {
				html: contentPost,
			},
			ThumbImage: '/backend/post/' + imageName,
		});
		await Obj.save(function (err) {
			if (err) {
				console.log(err);
				console.log(err.message.split(': ')[2]);
				console.log('bài viết insert được tại ; ', i);
				return;
			}

			return console.log('Đã hoàn tất thêm bài viết :', i);
			// saved!
		});
	});
	console.log('End___________________________________________________________');
})();
