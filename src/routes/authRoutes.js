const { Router } = require('express');
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

const router = Router();

router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.get('/logout', authController.logout);

// Profile Settings Routes
router.get('/profile', requireAuth, authController.getProfile);
router.post('/profile', requireAuth, authController.postProfile);

module.exports = router;