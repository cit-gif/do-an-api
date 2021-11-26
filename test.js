const fs = require('fs');
const path = require('path');
fs.unlink(path.join('./test/tex.js'), err => {
	if (err) {
		return console.log(err.message);
	}
	console.log('oke');
});
