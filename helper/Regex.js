const checkBrandName = (string = '') => {
	return /^[a-zA-Z0-9]+$/.test(string);
};
const filenameRegex = (str = '') => {
	return str.match(/([^\\\/]+)$/)[0];
};
module.exports = {
	checkBrandName,
	filenameRegex,
};
