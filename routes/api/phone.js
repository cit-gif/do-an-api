const express = require('express');
const router = express.Router();
const NhomSanPham = require('../../model/NhomSanPham');

router.get('/api/sanphamS', async (req, res) => {
	const Nhom_san_pham = await NhomSanPham.find({});
	res.json(Nhom_san_pham);
});

module.exports = router;
