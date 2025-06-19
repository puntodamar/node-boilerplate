const router = require('express').Router({mergeParams: true});

router.use('/api', require('./api'))

module.exports = router
