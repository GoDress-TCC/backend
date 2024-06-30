const router = require('express').Router()
const catController = require('../controllers/catController')
const authMiddleware = require('../middlewares/auth')

router.route('/user/cat').post(authMiddleware, (req, res) => catController.create(req, res))

module.exports = router;

