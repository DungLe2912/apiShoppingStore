const router = require('express').Router();
const authService = require('../../services/authen.service');

router.post('/register', authService.register);
router.post('/login', authService.login);
router.post('/verify', authService.verifyCode);
router.put('/active', authService.activeAccount);
module.exports = router;
