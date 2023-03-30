const mongoos           =      require("mongoose");
const jwt               =      require('jsonwebtoken');
const randtoken         =      require('rand-token');
const bcrypt            =      require("bcrypt");
const ThisModel         =      mongoos.model('Author');
const LanlordTenantModel=      mongoos.model('LanlordTenant');
const Helper            =      require("../middleware/helper");
const axios             =      require("axios");
const Services          =      require("../services");
let request             =      require('request');
        

const create = async (req, res) => {
  // #swagger.tags = ['Author']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["phonenumber","role","first_name"], 
        "properties": { 
          "first_name": { 
            "type": "string",
          },
          "last_name": { 
            "type": "string",
          },
          "image": { 
            "type": "object",
            "description":"S3 bucket object"
          },
          "email": { 
            "type": "string",
          },
          "phonenumber": { 
            "type": "string",
          },
          "password": { 
            "type": "string",
          },
          "dob": { 
            "type": "string",
            "description":"Accepts YY-MM-DD Formats Only"
          },
          "gender": { 
            "type": "string",
            "default":"Male",
            "enum":["Male","Female","Other"],
          },
          "role": { 
            "type": "string",
            "default":"Landlord",
            "enum":["Landlord","Tenant","Rwa"],
          }
        } 
      } 
    }
  */
  CreateModel = ThisModel()
  for (const [key, value] of Object.entries(req.body)) {
    CreateModel[key]=value
  }
  if(!CreateModel.password){
    CreateModel['password'] = await Helper.Otp()
  }
  // const opts = { runValidators: false , upsert: true };
  try{
    return await CreateModel.save( async (err,doc) => {
        if(!err){
          // let text = 'Email: '+CreateModel.email+' and password: '+CreateModel.password+' are your login credentials.'
          // let subject = "Account created successfully"
          // let transporter = await Helper.SentMail(CreateModel.email,subject,text)
          if(CreateModel.role == 'Tenant'){
            let CreateLanlordTenantModel = LanlordTenantModel()
            CreateLanlordTenantModel['tenant_id'] = doc._id
            CreateLanlordTenantModel['lanlord_id'] = req.user._id
            CreateLanlordTenantModel.save()
          }
          await Helper.SuccessValidation(req,res,doc,'Added successfully')
        }else{
          await Helper.ErrorValidation(req,res,err,null)
        }
    })
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const generateotp = async (req, res) => {
  // #swagger.tags = ['Author']
  try{
    query = {}
    query['phonenumber'] = {$eq:req.params.phonenumber}
    let noOfRecord = await ThisModel.findOne(query);
    if(noOfRecord){
      if(noOfRecord.is_phone_verified){
        return await Helper.ErrorValidation(req,res,"Already verified",'cache')
      }else{
        let Signzy_Api_Url        = await Helper.Signzy_Api_Url()
        let Signzy_Api_Uname_Pwd  = await Helper.Signzy_Api_Uname_Pwd()
        return await axios.post(`https://${Signzy_Api_Url}/api/v2/patrons/login`,{"username":""+Signzy_Api_Uname_Pwd.username+"","password":""+Signzy_Api_Uname_Pwd.password+""}).then(async (signresp) => {
        // console.log(signresp)
        if(signresp.status == 200) {
            let respData = await Services.phoneNumberGenerateOtp(req.params.phonenumber,signresp.data.userId,signresp.data.id)
            if(respData.status == 200) {
              return await Helper.SuccessValidation(req,res,respData.final_response.result)
            }else{
              return await Helper.ErrorValidation(req,res,respData.final_response,'cache')
            }
          }else{
            return await Helper.ErrorValidation(req,res,res.data,'cache')
          }
        }).catch(async (err) => {
          return await Helper.ErrorValidation(req,res,err,'cache')
        })
      }
    }else{
      return await Helper.ErrorValidation(req,res,"Invalid Mobilenumber",'cache')
    }
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const submitOtp = async (req, res) => {
  // #swagger.tags = ['Author']
  try{
    let Signzy_Api_Url  = await Helper.Signzy_Api_Url()
    return await axios.post(`https://${Signzy_Api_Url}/api/v2/patrons/login`, { "username": "score10_prod", "password": "2J5VGkGHS12AAWPXxngl" }).then(async (resp) => {
      if(resp.status == 200){
        let respData = await Services.phoneNumberVerification(req.params.otp,req.params.phonenumber,req.params.referenceId,resp.data.userId,resp.data.id)
        if(respData.status == 200){
          await ThisModel.updateOne({phonenumber:req.params.phonenumber},{$set:{is_phone_verified:true,phone_verification:respData.final_response}})
          return await Helper.SuccessValidation(req,res,respData.final_response)
        }else{
          return await Helper.ErrorValidation(req,res,respData.final_response,'cache')
        }
      }else{
        return await Helper.ErrorValidation(req,res,res.data,'cache')
      }
    }).catch(async (err) => {
      return await Helper.ErrorValidation(req,res,err,'cache')
    })
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const list = async (req, res) => {
  // #swagger.tags = ['Author']
  //  #swagger.parameters['page_size'] = {in: 'query',type:'number'}
  //  #swagger.parameters['page'] = {in: 'query',type:'number'}
  //  #swagger.parameters['keyword'] = {in: 'query',type:'string'}
  //  #swagger.parameters['role'] = { enum: ["Landlord","Tenant","Rwa"]}

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
      if(req.query.keyword){
          query["role"] =  {
            $or:[
              {first_name: {$regex: req.query.keyword}},
              {last_name: {$regex: req.query.keyword}},
              {email: {$regex: req.query.email}},
              {phonenumber: {$regex: req.query.phonenumber}}
            ]
          }
      }
      const noOfRecord = await ThisModel.find(query).countDocuments();
      const record     = await ThisModel.find(query).lean().sort({ createdAt: -1 }).skip(skip).limit(pageSize)
      let records = {noOfRecord:noOfRecord,results:record}
      return await Helper.SuccessValidation(req,res,records)
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const view = async (req, res) => {
  // #swagger.tags = ['Author']
  try{
    let records = await ThisModel.findOne({_id:req.params.id});
    return await Helper.SuccessValidation(req,res,records)
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const update = async (req, res) => {
  // #swagger.tags = ['Author']
  /*
    #swagger.parameters['data'] = {
      in: 'body', 
      '@schema': { 
       "properties": { 
          "first_name": { 
            "type": "string",
          },
          "last_name": { 
            "type": "string",
          },
          "image": { 
            "type": "object",
            "description":"S3 bucket object"
          },
          "email": { 
            "type": "string",
          },
          "phonenumber": { 
            "type": "string",
          },
          "password": { 
            "type": "string",
          },
          "dob": { 
            "type": "string",
            "description":"Accepts YY-MM-DD Formats Only"
          },
          "gender": { 
            "type": "string",
            "default":"Male",
            "enum":["Male","Female","Other"],
          },
          "role": { 
            "type": "string",
            "default":"Landlord",
            "enum":["Landlord","Tenant","Rwa"],
          }
        }
      } 
    }
  */
  try{
    let CheckRecord = await ThisModel.findOne({_id:req.params.id});
    if(CheckRecord){
      let BodyParams = await req.body
      if(BodyParams.password){
        const salt = await bcrypt.genSaltSync(10);
        BodyParams['password'] = bcrypt.hashSync(BodyParams.password, salt);
      }
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
  // #swagger.tags = ['Author']
  try{
    let record = await ThisModel.findByIdAndDelete({_id:req.params.id})
    return await Helper.SuccessValidation(req,res,record)
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const bulkremove = async (req, res) => {
  // #swagger.tags = ['Author']
  //  #swagger.parameters['ids'] = { description: 'Enter multiple ids',type: 'array',required: true,}
  try{
    let record = await ThisModel.deleteMany({_id:req.params.ids})
    return await Helper.SuccessValidation(req,res,record)
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const login = async (req, res) => {
  // #swagger.parameters['role'] = {enum:["Landlord","Tenant","Rwa"],default:"Landlord"}
  // #swagger.parameters['is_with_otp'] = {type:"boolean",default:0}
  // #swagger.tags = ['Author']
  /*
    #swagger.parameters['data'] = {
      in: 'body', 
      '@schema': { 
        "required": ["phonenumber"], 
        "properties": { 
          "phonenumber": { 
            "type": "number",
          },
          "password": { 
            "type": "string",
          }
        } 
      } 
    }
  */
  try{
    let records = await ThisModel.findOne({phonenumber:req.body.phonenumber,role:req.query.role});
    if(records){
      if(req.query.is_with_otp == false || req.query.is_with_otp == "false"){
        let PwdStatus = true
        if(req.body.password && req.body.password!=null){
          PwdStatus = await bcrypt.compare(req.body.password, records.password);
        }
        if(PwdStatus){
          return jwt.sign({user:records}, 'abcdefg', {expiresIn:'10d'}, async (err,token) => {
            if(!err){
              let refreshToken = randtoken.generate(256)+records.id
              await ThisModel.updateOne({_id:records.id},{ $set:{refreshToken:refreshToken}})
              records = {results:records,Token:token,refreshToken:refreshToken}
              await Helper.SuccessValidation(req,res,records)
            }else{
              return await Helper.ErrorValidation(req,res,err,'cache')
            }
          });
        }else{
          return await Helper.ErrorValidation(req,res,{message:"Invalid password"},'cache')
        }
      }else{
        let otp = await Helper.Otp()
        let Sms_Otp_Details = await Helper.Sms_Otp_Details()
        let msg = `Dear User, Your OTP to login to SCORE10 App is ${otp}. Valid for 30 Mins Regards Beatroot Team`
        var options = {
          'method': 'GET',
          'url': "https://smslogin.co/v3/api.php?username="+Sms_Otp_Details.username+"&apikey="+Sms_Otp_Details.apikey+"&senderid="+Sms_Otp_Details.senderid+"&mobile="+req.body.phonenumber+"&message="+msg,
        };
        await request(options)
        await ThisModel.updateOne({_id:records.id},{ $set:{otp:otp}})
        await Helper.SuccessValidation(req,res,records,"Please login with otp")
      }
    }else{
      return await Helper.ErrorValidation(req,res,{message:"Invalid credentials"},'cache')
    }
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const loginwithotp = async (req, res) => {
  // #swagger.parameters['role'] = {enum:["Landlord","Tenant","Rwa"],default:"Landlord"}
  // #swagger.parameters['otp'] = {type:"number"}
  // #swagger.tags = ['Author']
  /*
    #swagger.parameters['data'] = {
      in: 'body', 
      '@schema': { 
        "required": ["phonenumber"], 
        "properties": { 
          "phonenumber": { 
            "type": "number",
          }
        } 
      } 
    }
  */
  try{
    let records = await ThisModel.findOne({phonenumber:req.body.phonenumber,role:req.query.role,otp:req.query.otp});
    if(records){
      return jwt.sign({user:records}, 'abcdefg', {expiresIn:'10d'}, async (err,token) => {
        if(!err){
          let refreshToken = randtoken.generate(256)+records.id
          await ThisModel.updateOne({_id:records.id},{ $set:{refreshToken:refreshToken}})
          records = {results:records,Token:token,refreshToken:refreshToken}
          await Helper.SuccessValidation(req,res,records)
        }else{
          return await Helper.ErrorValidation(req,res,err,'cache')
        }
      });
    }else{
      return await Helper.ErrorValidation(req,res,{message:"Invalid otp or phonenumber"},'cache')
    }
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const changePassword = async (req, res) => {
  // #swagger.tags = ['Author']
  /*
    #swagger.parameters['data'] = {
      in: 'body', 
      '@schema': { 
        "required": ["old_password","new_password","confirm_new_password"], 
        "properties": { 
          "old_password": { 
            "type": "string",
          },
          "new_password": { 
            "type": "string",
          },
          "confirm_new_password": { 
            "type": "string",
          },
        } 
      } 
    }
  */
  try{
    if(req.body.confirm_new_password == req.body.new_password){
      let records = await ThisModel.findById(req.user._id);
      if(records){
        let PwdStatus = await bcrypt.compare(req.body.old_password, records.password);
        if(PwdStatus){
          const salt = await bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(req.body.new_password, salt);
          let updatestatus = await ThisModel.updateOne({_id:req.user._id},{ $set:{password:hash}})
          if(updatestatus){
            CheckRecord = await ThisModel.findOne({_id:req.user._id});
            return await Helper.SuccessValidation(req,res,CheckRecord)
          }else{
            return await Helper.ErrorValidation(req,res,updatestatus,'cache')
          }
        }else{
          return await Helper.ErrorValidation(req,res,{message:"Invalid old password"},'cache')
        }
      }else{
        return await Helper.ErrorValidation(req,res,{message:"Invalid authentication"},'cache')
      }
    }else{
      return await Helper.ErrorValidation(req,res,{message:"New and confirmed passwords are not the same"},'cache')
    }
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const refreshToken = async (req, res) => {
  // #swagger.tags = ['Author']
  try{
    let records = await ThisModel.findOne({refreshToken:req.params.refreshToken});
    if(records){
      return jwt.sign({user:records}, 'abcdefg', {expiresIn:'10d'}, async (err,token) => {
        if(!err){
          records = {results:records,Token:token}
          await Helper.SuccessValidation(req,res,records)
        }else{
          return await Helper.ErrorValidation(req,res,err,'cache')
        }
      });
    }else{
      return await Helper.ErrorValidation(req,res,"Invalid refreshToken",'cache')
    }
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}


const resetpassword = async (req, res) => {
  // #swagger.tags = ['Author']
  /*
    #swagger.parameters['data'] = {
      in: 'body', 
      '@schema': { 
        "required": ["password"], 
        "properties": { 
          "password": { 
            "type": "string",
          }
        } 
      } 
    }
  */
  try{
    let records = await ThisModel.findOne({_id:req.params.id,resetPawordToken:resetPawordToken});
    if(records){
      const salt = await bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      let updatestatus = await ThisModel.updateOne({_id:req.params.id},{ $set:{resetPawordToken:null,password:hash}})
      if(updatestatus){
        CheckRecord = await ThisModel.findOne({_id:req.params.id});
        return await Helper.SuccessValidation(req,res,CheckRecord)
      }else{
        return await Helper.ErrorValidation(req,res,updatestatus,'cache')
      }
    }else{
      return await Helper.ErrorValidation(req,res,{message:"Invalid resetPawordToken"},'cache')
    }
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const forgotpassword = async (req, res) => {
  // #swagger.tags = ['Author']
  try{
    let records = await ThisModel.findOne({email:req.params.email});
    if(records){
      let resetPawordToken = await Helper.GetUuid(2)
      let pwd = await Helper.Otp()
      let text = 'Your new password is '+pwd
      let subject = 'Your new forgotten password has been generated. '
      let transporter = await Helper.SentMail(req.params.email,subject,text)
      return await Helper.SuccessValidation(req,res,records,'Password token link send to you mail check once')
    }else{
      return await Helper.ErrorValidation(req,res,{message:"Invalid email"},'cache')
    }
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

module.exports = {create,list, view, update, remove, bulkremove, login, resetpassword, forgotpassword, refreshToken, changePassword, loginwithotp, submitOtp, generateotp};