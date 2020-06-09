/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-console */
/* eslint-disable func-names */
const passport = require('passport');
const passportJWT = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const accountService = require('../services/account.service');
const errorcode = require('../constant/errorcode');

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
module.exports = function (app) {
  app.use(passport.initialize());
  app.use(passport.session());

  const ls = new LocalStrategy({
    username: 'username',
    password: 'password'
  }, (username, password, done) => {
    // console.log(username);
    accountService.singleByUserName(username).then((rows) => {
      // console.log(rows);
      if (rows.errCode === errorcode.NO_DATA) {
        console.log('Not found user');
        return done(null, false, { message: 'Không tìm thấy người dùng' });
      }

      const user = rows.data.dataValues;
      if (user.isDeleted === true) {
        return done(null, false, { message: 'Tài khoản chưa được kích hoạt' });
      }
      const ret = bcrypt.compareSync(password, user.password);

      if (ret) {
        console.log('Done');
        return done(null, user);
      }
      return done(null, false, { message: 'Mật khẩu không chính xác' });
    }).catch((err) => done(err, false));
  });

  passport.use(ls);

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
  passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret',
    passReqToCallback: true
  },
  ((req, jwtPayload, done) =>
  // console.log(jwtPayload.username);
    accountService.singleByUserName(jwtPayload.username)
      .then((results) => {
        if (results.errCode === errorcode.NO_DATA) {
          return done(null, null, { message: 'Invalid username' });
        }
        if (results.data.dataValues.isDeleted === true) {
          return done(null, null, { message: 'User not exist' });
        }
        const user = results.data.dataValues;
        if (user.isDeleted === true) {
          return done(null, false, { message: 'Tài khoản chưa được kích hoạt' });
        }
        //   console.log(req.body.username);
        const obj = {
          id: user.id,
          username: user.username
        };
        console.log(obj);
        return done(null, obj);
      })
      .catch((err) => done(err, null))
  )));
};
