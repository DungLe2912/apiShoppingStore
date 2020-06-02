const accRepo = require('../repositories/accountRepo');
const { Conflict, NotExist, InternalServerError } = require('../utills/errHandle');
const errorcode = require('../constant/errorcode');
const ReturnFuntion = require('../utills/returnFunc');
async function getAllAccount(){
    const account = await accRepo.getAllAccount();
    return ReturnFuntion(account);
}
async function singleByUserName(username){
    const account = await accRepo.singleByUsername(username);
    return ReturnFuntion(account);
}
async function createAccount(accountData){
    const account = await accRepo.createAccount(accountData);
    return account;
}
module.exports={
    getAllAccount,
    singleByUserName,
    createAccount,
}