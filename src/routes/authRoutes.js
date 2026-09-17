const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.get('/logout', authController.logout);

module.exports = router;