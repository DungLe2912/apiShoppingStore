var bcrypt  = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const accountService = require('./account.service');
const errorcode = require('../constant/errorcode');
exports.register = async function(req,res,next) {
    passport.authenticate('jwt', { session: false },async(err,user, info) => {
        const {username, password} = req.body;
       
        if(!username || !password){
          return res.status(400).send({
              message:"Record is empty"
          })
      }
     await accountService.singleByUserName(username)
            .then(results => {
              if(results.errCode!==errorcode.NO_DATA)
              return res.status(400).send({
                message:"Username has been exist"
              })
            })
      const salt = 10;
      const hashedPassword = await bcrypt.hash(password, salt);
    
      const accountData={
          username:username,
          password:hashedPassword,
      }
      
      const addAccount= await accountService.createAccount(accountData).then(data => {
        return res.send({ message: 'account created successfully' })
     //  console.log("account created successfully");
       }).catch(err=>{return res.status(400).send({message:err.message})})
      // const addInfo = await accountService.singleByUserName(accountData.username)
      //       .then(result => {
      //        // console.log(result);
      //         if(result.length==0)
      //         return res.status(400).send({
      //           message:"Not found user"
      //         })
      //         const infor=result[0];
      //         console.log(infor);
      //         cons accountInfor={
      //           FKAccount:infor.IDAccount,
      //           Firstname:null,
      //           Lastname:null,
      //           DOB:null,
      //           Avatar:null,
      //           City:null,
      //           District:null,
      //           AddInfor:null,
      //           Introduction:null

      //         }
      //         console.log(entityInfor);
      //         adminModel.addInfor(entityInfor).then(data => {
      //           return  res.send({ entity,entityInfor, message: 'Account and information created successfully' });
      //        // console.log("Information created successfully");
      //         }).catch(err=>{
      //           return res.status(400).send({message:err.message})})
      //       }).catch(err=>{return res.status(400).send({message:err.message})})
      })(req, res, next);
}
exports.login = async (req,res,next) =>{
    passport.authenticate('local',  (err, user, info) => {
        if (err) {
            return res.status(400).json({
                message: info ? info.message : 'Login failed',
                user   : user
            });
        }
        
        if(!user && info){
            return res.status(400).json({
                message: info.message
            })
        }
       
        req.logIn(user, err => {
          if (err)
          return res.status(400).json({
            message: info ? info.message : 'Login failed',
            user   : user
         });
         
  
          var obj={
            id:user.id,
            username:user.username,
            password:user.password
          }
          
          const token = jwt.sign({username: user.username}, 'your_jwt_secret');
            return res.json({success: true,
              message: 'Authentication successful!',
              user:obj,
              token:token
            });
        });
      })(req, res, next);
}