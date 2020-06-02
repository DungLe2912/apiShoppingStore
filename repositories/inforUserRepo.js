const INFOR_USER = require('../models/inforUser')
const {QueryTypes} = require ('sequelize');
//const {sequelize} = require('../modal/connection');

async function getInforUserByID(id){
    const account = await INFOR_USER.findOne({
        where:{
           id:id,
        },
    });
    return account;
}

module.exports={
    getInforUserByID,
}