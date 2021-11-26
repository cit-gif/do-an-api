//io\
const { instrument } = require('@socket.io/admin-ui');
const { Server } = require('socket.io');
const User = require('../model/User');
const jwt = require('jsonwebtoken');

module.exports = function (server) {
	const io = new Server(server, {
		path: '/socket.io',
		cors: {
			origin: process.env.CORS_ORIGIN.split(' ').concat(
				'https://admin.socket.io',
			),
			credentials: true,
		},
	});
	//path and namespace
	//https://stackoverflow.com/questions/29511404/connect-to-socket-io-server-with-specific-path-and-namespace/31658307
	io.of('/chat') //namespace chat
		.use((socket, next) => {
			const accessToken = socket.handshake.auth.accessToken;
			if (!accessToken) {
				return next(new Error('Access token is required'));
			}
			const payload = jwt.decode(accessToken);
			if (payload.Role === 'user') {
				jwt.verify(
					accessToken,
					process.env.ACCESS_TOKEN_SECRET_USER,
					(err, decode) => {
						if (err)
							return next(
								new Error(
									'invalid accessToken',
								),
							);
						socket.payload = payload;
						next();
					},
				);
			}
			if (payload.Role === 'admin') {
				jwt.verify(
					accessToken,
					process.env.ACCESS_TOKEN_SECRET_ADMIN,
					(err, decode) => {
						if (err)
							return next(
								new Error(
									'invalid accessToken',
								),
							);
						socket.payload = payload;
						next();
					},
				);
			}
			return next(new Error('invalid accessToken'));
		})
		.on('connection', socket => {
			socket.on('getmessage', () => {});
			socket.on('join-room', room => {
				socket.join(room);
				socket.emit('user-join-room', room);
			});

			socket.on('send-message', async data => {
				console.log(data);
				const { Id_User, MessengerContent, to } = data;
				// await User.findByIdAndUpdate(_id, {
				// 	$push: {
				// 		Message: {
				// 			Id_User: _id,
				// 			MessengerContent: message,

				// 		},
				// 	},
				// });
				socket.to(to).emit('message', data);
			});
		});

	instrument(io, {
		auth: false,
	});
};
// module.exports = function (server) {
// 	const io = require("socket.io")(server, {
// 		path: "/chat",
// 		// serveClient: false,
// 		// // below are engine.IO options
// 		// pingInterval: 10000,
// 		// pingTimeout: 5000,
// 		// cookie: false,
// 		cors: {
// 			origin: process.env.CORS_ORIGIN.split(" "),
// 			method: ["GET", "POST"],
// 		},
// 	});

// 	io.on("connection", socket => {
// 		socket.auth = false;
// 		socket.on("authenticate", data=> {
// 			// check data được send tới client

// 			checkAuthToken(data.token, function (err, success) {
// 				if (!err && success) {
// 					console.log("Authenticated socket ", socket.id);
// 					socket.auth = true;
// 				}
// 			});
// 		});

// 		setTimeout(function () {
// 			//sau 1s mà client vẫn chưa dc auth, lúc đấy chúng ta mới disconnect.
// 			if (!socket.auth) {
// 				console.log("Disconnecting socket ", socket.id);
// 				socket.disconnect("unauthorized");
// 			}
// 		}, 1000);
// 	});
// };
