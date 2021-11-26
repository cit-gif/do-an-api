/**
 * author Sơn Bá
 * @param {Date} DateTime
 * @returns {string} dd/mm/yyy hh:mm
 */
module.exports = function (DateTime) {
	const date = new Date(DateTime);
	return date
		.toLocaleString('vi', {
			// weekday: 'long', // long, short, narrow
			day: 'numeric', // numeric, 2-digit
			year: 'numeric', // numeric, 2-digit
			month: '2-digit', // numeric, 2-digit, long, short, narrow
			hour: 'numeric', // numeric, 2-digit
			minute: 'numeric', // numeric, 2-digit
			//second: 'numeric', // numeric, 2-digit
		})
		.split(', ')
		.reverse()
		.join(' ');
};
