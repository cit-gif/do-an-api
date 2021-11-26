const express = require('express');
const router = express.Router();
const NhomSanPham = require('../../model/NhomSanPham');
router.get('/api/public/home');
module.exports = router;
