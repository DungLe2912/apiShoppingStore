const { QueryTypes } = require('sequelize');
const { INFOR_USER } = require('../models');
const db = require('../models/index');

async function getInforUserByID(id) {
  const infor = await db.sequelize.query(
    'SELECT acc.username, acc.email, infor.firstname, infor.lastname, infor.avatar, infor.dob, infor.gender FROM `account` as acc LEFT JOIN `infor_user` as infor ON infor.user_id = acc.id WHERE acc.id = ? and acc.is_deleted=0 ',
    {
      replacements: [id],
      type: QueryTypes.SELECT
    }
  );
  return infor;
}
async function addInforUser(infor) {
  const inforUser = await INFOR_USER.create({
    userID: infor.user_id,
    firstname: infor.firstname,
    lastname: infor.lastname,
    avatar: infor.avatar,
    dob: infor.dob,
    gender: infor.gender
  });
  return inforUser;
}
module.exports = {
  getInforUserByID,
  addInforUser
};
