var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const accountService = require('./account.service');
const errorcode = require('../constant/errorcode');
exports.register = async function (req, res, next) {
  const { username, password, email } = req.body;

  if (!username || !password) {
    return res.status(400).send({
      message: "Record is empty"
    })
  }
  await accountService.singleByUserName(username)
    .then(results => {
      if (results.errCode !== errorcode.NO_DATA)
        return res.status(400).send({
          message: "Username has been exist"
        })
    })
  const salt = 10;
  const hashedPassword = await bcrypt.hash(password, salt);

  const accountData = {
    username: username,
    password: hashedPassword,
    email: email,
  }

  const addAccount = await accountService.createAccount(accountData).then(data => {
    return res.send({ message: 'account created successfully' })
    //  console.log("account created successfully");
  }).catch(err => { return res.status(400).send({ message: err.message }) })
}
exports.login = async (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      //console.log(user);
      return res.status(200).json({
        success: false,
        message: info ? info.message : 'Đăng nhập thất bại',
        token:'',
        errCode: errorcode.LOGIN_FAIL,
      });
    }

    if (!user && info) {
      return res.status(200).json({
        success: false,
        message: info.message,
        token:'',
        errCode: errorcode.LOGIN_FAIL,
      })
    }

    req.logIn(user, err => {
    //  console.log(user);
      if (err)
        return res.status(200).json({
          success:false,
          message: info ? info.message : 'Đăng nhập thất bại',
          token:'',
          errCode: errorcode.LOGIN_FAIL,
        });


      var obj = {
        id: user.id,
        username: user.username,
        password: user.password
      }

      const token = jwt.sign({ username: user.username }, 'your_jwt_secret');
      return res.json({
        success: true,
        message: 'Đăng nhập thành công!',
        token: token,
        errCode:'',
      });
    });
  })(req, res, next);
}