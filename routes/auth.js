const express = require("express");
const authController = require('../controllers/auth');

const router = express.Router();

const auth = require('../middleware/auth');

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/editprofile',auth, authController.editProfile);

// router.get('/logout', authController.logout);

module.exports = router;