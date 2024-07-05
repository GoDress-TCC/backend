const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')

dotenv.config();

const authMiddleware = (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const secret = process.env.SECRET;
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Acesso negado!' });
    }
};

module.exports = authMiddleware

