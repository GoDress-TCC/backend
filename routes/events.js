const router = require('express').Router()
const eventController = require('../controllers/eventController')
const authMiddleware = require('../middlewares/auth')

router.route('/').post(authMiddleware, (req, res) => eventController.create(req, res));
router.route('/').get(authMiddleware, (req, res) => eventController.events(req, res));
router.route('/:id').put(authMiddleware, (req, res) => eventController.update(req, res));
router.route('/:id').delete(authMiddleware, (req, res) => eventController.delete(req, res));

module.exports = router;

