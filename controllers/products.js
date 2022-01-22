const express = require('express');
const {ValidationError} = require('sequelize');

const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const verifyUser = require('../middleware/verifyUser');
const verifyAdmin = require('../middleware/verifyAdmin');
const responseUtil = require('../helpers/response');
const { toRupiah } = require('../helpers/currency');
const { Product, Category } = require('../models');

const getProducts = (req, res) => {
    try {
        Product.findAll()
        .then((data) => {
            if (data === 0) {
                return responseUtil.badRequestResponse(res, {message: 'data not found'});
            }
            const rebuild = data.map(item => {
                const container = {};
                container["id"] = item.id;
                container["title"] = item.title;
                container["price"] = toRupiah(item.price);
                container["stock"] = item.stock;
                container["CategoryId"] = item.CategoryId;
                container["createdAt"] = item.createdAt;
                container["updatedAt"] = item.updatedAt
                return container;
            })
            return responseUtil.successResponse(res, null, rebuild);
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

const createProduct = (req, res) => {
    try {
        let {
            title,
            price,
            stock,
            CategoryId
        } = req.body;
        if(!price) price = 0;
        const bodyData = {
            title,
            price,
            stock,
            CategoryId
        };
        
        Category.findOne({where: {id: CategoryId}})
        .then((category) => {
            if(category) {
                Product.create(bodyData)
                    .then((data) => {
                        responseUtil.successResponse(
                            res,
                            null,
                            {product: {id: data.id, title, price: toRupiah(price), stock, CategoryId, updatedAt: data.updatedAt, createdAt: data.createdAt}},
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
                return responseUtil.badRequestResponse(res, {message: 'CategoryId not found'});
            }
        })
        .catch((err) => {
            return responseUtil.badRequestResponse(res, err);
        })

    } catch (error) {
        return responseUtil.serverErrorResponse(res, {message: error.message});
    }
}

const updateProduct = (req, res) => {
    try {
        let {
            title,
            price,
            stock
        } = req.body;
        if(!price) price = 0;
        const bodyData = {
            title,
            price,
            stock
        };
        const productId = parseInt(req.params.productId);
        Product.update(bodyData, {where: {id:productId}, returning: true})
            .then((data) => {
                if (data[0] === 0) {
                    return responseUtil.badRequestResponse(res, {message: 'data not found'});
                }

                return responseUtil.successResponse(res, null, {product: {
                    id: data[1][0].id,
                    title,
                    price: toRupiah(price),
                    stock,
                    CategoryId: data[1][0].CategoryId,
                    createdAt: data[1][0].createdAt,
                    updatedAt: data[1][0].updatedAt}}, 200);
            })
            .catch(e => {
                if (e instanceof ValidationError) {
                    return responseUtil.validationErrorResponse(r, err.errors[0]);
                }
                return responseUtil.badRequestResponse(res, e);
            });
    } catch (error) {
        return responseUtil.serverErrorResponse(res, {message: e.message});
    }
}

const updateCategoryId = (req, res) => {
    try {
        const { CategoryId } = req.body;
        Category.findOne({where: {id: CategoryId}})
        .then((category) => {
            if(category) {
                Product.update({CategoryId: CategoryId}, {where: {CategoryId}, returning: true})
                .then((product) => {
                    return responseUtil.successResponse(res, null, {product: {
                        id: product[1][0].id,
                        title: product[1][0].title,
                        price: toRupiah(product[1][0].price),
                        stock: product[1][0].stock,
                        CategoryId: product[1][0].CategoryId,
                        createdAt: product[1][0].createdAt,
                        updatedAt: product[1][0].updatedAt}}, 200);
                })
                .catch((e) => {
                    return responseUtil.badRequestResponse(res, e);
                })
            } else {
                return responseUtil.badRequestResponse(res, {message: 'CategoryId not found'});
            }
        })
        .catch((err) => {
            return responseUtil.badRequestResponse(res, err);
        })
    } catch (error) {
        return responseUtil.serverErrorResponse(res, {message: error.message});
    }
}

const deleteProduct = (req, res) => {
    try {
        const productId = parseInt(req.params.productId);
        Product.destroy({where: {id: productId} })
        .then((result) => {
            if (result === 0) {
                return responseUtil.badRequestResponse(res, {message: 'data not found'});
            }

            return responseUtil.successResponse(res, 'Product has been successfully deleted');
        })
        .catch((e) => {
            return responseUtil.badRequestResponse(res, e);
        })
    } catch (error) {
        return responseUtil.serverErrorResponse(res, {message: error.message});
    }
}

router.get('/', getProducts);
router.post('/', verifyAdmin, createProduct);
router.put('/:productId', verifyAdmin, updateProduct);
router.patch('/:productId', verifyAdmin, updateCategoryId);
router.delete('/:productId', verifyAdmin, deleteProduct);

module.exports = router;
