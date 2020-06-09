const { Account } = require('../models');

// const {sequelize} = require('../modal/connection');

async function getAllAccount() {
  const account = await Account.findAll({
    where: {
      isDeleted: false
    }
  });
  return account;
}
async function singleByUsername(username) {
  const account = await Account.findOne({
    where: {
      username,
      isDeleted: false
    }
  });
  return account;
}
async function findUserToVerify(username) {
  const account = await Account.findOne({
    where: {
      username,
      isDeleted: true
    }
  });
  return account;
}
async function singleByEmail(email) {
  const account = await Account.findOne({
    where: {
      email,
      isDeleted: false
    }
  });
  return account;
}
async function activeAccount(username) {
  const account = await Account.update(
    { isDeleted: false },
    {
      where: {
        username,
        isDeleted: true
      }
    }
  );
  return account;
}
async function createAccount(accountData) {
  const account = await Account.create({
    username: accountData.username,
    password: accountData.password,
    email: accountData.email,
    secretTokenEmail: accountData.secretTokenEmail
  });
  return account;
}
module.exports = {
  getAllAccount,
  singleByUsername,
  createAccount,
  singleByEmail,
  findUserToVerify,
  activeAccount
};
