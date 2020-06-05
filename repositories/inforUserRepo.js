const {INFOR_USER} = require('../models')
const {QueryTypes} = require ('sequelize');
//const {sequelize} = require('../modal/connection');

async function getInforUserByID(id){
    const account = await INFOR_USER.findOne({
        where:{
          user_id :id,
        },
    });
    return account;
}
async function addInforUser(infor){
    const inforUser = await INFOR_USER.create({
        userID:infor.user_id,
        firstname: infor.firstname,
        lastname: infor.lastname,
        avatar: infor.avatar,
        dob:infor.dob,
        gender:infor.gender,
    });
    return inforUser;
}
module.exports={
    getInforUserByID,
    addInforUser
}