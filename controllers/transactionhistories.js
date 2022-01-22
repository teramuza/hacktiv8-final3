const express = require('express');
const {ValidationError} = require('sequelize');

const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const responseUtil = require('../helpers/response');
const { toRupiah } = require('../helpers/currency');
const { TransactionHistory, Product, User } = require('../models');

const createTransaction = (req, res) => {
    try {
        let {
            productId,
            quantity
        } = req.body;
        if(!quantity) quantity = 0;
        Product.findOne({where: {id: productId}})
        .then((product) => {
            if(product) {
                if(quantity <= product.stock) {
                    const {id} = req.user;
                    let total_price = product.price * quantity;
                    User.findOne({where: {id:id}})
                    .then((user) => {
                        if (user.balance >= total_price) {
                            const bodyData = {
                                productId,
                                userId: id,
                                quantity,
                                total_price
                            };
                            TransactionHistory.create(bodyData)
                            .then((data) => {
                                const msg = 'You have successfully purchase the product';
                                responseUtil.successResponse(
                                    res,
                                    {msg},
                                    {transactionBill: {total_price: toRupiah(total_price), quantity, product_name: product.title }},
                                    201
                            )})
                            .catch ((e) => {
                                if (e instanceof ValidationError) {
                                    return responseUtil.validationErrorResponse(res, e.errors[0]);
                                } else {
                                    return responseUtil.badRequestResponse(res, e);
                                }
                            })
                        } else {
                            return responseUtil.badRequestResponse(res, {message: 'Your balance is not enough'});
                        }
                    })
                    .catch()
                } else {
                    return responseUtil.badRequestResponse(res, {message: 'Quantity must not exceed stock'});
                }
            } else {
                return responseUtil.badRequestResponse(res, {message: 'Product not found'});
            }
        })
        .catch()
    } catch (error) {

    }
}

const getTransactionUser = (req, res) => {
    try {
        const {id} = req.user;
        TransactionHistory.findAll({
            where: {userId: id},
            include: [
                {
                    model: Product,
                    attributes: ['id', 'title', 'price', 'stock', 'CategoryId']
                }
            ]
        })
        .then((data) => {
            if (data === 0) {
                return responseUtil.badRequestResponse(res, {message: 'data not found'});
            }
            return responseUtil.successResponse(res, null, {transactionHistories: data});
        })
        .catch((e) => {
            if (e instanceof ValidationError) {
                return responseUtil.validationErrorResponse(res, e.errors[0]);
            } else {
                return responseUtil.badRequestResponse(res, e);
            }
        })
    }
    catch (error) {
        return responseUtil.serverErrorResponse(res, {message: error.message});
    }
}

const getTransactionAdmin = (req, res) => {
    try {
        TransactionHistory.findAll({
            include: [
                {
                    model: Product,
                    attributes: ['id', 'title', 'price', 'stock', 'CategoryId']
                },
                {
                    model: User,
                    attributes: ['id', 'email', 'balance', 'gender', 'role']
                }
            ]
        })
        .then((data) => {
            if (data === 0) {
                return responseUtil.badRequestResponse(res, {message: 'data not found'});
            }
            return responseUtil.successResponse(res, null, {transactionHistories: data});
        })
        .catch((e) => {
            if (e instanceof ValidationError) {
                return responseUtil.validationErrorResponse(res, e.errors[0]);
            } else {
                return responseUtil.badRequestResponse(res, e);
            }
        })
    }
    catch (error) {
        return responseUtil.serverErrorResponse(res, {message: error.message});
    }
}

const getTransaction = (req, res) => {
    try {
        const transactionId = parseInt(req.params.transactionId);
        const userId = req.user.id;
        TransactionHistory.findOne({
            where: {id: transactionId},
            include: [
                {
                    model: Product,
                    attributes: ['id', 'title', 'price', 'stock', 'CategoryId']
                }
            ]
        })
        .then((data) => {
            if (data === null) {
                return responseUtil.badRequestResponse(res, {message: 'data not found'});
            }
            if (data.userId !== userId) {
                return responseUtil.badRequestResponse(res, {message: 'data is not yours'});
            }
            return responseUtil.successResponse(res, null, {data});
        })
        .catch((e) => {
            if (e instanceof ValidationError) {
                return responseUtil.validationErrorResponse(res, e.errors[0]);
            } else {
                return responseUtil.badRequestResponse(res, e);
            }
        })
    } catch (error) {
        return responseUtil.serverErrorResponse(res, {message: error.message});
    }
}

router.get('/user', verifyToken, getTransactionUser);
router.get('/admin', verifyToken, getTransactionAdmin);
router.get('/:transactionId', verifyToken, getTransaction);
router.post('/', verifyToken, createTransaction);

module.exports = router;
