const validator = require("../../../../../middlewares/validator");
const User = require('../../../../../models/user')
const {query, body, param} = require('express-validator');
const multer = require('multer')
const httpErrors = require('../../../../../formatters/errors/custom_errors');

module.exports = {
    filter: validator.validate([
        query('start_date', 'invalid date').optional().isDate().toDate(),
        query('end_date', 'invalid date').optional().isDate().toDate(),
        query('completed').optional().isBoolean().toBoolean(),
    ]),
    patch: validator.validate([], ['completed', 'description']),
}