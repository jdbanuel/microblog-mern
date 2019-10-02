const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator/check')

//@route  Post api/users
//@desc   Register a user
//@access Public
router.post('/',
    [
        check('name', 'Name is required.').not().isEmpty(),
        check('email', 'Please enter a valid email.').isEmail(),
        check('password', 'Please enter a password with 6 or more characters.').isLength({
            min: 6
        })
    ],
    (req, res) => {
        const errs = validationResult(req);
        if (!errs.isEmpty()) {
            return res.status(400).json({
                errs: errs.array()
            });
        }
        res.send('User Route')
    });

module.exports = router;