const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const ApiRouter = require('./routes/api');
const app = express();
//database
mongoose.Promise = global.Promise;
// Connect MongoDB at default port 27017.
mongoose.connect(
	process.env.URL_DB,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	},
	err => {
		if (!err) {
			console.log('MongoDB Connection Succeeded.');
		} else {
			console.log('Error in DB connection: ' + err);
		}
	}
);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.disable('x-powered-by');
//#region Thử làm req.body get json
// app.use((req, res, next) => {
// 	if (req.header("content-type") == "application/json" || req.header("content-type") == "application/json; charset=utf-8") {
// 		let body = "";
// 		req.on("data", function (data) {
// 			body += data;
// 			// Too much POST data, kill the connection!
// 			// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
// 			// if (body.length > 1e6) req.connection.destroy();
// 		});
// 		req.on("end", function () {
// 			try {
// 				body = JSON.parse(body);
// 				req.emit("done", true);
// 			} catch (error) {
// 				req.emit("err", error);
// 			}
// 		});
// 		req.on("done", (done) => {
// 			req.body = body;
// 			next();
// 		});
// 		req.on("err", (error) => {
// 			console.log("errr");
// 			res.json(error?.message);
// 		});
// 	}
// 	req.emit("d", "d");
// 	req.on("d", (d) => {
// 		console.log("d");
// 		next();
// 	});
// });
// app.use((req, res, next) => {
// 	res.json(req.body);
// 	next();
// });
//#endregion
const origin = (process.env.CORS_ORIGIN || '').split(' ');
app.use(
	cors({
		origin: [`${process.env.HOST}${process.env.PORT}`, ...origin],
		credentials: true,
	})
);

// app.set('etag', false);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // default false

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
	res.send('Hello !!');
});
app.post('/', (req, res) => {
	res.json({ message: 'Hello' });
});
//router
ApiRouter(app);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
