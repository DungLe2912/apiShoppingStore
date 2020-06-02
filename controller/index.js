const express = require('express');
const router = express.Router();
router.use('/',require('./user/index'))

module.exports = router;