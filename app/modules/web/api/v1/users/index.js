const express = require('express');
const router = express.Router();
const controller = require('./user_controller')
const {auth} = require("../../../../../middlewares/auth");
const uploader = require('../../../../../models/user')
const rvalidator = require('./validators')

router.post('/me/avatar-upload', [auth, uploader.avatarUploader, uploader.avatarSaver], controller.avatarUpload)
router.post('/login', controller.login)
router.post('/logout', auth, controller.logout)
router.post('/logoutAll', auth, controller.logoutAll)
router.get('/me', auth, controller.me)
router.get('/:id', auth, controller.detail)
router.get('/:id/avatar', controller.avatar)
router.post('/:id/send-email', [auth, rvalidator.sendEmail], controller.sendEmail)
// router.post('/', [auth, rvalidator.sendEmail], controller.sendEmail)
router.get('/', auth, controller.list)
router.patch("/", [auth, rvalidator.patch], controller.update)

module.exports = router;
