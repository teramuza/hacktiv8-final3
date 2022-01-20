const express = require('express');
const router = express.Router();
const userRoute = require('./users');
const categoryRoute = require('./categories');
const verifyToken = require('../middleware/verifyToken');
const verifyUser = require('../middleware/verifyUser');

router.use('/users', userRoute);
router.use('/categories', verifyToken, verifyUser, categoryRoute);

module.exports = router;
