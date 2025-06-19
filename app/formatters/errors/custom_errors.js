const { UserFacingError } = require('./application_error')

class BadRequestError extends UserFacingError {
    constructor(message, options = {}) {
        super(message);

        // You can attach relevant information to the error instance
        // (e.g.. the username)

        for (const [key, value] of Object.entries(options)) {
            this[key] = value;
        }
    }

    get statusCode() {
        return 400;
    }
}


class NotFoundError extends UserFacingError {
    constructor(message, options = {}) {
        super(message);

        // You can attach relevant information to the error instance
        // (e.g.. the username)

        for (const [key, value] of Object.entries(options)) {
            this[key] = value;
        }
    }
    get statusCode() {
        return 404
    }
}

class UnprocessableError extends UserFacingError {
    constructor(message, options = {}) {
        super(message);

        // You can attach relevant information to the error instance
        // (e.g.. the username)

        for (const [key, value] of Object.entries(options)) {
            this[key] = value;
        }
    }
    get statusCode() {
        return 422
    }
}

const errorFormatter = (errors) => {
    errors.forEach((e) => {

    })
}

module.exports = {
    BadRequestError,
    NotFoundError,
    UnprocessableError
}