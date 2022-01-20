const { User } = require('../models');
const response = require('../helpers/response')

module.exports = async (req, res, next) => {
    const {id, email} = req.user;
    User.findOne({where: {id, email}})
        .then((user) => {
            if (user) {
                req.user.role = user.role;
                next();
            } else {
                return response.unauthorizedResponse(res, 'user invalid or has logged out');
            }
        })
        .catch((e) => {
            return response.unauthorizedResponse(res, e.message);
        })
}
