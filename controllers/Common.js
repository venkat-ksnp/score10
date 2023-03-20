const mongoos           =      require("mongoose");
const jwt               =      require('jsonwebtoken');
const randtoken         =      require('rand-token');
const bcrypt            =      require("bcrypt");
const Helper            =      require("../middleware/helper");
const AuthorModel       =      mongoos.model('Author');

const Dashboard = async (req, res) => {
  // #swagger.tags = ['Author']
  // #swagger.parameters['role'] = { enum: [ "User", "Admin", "Superadmin"],default:'Superadmin'}
  try{
    return await Helper.SuccessValidation(req,res,[])
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

module.exports = {
  Dashboard,
};