const jwt = require('jsonwebtoken');
const passport = require('passport');
const errorcode = require('../constant/errorcode');
const inforRepo = require('../repositories/inforUserRepo');
const { Conflict, NotExist, InternalServerError } = require('../utills/errHandle');

exports.getInfor = async function (req, res, next) {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (!user) {
            return res.status(200).json({
                success: false,
                dataUser: null,
                message: 'Bạn chưa đăng nhập',
                errCode: errorcode.NOT_LOGGED,
            });
        }
        inforRepo.getInforUserByID(user.id)
            .then(results => {
                console.log(results);
                if (results === null)
                    return res.status(200).send({
                        success: false,
                        dataUser: null,
                        message: "Người dùng không có thông tin",
                        errCode: errorcode.NO_DATA,
                    })
                var obj = results.dataValues;
                res.send({ 
                    success: true, 
                    dataUser: obj, 
                    message: 'Lấy thông tin thành công',
                    errCode: '',
                 });
            })

    })(req, res, next);
};
exports.addInfor=async function(req,res,next){
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        console.log(user);
        if (!user) {
            return res.status(400).json({
                message: info ? info.message : 'You are not logged in',
                user: user
            });
        }
        const user_id = user.id;
        const infor={...req.body,user_id};
        console.log(infor);
        inforRepo.addInforUser(infor).then(results => {
                if (results.dataValues === null)
                    return res.status(400).send({
                        message: "User do not have information"
                    })
                var obj = results.dataValues;
                res.send({ success: true, obj, message: 'Get information complete' });
            })

    })(req, res, next);
}