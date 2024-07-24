const router = require('express').Router()
const usersRouter = require('./users')
const catsRouter = require('./cats')
const clothesRouter = require('./clothes')

router.use('/', usersRouter);
router.use('/cat', catsRouter);
router.use('/clothe', clothesRouter);

module.exports = router;