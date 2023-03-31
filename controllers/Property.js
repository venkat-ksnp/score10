const mongoos           =      require("mongoose");
const jwt               =      require('jsonwebtoken');
const bcrypt            =      require("bcrypt");
const ThisModel         =      mongoos.model('Property');
const Helper            =      require("../middleware/helper");
var nodemailer          =      require('nodemailer');

const create = async (req, res) => {
  // #swagger.tags = ['Property']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["author_id","title","type","status","pincode","address","flat_no","tax_number","total_floors","floor_of_property","age_of_property","face","property_category","state","city","amenities"], 
        "properties": { 
          "author_id": { 
            "type": "string",
            "description":"Take _id from authors landlords role"
          },
          "title": { 
            "type": "string",
          },
          "description": { 
            "type": "string",
          },
          "icon": { 
            "type": "object",
            "description":"S3 Bucket object"
          },
          "type": { 
            "type": "string",
            "enum": ["Appartment","Villa","IndividualHouse"],
            "default":"Appartment"
          },
          "status": { 
            "type": "string",
            "enum": ["Rented","Vacant"],
            "default":"Rented"
          },
          "pincode": { 
            "type": "number",
          },
          "address": { 
            "type": "string",
          },
          "flat_no": { 
            "type": "number",
          },
          "tax_number": { 
            "type": "number",
          },
          "total_floors": { 
            "type": "number",
          },
          "floor_of_property": { 
            "type": "number",
          },
          "age_of_property": { 
            "type": "number",
          },
          "face": { 
            "type": "string",
            "enum": ["East", "West", "South","North"],
            "default":"East"
          },
          "property_category": { 
            "type": "string",
            "description":"Take _id from PropertyCategory"
          },
          "state": { 
            "type": "string",
            "description":"Take _id from State"
          },
          "city": { 
            "type": "string",
            "description":"Take _id from City"
          },
          "amenities": { 
            "type": "array",
            "schema": {
              name: '_id from Amenity',
            }
          },
          "rooms": { 
            "type": "array",
            "schema": {
              room_id: '_id from Room',
              total:100,
            }
          },
          "furnishes": { 
            "type": "array",
            "schema": {
              furnish_id: '_id from Furnish',
              total:100
            }
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
  // #swagger.tags = ['Property']
  //  #swagger.parameters['page_size'] = {in: 'query',type:'number'}
  //  #swagger.parameters['page'] = {in: 'query',type:'number'}
  //  #swagger.parameters['author_id'] = {in: 'query',type:'string'}
  //  #swagger.parameters['title'] = {in: 'query',type:'string'}
  //  #swagger.parameters['type'] = {in: 'query',enum:["Appartment","Villa","IndividualHouse"]}
  //  #swagger.parameters['status'] = {in: 'query',enum:["Rented","Vacant"]}
  //  #swagger.parameters['face'] = {in: 'query',enum:["East", "West", "South","North"]}
  //  #swagger.parameters['property_category_id'] = {in: 'query',type:'string'}
  //  #swagger.parameters['state_id'] = {in: 'query',type:'string',description:'_id off State'}
  //  #swagger.parameters['city_id'] = {in: 'query',type:'string',description:'_id off City'}
  //  #swagger.parameters['amenities_id'] = {in: 'query',type:'array',description:'_id off Amenity'}
  //  #swagger.parameters['rooms_id'] = {in: 'query',type:'array',description:'_id off Room'}
  //  #swagger.parameters['furnishes_id'] = {in: 'query',type:'array',description:'_id off Furnishes'}
  
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
      if(req.query.author_id){  query['author_id'] = {$eq:req.query.author_id} }
      if(req.query.title){  query['title'] = {$eq:req.query.title} }
      if(req.query.type){  query['type'] = {$eq:req.query.type} }
      if(req.query.status){  query['status'] = {$eq:req.query.status} }
      if(req.query.face){  query['face'] = {$eq:req.query.face} }
      if(req.query.property_category_id){  query['property_category_id'] = {$eq:req.query.property_category_id} }
      if(req.query.state_id){  query['state'] = {$eq:req.query.state_id} }
      if(req.query.city_id){  query['city'] = {$eq:req.query.city_id} }
      if(req.query.amenities_id){  query['amenities'] = {$in:req.query.amenities_id} }
      if(req.query.rooms_id){  query['rooms'] = {$in:req.query.rooms_id} }
      if(req.query.furnishes_id){  query['furnishes'] = {$in:req.query.furnishes_id} }

      const noOfRecord = await ThisModel.find(query).countDocuments();
      const record     = await ThisModel.find(query).lean().sort({ createdAt: -1 }).skip(skip).limit(pageSize)
      let records = {noOfRecord:noOfRecord,results:record}
      return await Helper.SuccessValidation(req,res,records)
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const view = async (req, res) => {
  // #swagger.tags = ['Property']
  try{
    let records = await ThisModel.findOne({_id:req.params.id})
    .populate({path:"property_category",strictPopulate:false,model:"PropertyCategory"})
    .populate({path:"state",strictPopulate:false,model:"State"})
    .populate({path:"city",strictPopulate:false,model:"City"})
    .populate({path:"amenities",strictPopulate:false,model:"Amenity"})
    .populate({
      path:"rooms",
      populate: [
        {path:"room_id",strictPopulate:false,model:"Room"},
        {path:"furnish_id",strictPopulate:false,model:"Furnish"}
      ]
    })
    return await Helper.SuccessValidation(req,res,records)
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const update = async (req, res) => {
  // #swagger.tags = ['Property']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "properties": { 
          "author_id": { 
            "type": "string",
            "description":"Take _id from authors landlords role"
          },
          "title": { 
            "type": "string",
          },
          "description": { 
            "type": "string",
          },
          "icon": { 
            "type": "object",
            "description":"S3 Bucket object"
          },
          "type": { 
            "type": "string",
            "enum": ["Appartment","Villa","IndividualHouse"],
            "default":"Appartment"
          },
          "status": { 
            "type": "string",
            "enum": ["Rented","Vacant"],
            "default":"Rented"
          },
          "pincode": { 
            "type": "number",
          },
          "address": { 
            "type": "string",
          },
          "flat_no": { 
            "type": "number",
          },
          "tax_number": { 
            "type": "number",
          },
          "total_floors": { 
            "type": "number",
          },
          "floor_of_property": { 
            "type": "number",
          },
          "age_of_property": { 
            "type": "number",
          },
          "face": { 
            "type": "string",
            "enum": ["East", "West", "South","North"],
            "default":"East"
          },
          "property_category": { 
            "type": "string",
            "description":"Take _id from PropertyCategory"
          },
          "state": { 
            "type": "string",
            "description":"Take _id from State"
          },
          "city": { 
            "type": "string",
            "description":"Take _id from City"
          },
          "amenities": { 
            "type": "array",
            "schema": {
              name: '_id from Amenity',
            }
          },
          "rooms": { 
            "type": "array",
            "schema": {
              room_id: '_id from Room',
              total:100,
            }
          },
          "furnishes": { 
            "type": "array",
            "schema": {
              furnish_id: '_id from Furnish',
              total:100
            }
          }
        } 
      } 
    }
  */
  try{
    let CheckRecord = await ThisModel.findOne({_id:req.params.id});
    if(CheckRecord){
      let BodyParams = await req.body
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
  // #swagger.tags = ['Property']
  try{
    let record = await ThisModel.findByIdAndDelete({_id:req.params.id})
    return await Helper.SuccessValidation(req,res,record)
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const roomremove = async (req, res) => {
  // #swagger.tags = ['Property']
  //  #swagger.parameters['property_id'] = {in: 'query',type:'string'}
  try{
    let record = await ThisModel.findOne({_id:req.query.property_id})
    record.rooms.pull({_id:req.params.id})
    record.save()
    return await Helper.SuccessValidation(req,res,record)
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const furnishesremove = async (req, res) => {
  // #swagger.tags = ['Property']
  //  #swagger.parameters['property_id'] = {in: 'query',type:'string'}
  try{
    let record = await ThisModel.findOne({_id:req.query.property_id})
    record.furnishes.pull({_id:req.params.id})
    record.save()
    return await Helper.SuccessValidation(req,res,record)
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const bulkremove = async (req, res) => {
  // #swagger.tags = ['Property']
  //  #swagger.parameters['ids'] = { description: 'Enter multiple ids',type: 'array',required: true,}
  try{
    let record = await ThisModel.deleteMany({_id:req.params.ids})
    return await Helper.SuccessValidation(req,res,record)
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

module.exports = {create,list, view, update, remove, bulkremove,roomremove, furnishesremove};