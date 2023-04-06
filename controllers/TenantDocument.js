const mongoos             =      require("mongoose");
const jwt                 =      require('jsonwebtoken');
const bcrypt              =      require("bcrypt");
const ThisModel           =      mongoos.model('TenantDocument');
const LandlordPackageModel=      mongoos.model('LandlordPackage');
const LanlordTenantModel  =      mongoos.model('LanlordTenant');
const DocumentTypeModel   =      mongoos.model('DocumentType');
const Helper              =      require("../middleware/helper");
const Services            =      require("../services");
const axios               =      require("axios");

const create = async (req, res) => {
  // #swagger.tags = ['TenantDocument']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["tenant_id","document_type_id","number"], 
        "properties": { 
          "tenant_id": { 
            "type": "string",
            "description":"_id off Author (Role tenant)"
          },
          "document_type_id": { 
            "type": "string",
            "description":"_id off DocumentType"
          },
          "number": {
            "type": "number",
          },
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
  // #swagger.tags = ['TenantDocument']
  try{
      let query={}
      // query['tenant_id']        = {$eq:req.user._id}
      // const Landlord            = await LanlordTenantModel.findOne(query)
      // let packquery={}
      // packquery['landlord_id']  = {$eq:Landlord.lanlord_id}
      // const landlord     = await LandlordPackageModel.findOne(packquery)
      const noOfRecord = await DocumentTypeModel.find(query).countDocuments();
      const record     = await DocumentTypeModel.find(query).lean().sort({ createdAt: -1 })
      let Docs = []
      let CurrentDate = await Helper.CurrentDate()
      for(let i = 0; i < record.length; i++){
        let srh_query = {}
        srh_query['document_type_id'] = {$eq:record[i]._id}
        srh_query['tenant_id'] = {$eq:req.user._id}
        srh_query['is_verified'] = {$eq:true}
        srh_query['expairy_date'] = {$lte:CurrentDate}
        is_verified = await ThisModel.findOne(srh_query)
        record[i]['is_verified']  = (is_verified)?true:false
        record[i]['verification'] = is_verified
        Docs.push(record[i])
      }
      let records = {noOfRecord:noOfRecord,results:record}
      return await Helper.SuccessValidation(req,res,records)
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const view = async (req, res) => {
  // #swagger.tags = ['TenantDocument']
  try{
    let records = await DocumentTypeModel.findOne({_id:req.params.id})
    if(records){
      let CurrentDate = await Helper.CurrentDate()
      let srh_query = {}
      srh_query['document_type_id'] = {$eq:records._id}
      srh_query['tenant_id'] = {$eq:req.user._id}
      srh_query['is_verified'] = {$eq:true}
      srh_query['expairy_date'] = {$lte:CurrentDate}
      is_verified = await ThisModel.findOne(srh_query)
      records['is_verified']  = (is_verified)?true:false
      records['verification'] = is_verified
    }
    return await Helper.SuccessValidation(req,res,records)
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const Verify = async (req, resp) => {
  //  #swagger.tags = ['TenantDocument']
  //  #swagger.parameters['type'] = {in: 'query',required:true,enum: ["adhar", "pan", "driving_licence","voter_id","passport","electricity","court_case","epfo_uan"]}
  //  #swagger.parameters['dob'] = {in: 'query',description:"driving_licence  [Required],passport [Required DD/MM/YYYY FORMAT ONLY ]",required:false}
  //  #swagger.parameters['number'] = {in: 'query',description:"epfo_uan(Enter UanNumber), passport(Enter FileNumber), adhar(Enter AdharNumber), pan(Enter PanNumber), court_case(Deafault Value As caseList), driving_licence(EnetrLicense Number), voter_id(Enter Voterid Number)",required:true}
  //  #swagger.parameters['state'] = {in: 'query',description:"passport [Required]",required:false}
  //  #swagger.parameters['electricityProvider'] = {in: 'query',description:"Electricity  [Required]",required:false}
  //  #swagger.parameters['installationNumber'] = {in: 'query',description:"Electricity [Required] (For West Bengal (WBSEDCL) Only",required:false}
  //  #swagger.parameters['MobileNumber'] = {in: 'query',description:"Electricity [Required] (ForKerala (KSEB)) Only",required:false}
  //  #swagger.parameters['password'] = {in: 'query',description:"Epfo Uan [Required]",required:false}
  //  #swagger.parameters['address'] = {in: 'query',description:"court_case [OPTIONAL]"}
  //  #swagger.parameters['fatherName'] = {in: 'query',description:"court_case  [OPTIONAL]"}
  //  #swagger.parameters['state'] = {in: 'query',description:"court_case [OPTIONAL]"}
  //  #swagger.parameters['caseFor'] = {in: 'query',description:"court_case  [Required]",enum:["individual","entity"],required:false}
  //  #swagger.parameters['caseFilter'] = {in: 'query',description:"court_case  [OPTIONAL]",enum:["ipap","women safety","pmla","police","motor"]}
  //  #swagger.parameters['caseCategory'] = {in: 'query',description:"court_case  [OPTIONAL]",enum:["criminal","civil"]}
  //  #swagger.parameters['caseType'] = {in: 'query',description:"court_case [OPTIONAL]",enum:["petitioner","respondant"]}
  //  #swagger.parameters['caseYear'] = {in: 'query',description:"court_case [OPTIONAL YYYY-YYYY  FORMAT ONLY ]"}
  try{
      let CurrentDate = await Helper.CurrentDate()
      let id_number = req.query.number
      let id_name   = req.query.type
      let DocTypeId = await DocumentTypeModel.findOne({type:id_name})
      let srh_query = {}
      srh_query['document_type_id'] = {$eq:DocTypeId._id}
      srh_query['tenant_id'] = {$eq:req.user._id}
      srh_query['number'] = {$eq:id_number}
      srh_query['expairy_date'] = {$lte:CurrentDate}
      let noOfRecord  = await ThisModel.findOne(srh_query)
      let AlreadyVerified = 0
      if(!noOfRecord){
        noOfRecord    = await ThisModel.create({document_type_id:DocTypeId._id,tenant_id:req.user._id,number:id_number})
      }else{
        if(noOfRecord.is_verified ==true){
          AlreadyVerified = 1
        }
      }
      if(AlreadyVerified == 0){
          let Signzy_Api_Url  = await Helper.Signzy_Api_Url()
          let Signzy_Api_Uname_Pwd  = await Helper.Signzy_Api_Uname_Pwd()
          return await axios.post(`https://${Signzy_Api_Url}/api/v2/patrons/login`,{"username":""+Signzy_Api_Uname_Pwd.username+"","password":""+Signzy_Api_Uname_Pwd.password+""}).then(async (res) => {
          if(res.status == 200) {
              let respData = null
              if (id_name == "pan") {
                respData = await Services.panCardDetails(id_number, res.data.userId, res.data.id)
              }else if (id_name == "voter_id") {
                respData = await Services.voterIdDetails(id_number,req.query.state, res.data.userId, res.data.id)
              }else if (id_name == "driving_licence") {
                respData = await Services.drivingLicense(id_number,req.query.dob,res.data.userId, res.data.id)
              }else if (id_name == "passport") {
                respData = await Services.passportVerification(id_number,req.query.dob,res.data.userId, res.data.id)
              }else if (id_name == "electricity") {
                respData = await Services.electricityVerification(id_number,req.query.electricityProvider,res.data.userId, res.data.id)
              }else if (id_name == "court_case") {
                respData = await Services.courtVerification(req.user.first_name,req.query,res.data.userId,res.data.id)
              }else if (id_name == "epfo_uan") {
                respData = await Services.epfoUanVerification(id_number,req.query.password,res.data.userId,res.data.id)
              }else{
                respData = await Services.adharCardDetails(id_number,res.data.userId, res.data.id)
              }
              console.log(respData)
              if(respData.status == 200){
                let name = null
                if(id_name == "court_case"){
                  name = respData['result']['cases'][0]['name']
                }else{
                  if(id_name == "passport"){
                    name = respData['response']['result']['name']
                  }else if(id_name == "driving_licence"){
                    name = respData['response']['result']['detailsOfDrivingLicence']['name']
                  }else{
                    name = respData['result']['name']
                  }
                }
                let matchName = await Services.adharCardDetails(req.user.first_name,name)
                let ExpairyDate = await Helper.ExpairyDate(CurrentDate)
                await ThisModel.updateOne({_id:noOfRecord._id},{$set:{name_match_ratio:matchName,is_verified:true,expairy_date:ExpairyDate,verification_response:respData.final_response}})
                return await Helper.SuccessValidation(req,resp,respData.final_response)
              }else{
                await ThisModel.updateOne({_id:noOfRecord._id},{ $set:{verification_response:respData.final_response}})
                return await Helper.ErrorValidation(req,resp,respData.final_response)
              }
          }else{
            return await Helper.ErrorValidation(req,resp,respData.final_response)
          }
        }).catch(async(err) => {
          return await Helper.ErrorValidation(req,resp,err,'cache')
        })
      }else{
        let err = {message:"Already verified"}
        return await Helper.ErrorValidation(req,resp,err,'cache',)
      }
  } catch (err) {
    return await Helper.ErrorValidation(req,resp,err,'cache')
  }
}

const update = async (req, res) => {
    // #swagger.tags = ['TenantDocument']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "properties": { 
          "tenant_id": { 
            "type": "string",
            "description":"_id off Author (Role tenant)"
          },
          "document_type_id": { 
            "type": "string",
            "description":"_id off DocumentType"
          },
          "number": {
            "type": "number",
          },
          "is_verified": { 
            "type": "boolean",
            "default":false
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
  // #swagger.tags = ['TenantDocument']
  try{
    let record = await ThisModel.findByIdAndDelete({_id:req.params.id})
    return await Helper.SuccessValidation(req,res,record)
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const bulkremove = async (req, res) => {
  // #swagger.tags = ['TenantDocument']
  //  #swagger.parameters['ids'] = { description: 'Enter multiple ids',type: 'array',required: true,}
  try{
    let record = await ThisModel.deleteMany({_id:req.params.ids})
    return await Helper.SuccessValidation(req,res,record)
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

module.exports = {create,list, view, update, remove, bulkremove, Verify};