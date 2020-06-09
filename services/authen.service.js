/* eslint-disable consistent-return */
/* eslint-disable func-names */
/* eslint-disable no-shadow */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const randomstring = require('randomstring');
const accountService = require('./account.service');
const errorcode = require('../constant/errorcode');
const transport = require('../utills/sendEmail');

exports.register = async function (req, res) {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(200).send({
      success: false,
      message: 'Trường bị trống',
      errCode: errorcode.REGISTERED_FAILED
    });
  }
  await accountService.singleByUserName(username)
    .then((results) => {
      if (results.errCode !== errorcode.NO_DATA) {
        return res.status(200).send({
          success: false,
          message: 'Tên người dùng đã được sử dụng',
          errCode: errorcode.REGISTERED_FAILED
        });
      }
    });
  await accountService.singleByEmail(email)
    .then((results) => {
      if (results.errCode !== errorcode.NO_DATA) {
        return res.status(200).send({
          success: false,
          message: 'Email đã được sử dụng',
          errCode: errorcode.REGISTERED_FAILED
        });
      }
    });
  const salt = 10;
  const hashedPassword = await bcrypt.hash(password, salt);
  const secretTokenEmail = randomstring.generate();
  const accountData = {
    username,
    password: hashedPassword,
    email,
    secretTokenEmail
  };

  await accountService.createAccount(accountData).then(() => {
    const htmlOutput = `
    <p>(Do not reply)</p>
    <h3>Verify Code: ${accountData.secretTokenEmail}</h3>`;
    const mailOption = {
      from: process.env.EMAIL,
      to: accountData.email,
      subject: 'Verify account by email',
      html: htmlOutput
    };
    transport.sendMail(mailOption, (err) => {
      if (err) {
        res.send({
          success: false,
          message: 'Gửi mã xác nhận thất bại',
          errCode: errorcode.SEND_CODE_FAILED
        });
      }
      else {
        res.send({
          success: true,
          message: 'Đăng kí thành công',
          errCode: ''
        });
      }
    });
  }).catch(() => res.status(200).send({
    success: false,
    message: 'Email không hợp lệ',
    errCode: errorcode.REGISTERED_FAILED
  }));
};

exports.verifyCode = async function (req, res) {
  const { code, username } = req.body;

  if (!code || !username) {
    return res.status(200).send({
      success: false,
      message: 'Trường bị trống',
      errCode: errorcode.VERIFY_FAILED
    });
  }
  await accountService.findUserToVerify(username)
    .then((results) => {
      if (results.errCode === errorcode.NO_DATA) {
        return res.status(200).send({
          success: false,
          message: 'Không thể tìm thấy tài khoản',
          errCode: errorcode.VERIFY_FAILED
        });
      }

      if (code === results.data.secretTokenEmail) {
        return res.status(200).send({
          success: true,
          message: 'Xác thực thành công',
          errCode: ''
        });
      }

      return res.status(200).send({
        success: false,
        message: 'Xác thực thất bại',
        errCode: errorcode.VERIFY_FAILED
      });
    }).catch(() => res.status(200).send({
      success: false,
      message: 'Xác thực thất bại',
      errCode: errorcode.VERIFY_FAILED
    }));
};
exports.activeAccount = async function (req, res) {
  const { username } = req.body;
  if (!username) {
    return res.status(200).send({
      success: false,
      message: 'Trường bị trống',
      errCode: errorcode.ACTIVATE_FAILED
    });
  }
  await accountService.findUserToVerify(username)
    .then((results) => {
      if (results.errCode === errorcode.NO_DATA) {
        return res.status(200).send({
          success: false,
          message: 'Không thể tìm thấy tài khoản',
          errCode: errorcode.ACTIVATE_FAILED
        });
      }

      accountService.activeAccount(username).then(() => res.status(200).send({
        success: true,
        message: 'Kích hoạt tài khoản thành công',
        errCode: ''
      })).catch(() => res.status(200).send({
        success: false,
        message: 'Kích hoạt tài khoản thất bại',
        errCode: errorcode.VERIFY_FAILED
      }));
    }).catch(() => res.status(200).send({
      success: false,
      message: 'Xác thực thất bại',
      errCode: errorcode.VERIFY_FAILED
    }));
};
exports.login = async (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      // console.log(user);
      return res.status(200).json({
        success: false,
        message: info ? info.message : 'Đăng nhập thất bại',
        token: '',
        errCode: errorcode.LOGIN_FAIL
      });
    }

    if (!user && info) {
      return res.status(200).json({
        success: false,
        message: info.message,
        token: '',
        errCode: errorcode.LOGIN_FAIL
      });
    }

    req.logIn(user, (err) => {
    //  console.log(user);
      if (err) {
        return res.status(200).json({
          success: false,
          message: info ? info.message : 'Đăng nhập thất bại',
          token: '',
          errCode: errorcode.LOGIN_FAIL
        });
      }


      const token = jwt.sign({ username: user.username }, 'your_jwt_secret', { expiresIn: '24h' });
      return res.json({
        success: true,
        message: 'Đăng nhập thành công!',
        token,
        errCode: ''
      });
    });
  })(req, res, next);
};
