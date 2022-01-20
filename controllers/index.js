const express = require('express');
const router = express.Router();
const userRoute = require('./users');
const categoryRoute = require('./categories');
const productRoute = require('./products');
const transactionRoute = require('./transactionhistories');
const verifyToken = require('../middleware/verifyToken');
const verifyUser = require('../middleware/verifyUser');

router.use('/users', userRoute);
router.use('/categories', verifyToken, verifyUser, categoryRoute);
router.use('/products', productRoute);
router.use('/transactions', transactionRoute);

module.exports = router;
