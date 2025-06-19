const {User, avatarUploadPath} = require('../../../../../models/user')
const httpErrors = require('../../../../../formatters/errors/custom_errors');
const {present, error} = require("../../../../../formatters/result_formatter");
const hb = require('express-handlebars').create();
const datetime = require('node-datetime');
const email = require('../../../../../../config/sendinblue')

module.exports = {
    avatar: async (request, response, next) => {
        console.log(request.user.collectionName);
        const user = await User.findById(request.params.id)
        if (!user || !user.avatar) throw new httpErrors.NotFoundError('Image not found')

        response.set('Content-Type', 'image/jpg').send(user.avatar)
    },
    avatarUpload: async (request, response) => {
        await request.user.save()
        present(response, {user: request.user})
    },
    create: async (request, response, next) => {
        try {
            response.send(await User.create(request.body))
        } catch (e) {
            next(e)
        }
    },
    detail: async (request, response, next) => {

        response.send(await User.findById(request.params.id))
    },
    list: async (request, response, next) => {

        User.find({}).then((users) => {
            response.status(200)
            response.send(users)
        })
    },
    login: async (request, response, next) => {

        try {
            const user = await User.findByCredentials(request.body)
            const token = await user.generateAuthToken()
            response.send({token, user})
        } catch (e) {
            next(e)
        }
    },
    logout: async (request, response, next) => {
        request.user.tokens = request.user.tokens.filter((token) => {
            return token.token !== request.token
        })
        await request.user.save()
        response.send()
    },
    logoutAll: async (request, response, next) => {
        request.user.tokens = []
        await request.user.save()
        response.send()
    },
    me: async (request, response, next) => {
        const user = request.user
        await user.populate('tasks').execPopulate()
        response.send({user, tasks: user.tasks})

    },
    sendEmail: async (request, response) => {

        const html = await hb.render('./app/views/index.hbs', {time: datetime.create().format('Y-m-d H:M:S'), message: request.message})
        const data = {
            subject: "Test email",
            to: request.body.recipients,
            sender: request.body.sender,
            type: 'html',
            content: html
        }
        await email.send(data, function(err, result){
            if(err) return error(response, undefined, err.status, {errors: JSON.parse(err.response.text)})
            return present(response, result)
        })

    },
    update: async (request, response, next) => {
        try {
            const updates = Object.keys(request.body)
            const user = await User.findById(request.user._id)
            updates.forEach((field) => user[field] = request.body[field])
            await user.save()

            if (user) response.send(user)
        } catch (e) {
            next(e)
        }
    }
}