const mongoose = require('mongoose');

const BlogpostSchema = new mongoose.Schema({
	title: String,
	description: String,
	text: String,
	createdAt: {
		type: Date,
		default: Date.now
	},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		userName: String
	},
	comments: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'Comment'
	}
});

module.exports = mongoose.model('Blogpost', BlogpostSchema);
