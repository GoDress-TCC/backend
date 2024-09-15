const router = require('express').Router();
const usersRouter = require('./users');
const catsRouter = require('./cats');
const clothingRouter = require('./clothes');
const outfitRouter = require('./outfits');

router.use('/', usersRouter);
router.use('/cat', catsRouter);
router.use('/clothing', clothingRouter);
router.use('/outfit', outfitRouter);

module.exports = router;