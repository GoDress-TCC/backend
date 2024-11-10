const router = require('express').Router();
const usersRouter = require('./users');
const catsRouter = require('./cats');
const clothingRouter = require('./clothes');
const outfitRouter = require('./outfits');
const eventsRouter = require('./events');

router.use('/', usersRouter);
router.use('/cat', catsRouter);
router.use('/clothing', clothingRouter);
router.use('/outfit', outfitRouter);
router.use('/event', eventsRouter);

module.exports = router;