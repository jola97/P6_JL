// Importation du package mongoose 
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

// Routes
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// Exportation du router
module.exports = router;