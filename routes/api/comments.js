const express = require('express');
const router = express.Router();

//@route  GET api/users/comments
//@desc   Test route
//@access Private
router.get('/', (req, res) => res.send('Comment Route'));

module.exports = router;