const { sign } = require('jsonwebtoken');

// Create tokens for user
// ----------------------------------
const createAccessTokenUser = payload => {
	return sign(payload, process.env.ACCESS_TOKEN_SECRET_USER, {
		expiresIn: process.env.ACCESS_TOKEN_LIFE,
		algorithm: process.env.ALGORITHM,
	});
};
const createAccessTokenAdmin = payload => {
	return sign(payload, process.env.ACCESS_TOKEN_SECRET_ADMIN, {
		expiresIn: process.env.ACCESS_TOKEN_LIFE,
		algorithm: process.env.ALGORITHM,
	});
};

const createRefreshToken = ({ _id, Ten, role }) => {
	return sign({ _id, Ten, role }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: process.env.REFRESH_TOKEN_LIFE,
		algorithm: process.env.ALGORITHM,
	});
};
module.exports = {
	createAccessTokenUser,
	createAccessTokenAdmin,
	createRefreshToken,
};
