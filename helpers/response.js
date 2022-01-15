const logging = require("../helpers/logging");
const successResponse = (res, message, data = {}, status = 200) => {
    if (message) {
        data.message = message;
    }
    return res.status(status).json(data);
}

const unauthorizedResponse = (res, message) => {
    return res.status(401).json({
        type: 'unauthorized',
        message
    })
}

const forbiddenResponse = (res, message) => {
    return res.status(403).json({
        type: 'forbidden',
        error: {
            message,
        }
    })
}

const badRequestResponse = (res, error) => {
    logging.error(error);
    return res.status(400).json({
        type: 'bad_request',
        error
    })
}

const serverErrorResponse = (res, error) => {
    logging.error(error);
    return res.status(503).json({
        type: 'server_error',
        error
    })
}

const validationErrorResponse = (res, error) => {
    logging.error(error);
    return res.status(400).json({
        type: 'validation_error',
        error: {
            message: error.message,
        }
    })
}

module.exports = {
    successResponse,
    unauthorizedResponse,
    forbiddenResponse,
    badRequestResponse,
    serverErrorResponse,
    validationErrorResponse
}
