const router = require('express').Router()
const usersRouter = require('./users')

router.use('/', usersRouter)

module.exports = router;