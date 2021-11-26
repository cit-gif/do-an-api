module.exports = {
	env: {
		amd: true,
		browser: true,
		es2021: true,
		commonjs: true,
		es6: true,
		node: true,
	},
	extends: ["google", "prettier", "eslint:recommended"],
	plugins: ["prettier"],
	parserOptions: {
		ecmaVersion: 2021,
		sourceType: "module",
	},
	globals: {
		Atomics: "readonly",
		SharedArrayBuffer: "readonly",
	},
	rules: {
		indent: ["error", "tab"],
		"linebreak-style": ["error", "windows"],
		quotes: ["error", "single"],
		semi: ["error", "always"],
	},
	"prettier/prettier": [
		"error",
		{
			endOfLine: "auto",
		},
	],
};
