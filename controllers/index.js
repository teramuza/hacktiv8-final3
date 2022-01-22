const express = require('express');
const router = express.Router();
const userRoute = require('./users');
const categoryRoute = require('./categories');
const productRoute = require('./products');
const transactionRoute = require('./transactionhistories');
const verifyToken = require('../middleware/verifyToken');
const verifyUser = require('../middleware/verifyUser');
const verifyAdmin = require("../middleware/verifyAdmin");

router.use('/users', userRoute);
router.use('/categories', verifyToken, verifyUser, verifyAdmin, categoryRoute);
router.use('/products', verifyToken, verifyUser, productRoute);
router.use('/transactions', verifyToken, verifyUser, transactionRoute);

module.exports = router;
