const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/auth');
const User = require('../../model/User');
const Admin = require('../../model/Admin');

//user auth
router.post('/api/user/register', authMiddleware.registerUser);
router.post('/api/user/login', authMiddleware.loginUser);

//admin auth
router.post('/api/admin/login', authMiddleware.loginAdmin);
router.post('/api/admin', authMiddleware.verifyTokenAdmin, async (req, res) => {
	const getAdmin = async _id => {
		try {
			const admin = await Admin.findById(_id).select({
				_id: 1,
				DisplayName: 1,
				Avatar: 1,
			});
			if (admin) {
				res.json(admin);
			} else {
				res.status(400).json({
					error: 'not found user',
				});
			}
		} catch (error) {
			res.status(500).json({
				error: 'server error',
			});
		}
	};
	getAdmin(res.locals.payload._id);
});
// router.post("/api/admin", authMiddleware.verifyToken, authMiddleware.isRole.isAdmin, (req, res) => {
// 	res.json(req.user);
// });

router.post('/api/user', authMiddleware.verifyTokenUser, async (req, res) => {
	const getUser = async _id => {
		try {
			const user = await User.findById(_id).select({
				_id: 1,
				Avatar: 1,
				Name: 1,
			});
			if (user) {
				return res.json(user);
			} else {
				res.status(400).json({
					error: 'not found user',
				});
			}
		} catch (error) {
			res.status(500).json({
				error: 'server error',
			});
		}
	};
	getUser(res.locals.payload._id);
});

module.exports = router;
