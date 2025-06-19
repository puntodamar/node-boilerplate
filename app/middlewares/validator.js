const {validationResult} = require('express-validator');
const httpErrors = require('../formatters/errors/custom_errors');
const bcrypt = require('bcryptjs')

module.exports = {
    date: (request, field) => {
        return request.query[field] ? resolve() : reject(`${field} is required`)
    },
    pagination: (request, response, next) => {
        let errors = {}
        if(request.query.start_date instanceof Date || request.query.end_date instanceof Date){
            if(request.query.start_date === undefined)
                errors['start_date'] = ['is required']
            else if(request.query.end_date === undefined)
                errors['end_date'] = ['is required']

        }
        if(request.query.page !== undefined && isNaN(request.query.page))
            errors['page'] = ['is not a number']
        if(request.query.per_page !== undefined && isNaN(request.query.per_page))
            errors['per_page'] = ['is not a number']

        if (Object.keys(errors).length !== 0)
        return response.status(422).send({message: "Invalid parameter(s)", code: 422, errors})

        next()
    },
    unique: (model, field) => {
        return new Promise(function (resolve, reject) {
            model.findOne(field, function (error, exists) {
                if (error) return reject(error.toString())
                if (exists) return reject('already exists')
                return resolve()
            })
        })
    },
    validate: (validations, allowedFieldsToUpdate = [], validatedModel = undefined) => {

        return async (request, response, next) => {

            if (allowedFieldsToUpdate.length > 0) {
                const updates = Object.keys(request.body)
                if (!updates.every((update) => allowedFieldsToUpdate.includes(update)))
                    return response.status(422).send({
                        code: 422,
                        message: `Can only update field ${allowedFieldsToUpdate.join(", ")}`
                    })
            }

            await Promise.all(validations.map(validation => validation.run(request)));

            const errors = validationResult(request);
            if (errors.isEmpty()) {
                if (request.body.hasOwnProperty('password')) {
                    request.body.password = await bcrypt.hash(request.body.password, 8)
                }
                return next();
            }
            const formattedErrors = {}
            errors.array().forEach(e => {
                if (formattedErrors[e['param']] === undefined) formattedErrors[e['param']] = [e['msg']]
                else formattedErrors[e['param']].push(e['msg'])
            })
            response.status(422).json({
                message: "Invalid parameter(s)",
                errors: formattedErrors
            });
        };
    },
}

