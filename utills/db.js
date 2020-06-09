const { singleByUserName } = require('../repositories/accountRepo');

console.log(`account: ${singleByUserName('admin')}`);
