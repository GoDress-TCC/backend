const router = require('express').Router()
const catController = require('../controllers/catController')
const authMiddleware = require('../middlewares/auth')

router.route('/').post(authMiddleware, (req, res) => catController.create(req, res));
router.route('/').get(authMiddleware, (req, res) => catController.cats(req, res));
router.route('/:id').put(authMiddleware, (req, res) => catController.update(req, res));
router.route('/:id').delete(authMiddleware, (req, res) => catController.delete(req, res));

module.exports = router;

