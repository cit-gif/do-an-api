module.exports.isObject = function (obj) {
	const data = {
		check: true,
		data: null,
	};
	try {
		data.data = JSON.parse(obj);
	} catch (error) {
		data.check = false;
	}
	return data;
};
