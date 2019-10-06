const mongoose = require('mongoose');

//Profile Schema

const ProfileSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	website: {
		type: String
	},
	bio: {
		type: String
	},
	social: {
		twitter: {
			type: String
		},
		instagram: {
			type: String
		},
		facebook: {
			type: String
		},
		linkedIn: {
			type: String
		}
	},
	selfPosts: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'Blogpost'
	}
});

module.exports = mongoose.model('Profile', ProfileSchema);
