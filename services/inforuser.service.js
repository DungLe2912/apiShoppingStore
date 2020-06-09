/* eslint-disable camelcase */
/* eslint-disable consistent-return */
/* eslint-disable func-names */
const passport = require('passport');
const errorcode = require('../constant/errorcode');
const inforRepo = require('../repositories/inforUserRepo');


exports.getInfor = async function (req, res, next) {
  passport.authenticate('jwt', { session: false }, async (err, user) => {
    if (!user) {
      return res.status(200).json({
        success: false,
        dataUser: null,
        message: 'Bạn chưa đăng nhập',
        errCode: errorcode.NOT_LOGGED
      });
    }
    inforRepo.getInforUserByID(user.id)
      .then((results) => {
        if (results === null) {
          return res.status(200).send({
            success: false,
            dataUser: null,
            message: 'Người dùng không có thông tin',
            errCode: errorcode.NO_DATA
          });
        }
        const dataUser = results[0];
        res.send({
          success: true,
          dataUser,
          message: 'Lấy thông tin thành công',
          errCode: ''
        });
      });
  })(req, res, next);
};
exports.addInfor = async function (req, res, next) {
  passport.authenticate('jwt', { session: false }, async (err, user, info) => {
    if (!user) {
      return res.status(200).json({
        success: false,
        dataUser: null,
        message: info ? info.message : 'Bạn chưa đăng nhập',
        errCode: errorcode.NOT_LOGGED
      });
    }
    const user_id = user.id;
    const infor = { ...req.body, user_id };
    inforRepo.addInforUser(infor).then((results) => {
      if (results.dataValues === null) {
        return res.status(200).send({
          success: false,
          dataUser: null,
          message: 'Không thể cập nhật thông tin',
          errCode: errorcode.ADD_INFOR_FAILED
        });
      }
      const obj = results.dataValues;
      res.send({
        success: true,
        dataUser: obj,
        message: 'Không thể cập nhật thông tin',
        errCode: ''
      });
    });
  })(req, res, next);
};
