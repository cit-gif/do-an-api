//io\
const { instrument } = require('@socket.io/admin-ui');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const getMessage = async _id => {
	const data = {
		check: true,
		data: [],
	};

	try {
		const message = await User.aggregate([
			{
				$match: {
					_id: ObjectId(_id),
				},
			},
			{ $unwind: '$Message' },
			{
				$lookup: {
					from: 'admins',
					localField: 'Message.Id_User',
					foreignField: '_id',
					as: 'admins',
				},
			},
			{
				$sort: { 'Message.Time': 1 },
			},
			// {
			// 	$limit:15
			// },
			{
				$project: {
					_id: 1,
					From_Id_User: '$Message.Id_User',
					Name: {
						$cond: {
							if: {
								$eq: ['$Message.Role', 'admin'],
							},
							then: {
								$first: '$admins.DisplayName',
							},
							else: '$Name',
						}, //if(check == admin thì ...)
					},
					Avatar: {
						$cond: {
							if: {
								$eq: ['$Message.Role', 'admin'],
							},
							then: { $first: '$admins.Avatar' },
							else: '$Avatar',
						},
					},
					MessengerContent: '$Message.MessengerContent',
					Role: '$Message.Role',
					Time: '$Message.Time',
				},
			},
		]);
		data.data = message;
	} catch (error) {
		data.check = false;
	}
	return data;
};
const getSlideBarMessage = async () => {
	const data = {
		check: true,
		data: [],
	};

	try {
		const message = await User.aggregate([
			{
				$lookup: {
					from: 'admins',
					localField: 'Message.Id_User',
					foreignField: '_id',
					as: 'admins',
				},
			},
			{
				$sort: { TimeMessageUpdate: -1 },
			},
			// {
			// 	$limit:15
			// },

			{
				$project: {
					_id: 1,
					Name: 1,
					Message: {
						$last: '$Message',
					},
					Avatar: 1,
					LastTimeActive: 1,
					// From_Id_User: "Message.Id_User",
					// Name: {
					// 	$cond: { if: { $eq: ["$Message.Role", "admin"] }, then: { $first: "$admins.DisplayName" }, else: "$Name" }, //if(check == admin thì ...)
					// },
					// Avatar: {
					// 	$cond: { if: { $eq: ["$Message.Role", "admin"] }, then: { $first: "$admins.Avatar" }, else: "$Avatar" },
					// },
					// MessengerContent: { $last: "$Message" },
					// Role: "$Message.Role",
					// Time: "$Message.Time",
				},
			},
		]);
		data.data = message;
	} catch (error) {
		data.check = false;
	}
	return data;
};
const deleteMessageOneUser = async userId => {
	const data = { data: {}, check: true };
	try {
		data.data = await User.findByIdAndUpdate(
			userId,
			{ $set: { Message: [] } },
			{ safe: true, upsert: true, new: true }
		).select({
			_id: 1,
			Name: 1,
		});
	} catch (error) {
		data.check = false;
	}

	return data;
};
global.arraySocketIdOfAdmin = [];

module.exports.createSocket = function (server) {
	const io = new Server(server, {
		path: '/socket.io',
		cors: {
			origin: process.env.CORS_ORIGIN.split(' ').concat('https://admin.socket.io'),
			credentials: true,
		},
	});
	global.io = io;

	// socket.rooms là phòng mà chính user đó đã tham gia
	//path and namespace
	//https://stackoverflow.com/questions/29511404/connect-to-socket-io-server-with-specific-path-and-namespace/31658307
	io.of('/chat') //namespace chat
		.use((socket, next) => {
			const authorization = socket.handshake.auth.accessToken;

			if (!authorization || authorization == '') {
				return next(new Error('Access token is required'));
			}
			const accessToken = authorization && authorization.split(' ')[1];
			const payload = jwt.decode(accessToken);
			if (payload.Role === 'user') {
				return jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_USER, (err, decode) => {
					if (err) return next(new Error('user invalid accessToken'));
					socket.payload = payload;
					next();
				});
			}
			if (payload.Role === 'admin') {
				return jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_ADMIN, (err, decode) => {
					if (err) return next(new Error('admin  invalid accessToken'));
					socket.payload = payload;
					next();
				});
			}
			return next(new Error('no user token'));
		})
		.on('connection', socket => {
			if (socket.payload.Role === 'admin') {
				arraySocketIdOfAdmin.push(socket.id);

				const rooms = [...io.of('/chat').adapter.rooms.keys()];
				rooms.forEach(room => {
					socket.join(room);
				});
				io.of('/chat').to(socket.id).emit('getUserOnlineWhenAdminConect');
			}
			// join room by _id user
			if (socket.payload.Role === 'user') {
				socket.join(socket.payload._id);
				// gửi tới admin 1 thông điệp user on line
				if (arraySocketIdOfAdmin.length > 0) {
					arraySocketIdOfAdmin.forEach(socketIdAdmin => {
						io.of('/chat')
							.to(socketIdAdmin)
							.emit('oneUserOnline', socket.payload._id, socket.payload);
					});
				}
				// io.of("/chat")
				// 	.to(socket.id)
				// 	.emit("usersOnline", Array.from([...io.of("/chat").adapter.rooms.keys()]));
			}
			socket.to(socket.payload._id).emit('userconnected', socket.payload._id);

			socket.on('getSileBarMessage', async () => {
				if (socket.payload.Role === 'admin') {
					const data = await getSlideBarMessage();
					io.of('/chat').to(socket.id).emit('sileBarMessage', data.data);
				}
			});
			socket.on('adminJoinRoomWhenNewUserConnected', room => {
				if (socket.payload.Role === 'admin') {
					socket.join(room);
				}
			});
			socket.on('getUsersOnline', () => {
				if (socket.payload.Role === 'admin') {
					// const rooms = [...io.of("/chat").adapter.rooms.keys()];

					io.of('/chat')
						.to(socket.id)
						.emit('usersOnline', Array.from([...io.of('/chat').adapter.rooms.keys()]));
				}
			});
			socket.on('getMessage', async _id => {
				/**
				 * ở đây đang bị lỗi khi điện thoại chọn tin nhắn để
				 * hiển thị thì bên mấy tính cũng bị theo
				 * nếu 'socket.emit' không đc thì sửa lại ban là 'io.of('/chat').to(socket.id)'
				 */
				if (socket.payload.Role === 'admin') {
					const message = await getMessage(_id);
					return socket.emit('getMessageUser', message.data);
				}
				if (socket.payload.Role === 'user') {
					const message = await getMessage(socket.payload._id);
					return socket.emit('getMessageUser', message.data);

					// return io.of('/chat').to(socket.id).emit('getMessageUser', message.data);
				}
			});
			socket.on('deleteMessage', async userId => {
				if (socket.payload.Role === 'admin') {
					const data = await deleteMessageOneUser(userId);
					socket.to(userId).emit('deleteAllMessage');
					return io.of('/chat').to(socket.id).emit('deleteMessageResult', data.data);
				}
			});
			socket.on('sendMessage', async data => {
				try {
					const { MessengerContent, Avatar = '' } = data;
					let room = '';
					// vì trong accesstoken chưa cập Avatar của user
					if (socket.payload.Role === 'admin') {
						room = data.To;
					}
					if (socket.payload.Role === 'user') {
						room = socket.payload._id;
					}
					const newMessage = {
						Id_User: socket.payload._id,

						MessengerContent: MessengerContent,
						Role: socket.payload.Role,
						_id: new ObjectId(),
						Time: Date.now(),
					};
					await User.findByIdAndUpdate(room, {
						$push: { Message: newMessage },
						TimeMessageUpdate: Date.now(),
					});
					//nếu phòng tồn tại thì emit cho phòng
					// vì khi user thoát thì phòng cũng thoát
					if (socket.rooms.has(room)) {
						// enmit envent cho cả người gửi
						io.of('/chat')
							.to(room)
							.emit(
								'message',
								{
									...newMessage,
									Name: socket.payload.Name
										? socket.payload.Name
										: socket.payload.DisplayName,
									Avatar: Avatar,
								},
								room
							);
					} else {
						//emit cho user thôi
						io.of('/chat')
							.to(socket.id)
							.emit(
								'message',
								{
									...newMessage,
									Name: socket.payload.Name
										? socket.payload.Name
										: socket.payload.DisplayName,
									Avatar: Avatar,
								},
								room
							);
					}
					// socket.in(room).emit("message", newMessage); emit cho rooms ko bao gồm người gửi
				} catch (error) {
					// throw error;
					console.log(error);
				}
			});
			socket.on('OnFocus', userId => {
				if (socket.payload.Role === 'user') {
					arraySocketIdOfAdmin.forEach(x => {
						io.of('/chat').to(x).emit('inputOnFocus', socket.payload._id);
					});
					return;
				}
				if (socket.payload.Role === 'admin') {
					socket.to(userId).emit('inputOnFocus', socket.payload._id);
				}
			});
			socket.on('OnBlur', userId => {
				if (socket.payload.Role === 'user') {
					arraySocketIdOfAdmin.forEach(x => {
						io.of('/chat').to(x).emit('inputOnBlur', socket.payload._id);
					});
					return;
				}
				if (socket.payload.Role === 'admin') {
					socket.to(userId).emit('inputOnBlur', socket.payload._id);
				}
			});
			// offline user
			socket.on('disconnect', e => {
				if (socket.payload.Role === 'user') {
					arraySocketIdOfAdmin.forEach(socketIdAdmin => {
						io.of('/chat')
							.to(socketIdAdmin)
							.emit('usersOffline', socket.payload._id, Date.now());
					});
				}
				if (socket.payload.Role === 'admin') {
					arraySocketIdOfAdmin = arraySocketIdOfAdmin.filter(id => id !== socket.id);
				}
			});

			// khi user offiline. server emit user onfiline cho admin
			// admin nhận đucợ và emit leave room cho server
			// server leave room mà admin đã gửi lên
			socket.on('adminLeaveRoomWhenNewUserDisconnect', userId => {
				if (socket.payload.Role === 'admin') {
					socket.leave(userId);
				}
			});
		});

	instrument(io, {
		auth: false,
	});
};
module.exports.arraySocketIdOfAdmin = arraySocketIdOfAdmin;
