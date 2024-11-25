const router = require('express').Router()
const outfitController = require('../controllers/outfitController')
const authMiddleware = require('../middlewares/auth')

router.route('/generate_outfit').post(authMiddleware, (req, res) => outfitController.generate_outfit(req, res));
router.route('/').post(authMiddleware, (req, res) => outfitController.save_outfit(req, res));
router.route('/').get(authMiddleware, (req, res) => outfitController.outfits(req, res));

module.exports = router;

