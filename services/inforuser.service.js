const inforRepo = require('../repositories/inforUserRepo');
const { Conflict, NotExist, InternalServerError } = require('../utills/errHandle');
async function getInforUserByID(id){
    const infor = inforRepo.getInforUserByID(id);
    
    return infor;
}

module.exports={
    getAllInforUser,
}