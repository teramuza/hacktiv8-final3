const express = require('express');
const jwt = require('jsonwebtoken');
const {ValidationError} = require('sequelize');

const router = express.Router();
const verifyToken = require('../middleware/verifyToken')
const responseUtil = require('../helpers/response');
const { toRupiah } = require('../helpers/currency');
const { User } = require('../models');
const {JWT_SECRET_KEY} = process.env;

const register = async (req, res) => {
    try {
        let {
            full_name,
            email,
            password,
            balance,
            gender,
            role
        } = req.body;
        if (!balance) balance = 0;
        User.create({full_name, email, password, balance, gender, role})
            .then(() => responseUtil.successResponse(
                res,
                null,
                {user: {email, full_name, balance: toRupiah(balance), gender, role}},
                201
            ))
            .catch((e) => {
                if (e instanceof ValidationError) {
                    return responseUtil.validationErrorResponse(res, e.errors[0]);
                }
                else {
                    return responseUtil.badRequestResponse(res, e);
                }
            });
    } catch (e) {
        return responseUtil.serverErrorResponse(res, {message: e.message});
    }
}

const login = (req, res) => {
    try {
        const {email, password} = req.body;
        if (email && password) {
            User.findOne({where: {email}})
                .then((user) => {
                    if (user) {
                        if (user.validPassword(password, user.password)) {
                            const userData = {
                                id: user.id,
                                email: user.email,
                                username: user.username,
                            }
                            const token = jwt.sign(userData, JWT_SECRET_KEY, {
                                expiresIn: '1h',
                            });
                            return responseUtil.successResponse(res, null, {token});
                        } else {
                            return responseUtil.unauthorizedResponse(res, 'password invalid')
                        }
                    }
                    return responseUtil.unauthorizedResponse(res, 'email is not registered')
                })
        } else {
            return responseUtil.badRequestResponse(res, {message: 'email & password required'})
        }
    } catch (e) {
        return responseUtil.serverErrorResponse(res, {message: e.message});
    }
}

const updateUser = (req, res) => {
    try {
        const {email, full_name} = req.body;
        const bodyData = {
            email,
            full_name,
        }
        const userId = parseInt(req.params.userId);
        if (req.user.id === userId) {
            User.update(bodyData, {where: {id: userId}, returning: true})
                .then((data) => {
                    if (data[0] === 0){
                        return responseUtil.badRequestResponse(res, {message: 'data not found'});
                    }
                    if (data[1][0])
                        data[1][0]['password'] = undefined;
                    return responseUtil.successResponse(res, null, {user: data[1][0]});
                })
                .catch(err => {
                    if (err instanceof ValidationError) {
                        return responseUtil.validationErrorResponse(res, err.errors[0]);
                    }
                    return responseUtil.badRequestResponse(res, err);
                })
        } else {
            return responseUtil.badRequestResponse(res, {message: 'you can only update your own data'})
        }
    } catch (e) {
        return responseUtil.serverErrorResponse(res, {message: e.message});
    }
}

const updatePassword = (req, res) => {
    try {
        const {email, password, new_password} = req.body;

        if (email && password && new_password) {
            User.findOne({where: {email}})
                .then((user) => {
                    if (user) {
                        user.update({password: new_password}, {where: {id: user.id}})
                            .then(() => {
                                return responseUtil.successResponse(res, 'update password successfully');
                            })
                            .catch(err => {
                                return responseUtil.badRequestResponse(res, err);
                            })
                    } else {
                        return responseUtil.badRequestResponse(res, {message: 'account was not found'})
                    }
                })
                .catch(err => {
                    return responseUtil.badRequestResponse(res, err);
                })
        }
    } catch (e) {
        return responseUtil.serverErrorResponse(res, {message: e.message});
    }
}

const topUpBalance = (req, res) => {
    try {
        const {balance} = req.body;
        const {id} = req.user;
        if (req.user.id === id) {
            User.increment({balance: +balance}, {where: {id}, returning: true})
                .then((data) => {
                    if (data[0] === 0){
                        return responseUtil.badRequestResponse(res, {message: 'user not found'});
                    }
                    return responseUtil
                        .successResponse(res, `Your balance has been successfully updated to ${toRupiah(data[0][0][0].balance)}`);
                })
                .catch(err => {
                    if (err instanceof ValidationError) {
                        return responseUtil.validationErrorResponse(res, err.errors[0]);
                    }
                    return responseUtil.badRequestResponse(res, err);
                })
        } else {
            return responseUtil.badRequestResponse(res, {message: 'you can only update your own balance'})
        }
    } catch (e) {
        return responseUtil.serverErrorResponse(res, {message: e.message});
    }
}

const deleteUser = (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        User.destroy({where: {id: userId}})
            .then(result => {
                if (result === 0) {
                    return responseUtil.badRequestResponse(res, {message: 'Account not found'});
                }
                return responseUtil.successResponse(res, 'Your account has been successfully deleted');
            })
            .catch(err => {
                return responseUtil.badRequestResponse(res, err);
            })
    } catch (e) {
        return responseUtil.serverErrorResponse(res, {message: e.message});
    }
}

router.post('/register', register);
router.post('/login', login);
router.put('/:userId', verifyToken, updateUser);
router.patch('/topup', verifyToken, topUpBalance);
router.patch('/changePassword', updatePassword);
router.delete('/:userId', verifyToken, deleteUser);

module.exports = router;
