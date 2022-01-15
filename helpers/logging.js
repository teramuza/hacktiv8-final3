require('dotenv').config();
const logging = process.env.DEV_MODE !== 'false';

const error = (...data) => logging && console.error(...data);

const log = (...data) => logging && console.log(...data);

const warn = (...data) => logging && console.warn(...data);

module.exports = {
    error,
    log,
    warn,
}
