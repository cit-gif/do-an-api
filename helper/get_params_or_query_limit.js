module.exports = params => {
	try {
		if (params && parseInt(params) > 0) {
			return parseInt(params);
		} else {
			return 1;
		}
	} catch (error) {
		return 1;
	}
};
