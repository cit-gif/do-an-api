const auth = require('./auth');
// import phone from "./phone";
const admin = require('./admin');
const products = require('./products');
const user = require('./user');

module.exports = function ApiRouter(app) {
	app.use(auth);
	// app.use(phone);
	app.use(admin);
	app.use(user);
	app.use(products);
};
