const express = require('express');
const router = express.Router();
const User = require('../../models/User.model.js');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const { check, validationResult } = require('express-validator');

router.post(
	'/',
	[
		check('name', 'Name is required.')
			.not()
			.isEmpty(),
		check('email', 'Please enter a valid email.').isEmail(),
		check('username', 'Username is required.')
			.not()
			.isEmpty(),
		check(
			'password',
			'Please enter a password with 6 or more characters.'
		).isLength({
			min: 6
		})
	],
	async (req, res) => {
		const errs = validationResult(req);
		if (!errs.isEmpty()) {
			return res.status(400).json({
				errs: errs.array()
			});
		}

		//Destructuring req.body
		const { name, email, username, password } = req.body;

		try {
			//Checking to see if user exists
			//If they do, throw and error
			let user = await User.findOne({
				email
			});

			let usernameExists = await User.findOne({
				username
			});

			if (user || usernameExists) {
				return res.status(400).json({
					errors: [
						{
							message: 'User already exists'
						}
					]
				});
			}

			//Grabbing gravatar if it exists.
			const profileImg = gravatar.url(email, {
				s: '200',
				r: 'pg',
				d: 'mm'
			});

			user = new User({
				name,
				email,
				password,
				username,
				profileImg
			});

			const salt = await bcrypt.genSalt(10);

			user.password = await bcrypt.hash(password, salt);

			await user.save();

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
