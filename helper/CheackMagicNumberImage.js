const MAGIC_NUMBERS = {
	jpg: 'ffd8ffe0',
	jpg1: 'ffd8ffe1',
	png: '89504e47',
	gif: '47494638',
};
const checkMagicNumbersAvatar = magic => {
	if (
		magic == MAGIC_NUMBERS.jpg ||
		magic == MAGIC_NUMBERS.jpg1 ||
		magic == MAGIC_NUMBERS.png ||
		magic == MAGIC_NUMBERS.gif
	)
		return true;
	return false;
};
module.exports = checkMagicNumbersAvatar;
