const router = require('express').Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middlewares/auth')

// rotas de autenticação
router.route('/auth/register').post((req, res) => userController.create(req, res))
router.route('/auth/login').post((req, res) => userController.login(req, res))
router.route('/auth/forgot_password').post((req, res) => userController.forgot_password(req, res)) 
router.route('/auth/reset_password').post((req, res) => userController.reset_password(req, res)) 

router.route('/user/:id').get(authMiddleware, (req, res) => userController.user(req, res))

module.exports = router;


