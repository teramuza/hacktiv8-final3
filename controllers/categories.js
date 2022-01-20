const express = require('express');
const {ValidationError} = require('sequelize');

const router = express.Router();
const verifyAdmin = require('../middleware/verifyAdmin');
const responseUtil = require('../helpers/response');
const { Category } = require('../models');

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
        Category.findAll()
            .then((categories) => {
                return responseUtil.successResponse(res, null, {categories});
            })
            .catch((e) => responseUtil.badRequestResponse(res, e))
    } catch (e) {
        return responseUtil.serverErrorResponse(res, {message: e.message});
    }
}

router.post('/', verifyAdmin, createCategory);
router.get('/', getCategories);

module.exports = router;
