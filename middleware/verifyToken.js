const jwt = require('jsonwebtoken')
const response = require('../helpers/response')
require('dotenv').config();

const {JWT_SECRET_KEY} = process.env;

module.exports = async (req, res, next) => {
    let token = req.headers.authorization || req.headers.token;

    if (!token)
        return response.forbiddenResponse(res, 'access token required');

    if (token.includes('Bearer'))
        token = token.replace('Bearer ', '');

    jwt.verify(token, JWT_SECRET_KEY, function (err, decoded) {
        if (err)
            return response.unauthorizedResponse(res, err.message);

        req.user = decoded;
        return next();
    })
}
