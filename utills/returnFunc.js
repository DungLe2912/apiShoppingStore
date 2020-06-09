/* eslint-disable no-nested-ternary */
const errorcode = require('../constant/errorcode');

module.exports = function ReturnFuntion(params) {
  let returnObj = {};

  // const errCode=(params.length===0||params===null)?errorcode.NO_DATA:'';
  const errCode = (params === null) ? errorcode.NO_DATA : ((params.length === 0) ? errorcode.NO_DATA : '');
  const data = params;
  returnObj = { errCode, data };
  return returnObj;
};
