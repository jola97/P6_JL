// Importations des packages
const express = require('express');
const auth = require('../middleware/auth');
const sauceCtrl = require('../controllers/sauce');
const multer = require('../middleware/multer-config');

// Création du router d'express
const router = express.Router();

// Routes
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauces);

router.post('/:id/like', auth, sauceCtrl.likeAndDislikeSauce);

// Exportation du router
module.exports = router;