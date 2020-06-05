const router = require('express').Router();
const httpStatus = require('http-status');
const inforService = require('../../services/inforuser.service');
router.get('/', inforService.getInfor);
router.post('/addInfor',inforService.addInfor);
module.exports=router;