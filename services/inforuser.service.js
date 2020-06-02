const jwt = require('jsonwebtoken');
const passport = require('passport');
const errorcode = require('../constant/errorcode');
const inforRepo = require('../repositories/inforUserRepo');
const { Conflict, NotExist, InternalServerError } = require('../utills/errHandle');

exports.getInfor = async function (req, res, next) {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        console.log(user);
        if (!user) {
            return res.status(400).json({
                message: info ? info.message : 'You are not logged in',
                user: user
            });
        }
        inforRepo.getInforUserByID(user.id)
            .then(results => {
                if (results.dataValues === null)
                    return res.status(400).send({
                        message: "User do not have information"
                    })
                var obj = results.dataValues;
                res.send({ success: true, obj, message: 'Get information complete' });
            })

    })(req, res, next);
}