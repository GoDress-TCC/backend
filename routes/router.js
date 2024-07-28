const router = require('express').Router()
const usersRouter = require('./users')
const catsRouter = require('./cats')
const clothingRouter = require('./clothes')

router.use('/', usersRouter);
router.use('/cat', catsRouter);
router.use('/clothing', clothingRouter);

module.exports = router;