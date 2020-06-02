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

module.exports={
    getInforUserByID,
}