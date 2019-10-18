const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authentication.js');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile.model.js');
const User = require('../../models/User.model.js');

//@route GET /api/profile/me
//@desc Retrieve current user profile
//@access Private
router.get('/me', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.body.id }).populate(
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

//@route POST /api/profile/
//@desc Create or update a users profile
//@access Private
router.post('/', auth, async (req, res) => {
	const { website, bio, social } = req.body;

	try {
		console.log(req.user.id);

		const profile = new Profile({
			user: req.user.id,
			website,
			bio,
			social
		});

		await profile.save();
		res.status(200).json(profile);
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server Error');
	}
});

//@route put /api/profile/:id
//@desc  Update a users profile
//@access Private
router.post('/:id', auth, async (req, res) => {
	const { website, bio, social } = req.body;

	try {
		const profile = new Profile({
			user: req.body.id,
			website,
			bio,
			social
		});

		await profile.save();
		res.status(200).json(profile);
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server Error');
	}
});

//@route get /api/profile/search/:username
//@desc  Returns a users profile if it exists
//@access Public
router.get('/search/:username', async (req, res) => {
	try {
		//Checks if user exists in collection by matching username
		const user = await User.findOne({ username: req.params.username });

		if (!user) {
			return res.status(400).json({
				errors: [
					{
						message: 'User does not exist.'
					}
				]
			});
		}

		//Checks if profile is created for user
		const profile = await Profile.findOne({ user: user.id }).populate('user', [
			'name',
			'username'
		]);

		if (!profile) {
			return res.status(400).json({
				errors: [
					{
						message: 'Profile does not exist.'
					}
				]
			});
		}

		return res.json(profile);
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
