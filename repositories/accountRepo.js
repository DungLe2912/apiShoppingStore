const {Account} = require('../models');

const {QueryTypes} = require ('sequelize');
//const {sequelize} = require('../modal/connection');

async function getAllAccount(){
    
    const account = await Account.findAll({
        where:{
            isDeleted:false,
        },
    });
    return account;
}
async function singleByUsername(username){
    const account = await Account.findOne({
        where:{
            username:username,
            isDeleted:false,
        },
    });
    return account;
}
async function createAccount(accountData){
    const account = await Account.create({
        username:accountData.username,
        password:accountData.password,
        is_deleted:false,
    });
    return account;
}
module.exports={
    getAllAccount,
    singleByUsername,
    createAccount,
}