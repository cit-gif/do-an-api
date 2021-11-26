const puppeteer = require('puppeteer');
const image_download = require('image-downloader');
const fs = require('fs');
const delay = require('delay');
const path = require('path');
const puclicPath = 'public';
const backendPath = 'backend';
const ousideForder = `${path
	.join(__dirname)
	.slice(0, -3)}/${puclicPath}/${backendPath}`;
//C:\gameLOL\WEB_BACK_END_NODE_JS\web_ban_hang\server\public/backend
const brandFoder = 'Brands';
const phoneFolder = 'phone';
const BrandsUrl = 'https://www.thegioididong.com/dtdd';
const resultFolder = {
	brandPath: `${ousideForder}/${brandFoder}/`,
	//C:\gameLOL\WEB_BACK_END_NODE_JS\web_ban_hang\server\public/backend/Brands
	phonePath: `${ousideForder}/${phoneFolder}/`,
};
const brandsArr = [
	'Apple',
	'Samsung',
	'OPPO',
	'Vivo',
	'xiaomi',
	'Realme',
	'Vsmart',
	'OnePlus',
];
const SanPhamS = [
	{
		brand: 'Samsung',
		phone: [
			{
				Nhom: 'Điện thoại Samsung Galaxy S21 5G',
				dienThoai: [
					{
						ten: 'Điện thoại Samsung Galaxy S21 5G 128GB',
						link: 'https://www.thegioididong.com/dtdd/samsung-galaxy-s21-plus',
					},
				],
			},
		],
	},
];
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
}

async function ThuongHieu() {
	const browser = await puppeteer.launch({
		headless: false,
		userDataDir: './user_data',
	});
	const page = await browser.newPage();
	await page.goto(BrandsUrl);

	const LinkObj = await page.evaluate(() => {
		const imgs = Array.from(
			document.querySelectorAll(
				'a.box-quicklink__item > img.no-text',
			),
		);
		const arrSrc = imgs.map(img => 'https:' + img.getAttribute('src'));
		return arrSrc;
	});
	await browser.close();
	let Arrbrands = [];
	LinkObj.forEach(image => {
		brandsArr.forEach(async brand => {
			if (image.includes(brand)) {
				const imgSrc = `${
					resultFolder.brandPath
				}/${brand}.${image.split('.').pop()}`;
				const imgSaveSrc = `/${backendPath}/${brandFoder}/${brand}.${image
					.split('.')
					.pop()}`;
				Arrbrands.push({
					ThuongHieu: brand,
					DuongDan: imgSaveSrc,
				});
				await image_download.image({
					url: image,
					dest: imgSrc,
				});
			}
		});
	});
	return Arrbrands;
}
async function GetLinkPhone() {
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();
	await page.goto(BrandsUrl);

	const LinkObjs = await page.evaluate(() => {
		const phoneLinks = Array.from(
			document.querySelectorAll('a.box-quicklink__item'),
		);
		const arrSrc = phoneLinks.map(
			phoneLink =>
				'https://www.thegioididong.com/' +
				phoneLink.getAttribute('href'),
		);
		return arrSrc;
	});
	await browser.close();
	let ArrLinks = [];
	LinkObjs.forEach(linkOBJ => {
		brandsArr.forEach(brand => {
			if (linkOBJ.includes(brand.toLowerCase())) {
				ArrLinks.push(linkOBJ);
			}
		});
	});
	return ArrLinks;
}
async function getPhone(arrLinkPhone = []) {
	arrLinkPhone.forEach(async linkPhone => {
		const browser = await puppeteer.launch({ headless: false });
		const page = await browser.newPage();
		await page.goto(linkPhone);
	});
}
async function main() {
	createFolder();
	const thuongHieu = await ThuongHieu();
}
main();
