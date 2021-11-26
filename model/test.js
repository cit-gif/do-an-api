const { Schema, model } = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Document = new Schema(
	{
		_id: String,
		data: {
			type: Object,
			default: {},
		},
		email: {
			type: String,
			maxlength: [100, 'email tối da 10'],
			require: [true, 'email là bắt bụt'],
			// index: true,
			unique: true,
			dropDups: true,
			validate: {
				validator: async value => {
					console.log('email ', value);
					return true;
				},
				message: prop => {
					return `${prop.path} sai dinh dang`;
				},
			},
		},
	},
	{
		timestamps: true,
		get: v => v.toDateString(),
	},
);
Document.plugin(uniqueValidator);
module.exports = model('Document', Document);
