const mongoos           =      require("mongoose");
const jwt               =      require('jsonwebtoken');
const randtoken         =      require('rand-token');
const bcrypt            =      require("bcrypt");
const Helper            =      require("../middleware/helper");
const AuthorModel       =      mongoos.model('Author');
const expres            =     require('express')
const router            =     expres.Router()
// const fileUpload        =     require('express-fileupload');
// router.use(fileUpload());
var path=require('path');
const Dashboard = async (req, res) => {
  // #swagger.tags = ['Common']
  // #swagger.parameters['role'] = { enum: [ "User", "Admin", "Superadmin"],default:'Superadmin'}
  try{
    return await Helper.SuccessValidation(req,res,[])
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const Upload = async (req, res) => {
  // #swagger.tags = ['Common']
  /*
    #swagger.consumes = ['multipart/form-data']  
    #swagger.parameters['singleFile'] = {
    in: 'formData',
    type: 'file',
    required: 'true',
    description: 'Upload file...',
  } 
  */
  try{
    let sampleFile;
    return await Helper.SuccessValidation(req,res,[])
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

module.exports = {
  Dashboard,
  Upload,
};