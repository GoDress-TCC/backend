const router = require('express').Router()
const usersRouter = require('./users')
const catsRouter = require('./cats')

router.use('/', usersRouter);
router.use('/', catsRouter);

module.exports = router;