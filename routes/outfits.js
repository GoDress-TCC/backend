const router = require('express').Router()
const outfitController = require('../controllers/outfitController')
const authMiddleware = require('../middlewares/auth')

router.route('/generateOutfit').post(authMiddleware, (req, res) => outfitController.generateOutfit(req, res));
router.route('/').post(authMiddleware, (req, res) => outfitController.saveOutfit(req, res));

module.exports = router;

