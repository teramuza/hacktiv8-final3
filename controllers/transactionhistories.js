const express = require('express');
const {ValidationError} = require('sequelize');

const router = express.Router();
const BadRequestErr = require("../classes/BadRequestErr");
const verifyToken = require('../middleware/verifyToken');
const responseUtil = require('../helpers/response');
const { toRupiah } = require('../helpers/currency');
const { TransactionHistory, Product, User, Category } = require('../models');

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
                            req.payload = bodyData;
                            TransactionHistory.create(bodyData)
                            .then((data) => {
                                const msg = 'You have successfully purchase the product';
                                onSuccessTransaction({
                                    total_price,
                                    quantity,
                                    userId: id,
                                    productId,
                                    categoryId: product.CategoryId,
                                }).then(() => responseUtil.successResponse(
                                        res,
                                        {msg},
                                        {transactionBill: {total_price: toRupiah(total_price), quantity, product_name: product.title }},
                                        201
                                )).catch((err) => {
                                        if (err instanceof BadRequestErr)
                                            responseUtil.badRequestResponse(res, err)
                                })
                            })
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

const onSuccessTransaction = async ({total_price, quantity, userId, productId, categoryId}) => {
    await User.decrement({balance: -total_price}, {where: {id: userId}})
        .then((data) => {
            if (data[0] === 0) {
                throw BadRequestErr('user not found')
            }
        })
        .catch((err) => {
            throw BadRequestErr(err.message)
        });
    await Product.decrement({stock: -quantity}, {where: {id: productId}})
        .then((data) => {
            if (data[0] === 0) {
                throw BadRequestErr('product not found')
            }
        })
        .catch((err) => {
            throw BadRequestErr(err.message)
        });
    await Category.increment({sold_product_amount: +quantity}, {where: {id: categoryId}})
        .then((data) => {
            if (data[0] === 0) {
                throw BadRequestErr('category not found')
            }
        })
        .catch((err) => {
            throw BadRequestErr(err.message)
        });}


router.post('/', verifyToken, createTransaction);
router.get('/user', verifyToken, getTransactionUser);
router.get('/admin', verifyToken, getTransactionAdmin);

module.exports = router;
