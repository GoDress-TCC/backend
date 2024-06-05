const router = require('express').Router()
const userController = require('../controllers/userController')

router.route('/auth/register').post((req, res) => userController.create(req, res))

module.exports = router;

