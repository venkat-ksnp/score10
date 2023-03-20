const mongoos           =      require("mongoose");
const jwt               =      require('jsonwebtoken');
const bcrypt            =      require("bcrypt");
const ThisModel         =      mongoos.model('Package');
const Helper            =      require("../middleware/helper");
var nodemailer          =      require('nodemailer');

const create = async (req, res) => {
  // #swagger.tags = ['Package']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["hall_type_id","hall_name","length","width","capacity","shape"], 
        "properties": { 
          "hall_type_id": { 
            "type": "string",
          },
          "hall_name": { 
            "type": "string",
          },
          "length": { 
            "type": "string",
            "description":"Acccepts json encode format only"
          },
          "width": { 
            "type": "string",
          },
          "capacity": { 
            "type": "string",
          },
          "shape": { 
            "type": "string",
          },
          "is_active": { 
            "type": "string",
            "default":"true",
            "enum":["true","false"],
          }
        } 
      } 
    }
  */
  CreateModel = ThisModel()
  let BodyParams = await req.body
  
  for (const [key, value] of Object.entries(BodyParams)) {
    CreateModel[key]=value
  }
  // const opts = { runValidators: false , upsert: true };
  try{
    return await CreateModel.save( async (err,doc) => {
        if(!err){
          await Helper.SuccessValidation(req,res,doc,'Added successfully')
        }else{
          await Helper.ErrorValidation(req,res,err,null)
        }
    })
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const list = async (req, res) => {
  // #swagger.tags = ['Package']
  //  #swagger.parameters['page_size'] = {in: 'query',type:'number'}
  //  #swagger.parameters['page'] = {in: 'query',type:'number'}
  
  try{
      let pageSize = 0;
      let skip = 0;
      if(req.query.page && req.query.page_size){
        if (req.query.page >= 0 && req.query.page_size > 0) {
          pageSize = req.query.page_size;
          skip = req.query.page * req.query.page_size;
        }
      }
      let query={}
      
      const noOfRecord = await ThisModel.find(query).countDocuments();
      const record     = await ThisModel.find(query).lean().sort({ createdAt: -1 }).skip(skip).limit(pageSize)
      let records = {noOfRecord:noOfRecord,results:record}
      return await Helper.SuccessValidation(req,res,records)
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const view = async (req, res) => {
  // #swagger.tags = ['Package']
  try{
    let records = await ThisModel.findOne({_id:req.params.id})
    return await Helper.SuccessValidation(req,res,records)
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const update = async (req, res) => {
  // #swagger.tags = ['Package']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': {
        "properties": { 
          "hall_type_id": { 
            "type": "string",
          },
          "hall_name": { 
            "type": "string",
          },
          "length": { 
            "type": "string",
            "description":"Acccepts json encode format only"
          },
          "width": { 
            "type": "string",
          },
          "capacity": { 
            "type": "string",
          },
          "shape": { 
            "type": "string",
          },
          "is_active": { 
            "type": "string",
            "default":"true",
            "enum":["true","false"],
          }
        } 
      } 
    }
  */
  try{
    let CheckRecord = await ThisModel.findOne({_id:req.params.id});
    if(CheckRecord){
      let updatestatus = await ThisModel.updateOne({_id:req.params.id},{ $set:BodyParams})
      if(updatestatus){
        CheckRecord = await ThisModel.findOne({_id:req.params.id});
        return await Helper.SuccessValidation(req,res,CheckRecord)
      }else{
        return await Helper.ErrorValidation(req,res,updatestatus,'cache')
      }
    }else{
      return await Helper.ErrorValidation(req,res,{message:'Invalid id'},'cache')
    }
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const remove = async (req, res) => {
  // #swagger.tags = ['Package']
  try{
    let record = await ThisModel.findByIdAndDelete({_id:req.params.id})
    return await Helper.SuccessValidation(req,res,record)
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const bulkremove = async (req, res) => {
  // #swagger.tags = ['Package']
  //  #swagger.parameters['ids'] = { description: 'Enter multiple ids',type: 'array',required: true,}
  try{
    let record = await ThisModel.deleteMany({_id:req.params.ids})
    return await Helper.SuccessValidation(req,res,record)
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

module.exports = {create,list, view, update, remove, bulkremove};