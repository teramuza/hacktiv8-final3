const express = require('express');
const router = express.Router();
const userRoute = require('./users');
const productRoute = require('./products');
const transactionRoute = require('./transactionhistories');
const verifyToken = require('../middleware/verifyToken');

router.use('/users', userRoute);
router.use('/products', productRoute);
router.use('/transactions', transactionRoute);

module.exports = router;
