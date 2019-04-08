var express = require('express');
var router = express.Router();

router.use('/',require('./home'));
// router.use('/users/profile', require('./profile'));
router.use('/users', require('./authenticate'));
// router.use('/contents', require('./contents'));
// router.use('/payu', require('./payumoney'));
// router.use('/project', require('./projects'));

module.exports = router;