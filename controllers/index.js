const express = require('express');
const router = express.Router();
const userRoute = require('./users');
const verifyToken = require('../middleware/verifyToken');

router.use('/users', userRoute);

module.exports = router;
