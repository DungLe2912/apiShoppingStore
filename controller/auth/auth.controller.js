const router = require('express').Router();
const httpStatus = require('http-status');
const authService = require('../../services/authen.service');
const inforService = require('../../services/inforuser.service');
router.post('/register', authService.register);
router.post('/login', authService.login);

module.exports=router;