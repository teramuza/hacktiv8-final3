class BadRequestErr extends Error{
    constructor(message) {
        super(message);
        this.type = 'BadRequestErr'
    }
}

module.exports = BadRequestErr;
