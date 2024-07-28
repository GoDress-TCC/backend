const router = require('express').Router()
const clothingController = require('../controllers/clothingController')
const authMiddleware = require('../middlewares/auth')

router.route('/').post(authMiddleware, (req, res) => clothingController.create(req, res));

module.exports = router;

