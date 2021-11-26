const { Schema, model } = require('mongoose');
const Post = new Schema(
	{
		Title: {
			type: String,
			maxlength: [200, 'Không vượt quá 200 kí tự'],
			required: true,
			dropDups: true,
		},
		Content: {
			deltaOps: {
				type: Schema.Types.Mixed,
				default: {},
			},
			html: {
				type: String,
				default: '',
			},
		},

		ThumbImage: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);
module.exports = model('Post', Post);
