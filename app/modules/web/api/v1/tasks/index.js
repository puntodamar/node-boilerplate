const express = require('express');
const router = express.Router();
const controller = require('./task_controller')
const {auth} = require("../../../../../middlewares/auth");
const mValidator = require("../../../../../middlewares/validator");
const rValidator = require('./validators')

router.get('/:id', [auth], controller.detail)
router.patch('/:id', [auth,rValidator.patch], controller.update )
router.post('/', [auth], controller.create)
router.get('/', [auth, rValidator.filter, mValidator.pagination], controller.user_tasks)

module.exports = router;
