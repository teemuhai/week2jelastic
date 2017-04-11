const express = require('express');
const router = express.Router();

router.use('/user',require('./user'));
router.use('/', require('./user2'));

module.exports = router;

/**
 * Created by Teemu on 11.4.2017.
 */
