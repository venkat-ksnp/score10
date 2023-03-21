const { uuid }  = require('uuidv4');
const moment    = require('moment')
var nodemailer          =      require('nodemailer');

const SentMail = async (email,subject,text) => {
    let transporter = await nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'property0532@gmail.com',
          pass: 'bgiqkwayfjteqpsj'
        }
    });
    var mailOptions = {
        from: 'property0532@gmail.com',
        to: email,
        subject:subject,
        text:text
    };
    try{
        return await transporter.sendMail(mailOptions, async function(error, info){
            if (error) {
                console.log("Mail Eroor",error)
            }else{
                console.log("Mail Succ",info)
            }
        });
    } catch (err) {
        console.log("Mail Eroor",err)
    }
}

const UploadImage = async (image) => {
    try{
        var img = await GetUuid(1)
        var profile_pic = img + ".png";
        let profile_pic2 = "public/files/" + profile_pic;
        var fs = require("fs");
        var base64Data = image.replace(
        /^data:image\/\w+;base64,/,
        ""
        );
        require("fs").writeFile(
            imgpath,
            base64Data,
            "base64",
            function (err) {
                if(err) {
                    return null
                } else {
                    return imgpath
                }
            }
        );
    } catch (err) {
        return null
    }
}

const JsonImageConversion = async (bodydata) => {
    try{
        var image = await bodydata.image
    } catch (err) {
        var image = null
    }
    if(image){
        try{
            let convetImg = await UploadImage(image,profile_pic2)
            if(convetImg){
                bodydata['image'] = convetImg
            }
        } catch (err) {
            console.log("No image",err)
        }
    }else{
        console.log("No image")
        bodydata = await bodydata
    }
    return bodydata
}

const SuccessValidation = async (req,res,doc,cont='') => {
    let code;
    switch (req.method) {
        case 'POST':
            code = 201
            break;
        case 'DELETE':
            code = 204
            break;
        case 'GET':
            code = 200
            break;
        case 'PUT':
            code = 200
            break;
        case 'PATCH':
            code = 200
            break;
        default:
            code = 200
    }
    return res.status(code).send(doc);
}

function USER_ID(req) {
    let user_id = null
    if(req.user){
        user_id = req.user._id
    }
    return user_id
}

const ErrorValidation = async (req,res,err,errtype) => {
    // console.log(errtype)
    if(errtype=='cache'){
        let msg = (err.message)?err.message:'Try again'
        return res.status(400).send({message:msg,error:err});
    }else{
        let message = null
        let errors  = []
        if(err.code && err.code==11000){
            if (err.keyPattern){
                for (const [key, value] of Object.entries(err.keyPattern)) {
                    errors.push(key)
                }
            }
            message = errors.join(", ")+' already existed'
        }else if(err.name && err.name=='ValidationError'){
            for (const [key, value] of Object.entries(err.errors)) {
                errors.push(value['message'])
            }
            message = errors.join(", ")
        }else{
            if(err.message){
                message = err.message
            }
        }
        return res.status(400).send({message:message,error:err});
    }
}

const CurrentDate = () => {
    return new Date();
}

const DT_Y_M_D = (now) => {
    var now = new Date(now);
    let date = require('date-and-time')
    let today = date.format(now, 'YYYY-MM-DD');
    return today
}

const TransactionId = async (RowId) => {
    let Id = await GetUuid(1)
    return Id
}

const GetUuid = async (id) => {
    let Id = await uuid()
    return Id
}

const BookingId = async (RowId,type='cr') => {
    let BookId = Otp()
    if(RowId){
        if(type=='cr'){
            BookId = RowId.rowid+1
        }else{
            BookId = RowId.rowid
        }
    }else{
        BookId = 1
    }
    return '0000'+BookId
}

const Otp = async () => {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return 1234
}

const RoundVal = (avg) => {
    return Math.round(avg)
}

const Roles = () => {
    return ["Superadmin","Admin","User"]
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

const RadiusCalculation = (FromlatLong,Tolatlong) => {
    try{
        let lat1 = FromlatLong.latitude
        let lat2 = Tolatlong.latitude
        let lon1 = FromlatLong.longitude
        let lon2 = Tolatlong.longitude
        var R = 6371; // Radius of the earth in kilometers
        var dLat = deg2rad(lat2 - lat1); // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in KM
        console.log(R,c,d)
        return (d>0)?d:0;
    } catch (err) {
        return 0
    }
}

const InbetweenDates = async (startDate, stopDate)=> {
    var dateArray = [];
    var currentDate = moment(startDate);
    var stopDate = moment(stopDate);
    while (currentDate <= stopDate) {
        dateArray.push(moment(currentDate).format('YYYY-MM-DD') )
        currentDate = moment(currentDate).add(1, 'days');
    }
    console.log(dateArray)
    return dateArray;
}

const helper = {};

helper.SuccessValidation    =   SuccessValidation
helper.ErrorValidation      =   ErrorValidation
helper.USER_ID              =   USER_ID
helper.RoundVal             =   RoundVal
helper.DT_Y_M_D             =   DT_Y_M_D
helper.CurrentDate          =   CurrentDate
helper.Otp                  =   Otp
helper.Roles                =   Roles
helper.JsonImageConversion  =   JsonImageConversion
helper.RadiusCalculation    =   RadiusCalculation
helper.InbetweenDates       =   InbetweenDates
helper.BookingId            =   BookingId
helper.TransactionId        =   TransactionId
helper.GetUuid              =   GetUuid
helper.SentMail             =   SentMail

module.exports = helper;