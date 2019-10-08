const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authentication.js');

const Profile = require('../../models/Profile.model.js');
const User = require('../../models/User.model.js');

//@route GET /api/profile/me
//@desc Retrieve current user profile
//@access Private
router.get('/me', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id }).populate(
			'user',
			['name', 'profileImg']
		);

		if (!profile) {
			return res.status(400).json({ msg: 'There is no profile for this user' });
		}

		res.json(profile);
	} catch (error) {
		console.error(errror.message);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
