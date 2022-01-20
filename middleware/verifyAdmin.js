const response = require('../helpers/response')
const ROLE = require('../constants/role');

module.exports = async (req, res, next) => {
    const {role} = req.user;
    if (role !== ROLE.ADMIN) {
        return response.forbiddenResponse(res, 'you don\'t have access')
    }
    next();
}
