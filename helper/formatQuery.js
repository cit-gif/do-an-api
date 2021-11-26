/**
 * author Sơn Bá
 * @param {string} Str
 * @returns {String} StringRegex
 */
module.exports = function (str = '') {
	return str
		.replace('(', /[" "]/g, '\\(')
		.replace(')', /[" "]/g, '\\)')
		.replace('*', /[" "]/g, '\\*')
		.replace('+', /[" "]/g, '[+]');
};
