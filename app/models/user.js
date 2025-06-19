const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')
const httpErrors = require('../formatters/errors/custom_errors');
const multer = require('multer')
const fs = require('fs')
const sharp = require('sharp')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        default: 0,
        required: false,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: String
    }

})


userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})


// userSchema.pre('init', function(){
//     console.log("\n");
// })

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) user.password = await bcrypt.hash(user.password, 8)
    next()
})

userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({owner: user._id})
    next()
})

userSchema.statics.findByCredentials = async (params) => {
    const user = await User.findOne({email: params.email})
    if (!user)
        throw new httpErrors.UnprocessableError('User not found')
    if (!await bcrypt.compare(params.password, user.password))
        throw new httpErrors.UnprocessableError('Invalid password')

    return user
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, 'secretkey', {expiresIn: '7 days'})
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}


userSchema.methods.toJSON = function () {
    const user = this
    if (user.avatar !== undefined) user.avatar = `/${avatarUploadPath}${user.avatar}`
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

const User = mongoose.model('User', userSchema)

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        const extension = file.mimetype.split("/")[1]
        cb(undefined, `${Date.now().toString()}.${extension}`)
    },
    limits: {
        fileSize: 5000000
    },
    fileFilter(request, file, callback) {
        if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
            callback(new httpErrors.UnprocessableError('file should be either .jpg, .png, .jpeg'))
            callback(undefined, false)

        }
        callback(undefined, true)
    }
})

const avatarUploadPath = 'public/uploads/images/user/avatar/'

const avatarSaver = async(request, response, next) => {
    if(request.user.avatar !== undefined) fs.unlinkSync(`./${avatarUploadPath}${request.user.avatar}`)
    await sharp(request.file.path).resize(200,200).toFile(`./${avatarUploadPath}${request.file.filename}`)
    request.user.avatar = request.file.filename
    next()
}

module.exports = {
    User,
    avatarUploader: multer({storage: storage}).single('avatar'),
    avatarUploadPath,
    avatarSaver
}