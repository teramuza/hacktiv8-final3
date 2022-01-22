const express = require('express');
const {ValidationError} = require('sequelize');

const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const verifyUser = require('../middleware/verifyUser');
const verifyAdmin = require('../middleware/verifyAdmin');
const responseUtil = require('../helpers/response');
const { Category, Product } = require('../models');

const createCategory = async (req, res) => {
    try {
        const {type} = req.body;
        Category.create({type}, {returning: true})
            .then((category) => responseUtil.successResponse(res, null, {
                category
            }))
            .catch(err => {
            if (err instanceof ValidationError)
                return responseUtil.validationErrorResponse(res, err.errors[0])
            else
                return responseUtil.badRequestResponse(res, err);
        })
    } catch (e) {
        return responseUtil.serverErrorResponse(res, {message: e.message});
    }
}

const getCategories = async (req, res) => {
    try {
        Category.findAll({
            include: {
                model: Product,
            }
        })
            .then((categories) => {
                return responseUtil.successResponse(res, null, {categories});
            })
            .catch((e) => responseUtil.badRequestResponse(res, e))
    } catch (e) {
        return responseUtil.serverErrorResponse(res, {message: e.message});
    }
}

const updateCategory = async (req, res) => {
    try {
        const {type} = req.body;
        const id = parseInt(req.params.categoryId);
        Category.update({type}, {where: {id: id}, returning: true})
            .then((data) => {
                if (data[0] === 0){
                    return responseUtil.badRequestResponse(res, {message: 'data not found'});
                }

                return responseUtil.successResponse(res, null, {category: data[1][0]});
            })
            .catch(err => {
                return responseUtil.badRequestResponse(res, err);
            })
    } catch (e) {
        return responseUtil.serverErrorResponse(res, {message: e.message});
    }
}

const deleteCategory = async (req, res) => {
    try {
        const id = parseInt(req.params.categoryId);
        Category.destroy({where: {id}})
            .then(result => {
                if (result === 0) {
                    return responseUtil.badRequestResponse(res, {message: 'Category not found'});
                }
                return responseUtil.successResponse(res, 'Category has been successfully deleted')
            })
            .catch(err => {
                return responseUtil.badRequestResponse(res, err);
            })
    } catch (e) {
        return responseUtil.serverErrorResponse(res, {message: e.message});
    }
}

router.post('/', createCategory);
router.get('/', getCategories);
router.patch('/:categoryId', updateCategory);
router.delete('/:categoryId', deleteCategory);

module.exports = router;
