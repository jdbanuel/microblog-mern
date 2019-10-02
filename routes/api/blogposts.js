const express = require('express');
const router = express.Router();

//@route  GET api/users/blogpost
//@desc   Test route
//@access Public
router.get('/', (req, res) => res.send('Blogpost Route'));

module.exports = router;