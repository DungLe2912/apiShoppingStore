const passport = require('passport');
const passportJWT = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const accountService = require('../services/account.service');
const inforUserService = require('../services/inforuser.service');
const errorcode = require('../constant/errorcode');
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
module.exports = function (app) {

  app.use(passport.initialize());
  app.use(passport.session());

  const ls = new LocalStrategy({
    username: 'username',
    password: 'password'
  }, (username, password, done) => {
   // console.log(username);
    accountService.singleByUserName(username).then(rows => {
     // console.log(rows);
      if (rows.errCode === errorcode.NO_DATA) {
        console.log("Not found user")
        return done(null, false, { message: 'Không tìm thấy người dùng' });
      }

      const user = rows.data.dataValues;
     
      const ret = bcrypt.compareSync(password, user.password);
 
      if (ret) {
        console.log("Done");
        return done(null, user);
      }
      return done(null, false, { message: 'Mật khẩu không chính xác' });
    }).catch(err => {
      return done(err, false);
      
    })
  })

  passport.use(ls);

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
  passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : 'your_jwt_secret',
    passReqToCallback :true
    },
    function (req,jwtPayload, done) { 
     // console.log(jwtPayload.username);
    return accountService.singleByUserName(jwtPayload.username)
        .then(results => {
          if(results.errCode===errorcode.NO_DATA)
            return done(null, null, { message: 'Invalid username' });
          if(results.data.dataValues.isDeleted===true)
            return done(null,null,{message:'User not exist'});
          const user = results.data.dataValues;
       //   console.log(req.body.username);
            const obj = {
                id:user.id,
                username: user.username,
            }
            console.log(obj);
            return done(null,obj);
        })
        .catch(err => {
          return done(err, null);
        });
}
));

}