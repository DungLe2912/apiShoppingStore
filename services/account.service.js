const accRepo = require('../repositories/accountRepo');
const ReturnFuntion = require('../utills/returnFunc');

async function getAllAccount() {
  const account = await accRepo.getAllAccount();
  return ReturnFuntion(account);
}
async function singleByUserName(username) {
  const account = await accRepo.singleByUsername(username);
  return ReturnFuntion(account);
}
async function findUserToVerify(username) {
  const account = await accRepo.findUserToVerify(username);
  return ReturnFuntion(account);
}
async function singleByEmail(email) {
  const account = await accRepo.singleByEmail(email);
  return ReturnFuntion(account);
}
async function createAccount(accountData) {
  const account = await accRepo.createAccount(accountData);
  return account;
}
async function activeAccount(username) {
  const account = await accRepo.activeAccount(username);
  return account;
}
module.exports = {
  getAllAccount,
  singleByUserName,
  createAccount,
  singleByEmail,
  findUserToVerify,
  activeAccount
};
