const router = require('express').Router()
const clothingController = require('../controllers/clothingController')
const authMiddleware = require('../middlewares/auth')

router.route('/').post(authMiddleware, (req, res) => clothingController.create(req, res));
router.route('/').get(authMiddleware, (req, res) => clothingController.clothes(req, res));
router.route('/favs').get(authMiddleware, (req, res) => clothingController.favClothes(req, res));

module.exports = router;

