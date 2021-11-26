const bcrypt = require('bcryptjs');

module.exports.hash = async function (Password) {
	// const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(Password, 10);
};
module.exports.check = async function (Password, PasswordHash) {
	return await bcrypt.compare(Password, PasswordHash);
};
