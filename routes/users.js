const router = require('express').Router()
const userController = require('../controllers/userController')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')

dotenv.config();

// rotas de autenticação
router.route('/auth/register').post((req, res) => userController.create(req, res))
router.route('/auth/login').post((req, res) => userController.login(req, res))

router.route('/user/:id').get(checkToken, (req, res) => userController.user(req, res))

function checkToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ msg: 'Acesso negado!' })
    }

    try {
        const secret = process.env.SECRET

        jwt.verify(token, secret)

        next()
    }
    catch (error) {
        res.status(400).json({})
    }
}

module.exports = router;

