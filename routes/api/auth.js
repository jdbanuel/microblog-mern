const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authentication.js');
const User = require('../../models/User.model.js');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');

//@route  GET api/auth
//@desc   Sign up user
//@access Public
router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		res.json(user);
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ msg: 'Server error' });
	}
});

//@route  POST api/auth
//@desc   Sign up user
//@access Public
router.post(
	'/',
	[
		check('email', 'Please enter a valid email.').isEmail(),
		check('password', 'Password is required.').exists()
	],
	async (req, res) => {
		const errs = validationResult(req);
		if (!errs.isEmpty()) {
			return res.status(400).json({
				errs: errs.array()
			});
		}

		//Destructuring req.body
		const { email, password } = req.body;

		try {
			//Checking to see if user exists
			//If they do, throw and error
			let user = await User.findOne({
				email
			});

			if (!user) {
				return res.status(400).json({
					errors: [
						{
							message: 'Invalid credentials.'
						}
					]
				});
			}

			const isPasswordMatch = await bcrypt.compare(password, user.password);

			if (!isPasswordMatch) {
				return res.status(400).json({
					errors: [
						{
							message: 'Invalid credentials.'
						}
					]
				});
			}

			const payload = {
				user: {
					id: user.id
				}
			};

			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{
					expiresIn: 360000
				},
				(err, token) => {
					if (err) {
						throw err;
					}
					res.json({
						token
					});
				}
			);
		} catch (error) {
			console.error(error.message);
			res.status(500).send('Server Error');
		}
	}
);

module.exports = router;
