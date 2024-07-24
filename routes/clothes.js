const router = require('express').Router()
const clotheController = require('../controllers/clotheController')
const authMiddleware = require('../middlewares/auth')

router.route('/').post(authMiddleware, (req, res) => clotheController.create(req, res));

module.exports = router;

