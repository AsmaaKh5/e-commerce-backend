const express = require('express');
const router = express.Router();

router.use('/auth', require('../modules/auth/auth.routes'));
router.use('/users', require('../modules/user/user.routes'));

module.exports = router;