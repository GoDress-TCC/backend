const router = require('express').Router()
const clothingController = require('../controllers/clothingController')
const authMiddleware = require('../middlewares/auth')

router.route('/').post(authMiddleware, (req, res) => clothingController.create(req, res));
router.route('/').get(authMiddleware, (req, res) => clothingController.clothes(req, res));
router.route('/:id').put(authMiddleware, (req, res) => clothingController.update(req, res)); 
router.route('/:id').delete(authMiddleware, (req, res) => clothingController.delete(req, res));
router.route('/remove_background').post(authMiddleware, (req, res) => clothingController.remove_background(req, res));

module.exports = router;

