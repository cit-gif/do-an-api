// module.exports = function FormatUrlToEN(string = '') {
// 	if (typeof string !== 'string') return '';

// 	string = string
// 		.split(' ')
// 		.filter(str => str !== '')
// 		.join(' ')
// 		.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a')
// 		.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e')
// 		.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i')
// 		.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o')
// 		.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u')
// 		.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y')
// 		.replace(/(đ)/g, 'd')
// 		.replace(/(À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ)/g, 'A')
// 		.replace(/(È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ)/g, 'E')
// 		.replace(/(Ì|Í|Ị|Ỉ|Ĩ)/g, 'I')
// 		.replace(/(Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ)/g, 'O')
// 		.replace(/(Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ)/g, 'U')
// 		.replace(/(Ỳ|Ý|Ỵ|Ỷ|Ỹ)/g, 'Y')
// 		.replace(/(Đ)/g, 'D')
// 		.replaceAll('/', '-')
// 		.replace(/ /g, '-')
// 		.trim()
// 		.toLowerCase();
// 	return string;
// };

const slugify = require('slugify');

module.exports = function FormatUrlToEN(string = '') {
	if (typeof string !== 'string') return '';
	return slugify(string, {
		remove: undefined, // remove characters that match regex, defaults to `undefined`
		lower: true, // convert to lower case, defaults to `false`
		strict: true, // strip special characters except replacement, defaults to `false`
		locale: 'vi', // language code of the locale to use
		trim: true,
	});
};
