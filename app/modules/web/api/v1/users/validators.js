const validator = require('validator')
const customValidator = require("../../../../../middlewares/validator");
const User = require('../../../../../models/user')
const {query, body, param, check} = require('express-validator');
const multer = require('multer')
const httpErrors = require('../../../../../formatters/errors/custom_errors');


module.exports = {
    create: customValidator.validate([
        body('name', 'is required').trim().exists().isAlpha().isLength({min: 4}).withMessage('should be minimum 4 characters long'),
        body('password', 'is required').trim().exists().isLength({min: 7}).withMessage('should be minimum 4 characters long').isAlphanumeric(),
        body('email', 'is required').trim().exists().isEmail().withMessage('is invalid').bail().custom(email => {
            return customValidator.unique(User, {email})
        })
    ]),
    patch: customValidator.validate([], ['password', 'name', 'email']),
    sendEmail: customValidator.validate(
        [
            body('sender', 'is required')
                .custom((sender) => {
                    return new Promise(function (resolve, reject) {
                        if(!sender) return reject('is required')
                        if(!sender.name) return reject(`sender.name is required`)
                        if(!sender.email) return reject(`sender.email is required`)
                        if(!validator.isEmail(sender.email)) return reject(`value 'email' is not a valid email address`)
                        return resolve()
                    })
                }),
            body('recipients', 'is required').custom((recipients) => {
                return new Promise(function(resolve, reject){
                    if(!recipients) return reject('is required')
                    if(!Array.isArray(recipients)) return reject('is not an array')
                    recipients.forEach(function (recipient, i) {
                        console.log()
                        if(!recipient.name) return reject(`recipients[${i}].name is required`)
                        if(!recipient.email) return reject(`recipients[${i}].email is required`)
                        if(!validator.isEmail(recipient.email)) return reject(`recipients[${i}].email is not a valid email address`)
                    })
                    return resolve()
                })
            }),
            body('message', 'is required').custom((message) => {
                if(!message) return Promise.reject('is required')
                if(typeof message !== "string") return Promise.reject('is not a string')
                return Promise.resolve()
            })
        ]
    )
}