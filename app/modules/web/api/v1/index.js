const router = require('express').Router({mergeParams: true});

router.use('/users', require('./users'))
router.use('/tasks', require('./tasks'))

module.exports = router

