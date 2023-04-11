const axios           =   require("axios");
const Helper          =   require("../middleware/helper");
const request         =   require('request');

const adharCardDetails = async (id_number, userId, id) => {
  let Signzy_Api_Url  = await Helper.Signzy_Api_Url()
  var data = JSON.stringify({"task":"getEadhaar", essentials: {"requestId":id_number}});
  var config = {
    method: 'post',
    url: `https://${Signzy_Api_Url}/api/v2/patrons/${userId}/digilockers`,
    headers: {
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.8',
      'Authorization': id,
      'content-type': 'application/json'
    },
    data: data
  };
  // console.log(config)
  return axios(config).then(function (response) {
      if (response.status === 200) {
        return { status: 200, final_response: response.data };
      }else{
        return { status: 400, final_response: responses.data };
      }
  }).catch(function (error) {
    try{
      var error = error.response.data.error
    } catch (err){
      var error = error
    }
    return { status: 400, final_response:error};
  });
}

const panCardDetails = async (id_number, userId, id) => {
  let Signzy_Api_Url  = await Helper.Signzy_Api_Url()
  var data = JSON.stringify({
    "task": [
      "1"
    ],
    "essentials": {
      "number": id_number
    }
  });
  var config = {
    method: 'post',
    url: `https://${Signzy_Api_Url}/api/v2/patrons/${userId}/panv2`,
    headers: {
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.8',
      'Authorization': id,
      'content-type': 'application/json'
    },
    data: data
  };
  // console.log(config)
  return await axios(config).then(function (response) {
      if (response.status === 200) {
        return { status: 200, final_response: response.data };
      }else{
        return { status: 400, final_response: responses.data };
      }
  }).catch(function (error) {
    try{
      var error = error.response.data.error
    } catch (err){
      var error = error
    }
    return { status: 400, final_response:error};
  });
}

const voterIdDetails = async (id_number,state, userId, id) => {
  let Signzy_Api_Url  = await Helper.Signzy_Api_Url()
  let data = JSON.stringify({
    "task": "epicNumberSearch", 
    "essentials": {
      "epicNumber": id_number,
      "state":state
    }
  });
  let config = {
    method: 'post',
    url: `https://${Signzy_Api_Url}/api/v2/patrons/${userId}/voterIdV2`,
    headers: {
      'Authorization': id,
      'Content-Type': 'application/json',
    },
    data: data
  };
  // console.log(config)
  return await axios(config).then(async function (response){
      if (response.status === 200) {
        return { status: 200, final_response: response.data };
      }else{
        return { status: 400, final_response: responses.data };
      }
  }).catch(async function (error) {
    try{
      var error = await error.response.data.error
    } catch (err){
      var error = await error
    }
    return { status: 400, final_response:error};
  });
}

const drivingLicense = async (id_number,dob,userId,id) => {
  let Signzy_Api_Url  = await Helper.Signzy_Api_Url()
  var data = JSON.stringify({
    "type": "drivingLicence",
    "email": "ankur.rand@signzy.com",
    "callbackUrl": "https://www.w3schools.com",
    "images": []
  });
  var config = {
    method: 'post',
    url: `https://${Signzy_Api_Url}/api/v2/patrons/${userId}/identities`,
    headers: {
      'Authorization': id,
      'Content-Type': 'application/json',
    },
    data: data
  };
  return await axios(config)
    .then(function (response) {
      if (response.status === 200) {
        var data = JSON.stringify({
          "service": "Identity", 
          "itemId": response.data.id, 
          "accessToken": response.data.accessToken, 
          "task": "fetch", 
          "essentials": {
            "number": id_number,
            "dob":dob
          } 
        });
        var config = {
          method: 'post',
          url: `https://${Signzy_Api_Url}/api/v2/snoops`,
          headers: {
            'Accept-Language': 'en-US,en;q=0.8',
            'content-type': 'application/json',
            Accept: '*/*',
            'Authorization': id
          },
          data: data
        };
        // console.log(config)
        return axios(config).then(function (responses){
            if(responses.status == 200) {
              return { status: 200, final_response: responses.data };
            }else{
              return { status: 400, final_response: responses.data };
            }
        }).catch(function (error){
          return { status: 400, final_response: error };
        });
      }
    }).catch(function (error) {
      try{
        var error = error.response.data.error
      } catch (err){
        var error = error
      }
      return { status: 400, final_response:error};
    });
}

const passportVerification = async (id_number,dob, userId, id) => {
  let Signzy_Api_Url  = await Helper.Signzy_Api_Url()
  var data = JSON.stringify({
    "type": "passport",
    "email": "ankur.rand@signzy.com",
    "callbackUrl": "https://www.w3schools.com",
    "images": []
  });
  var config = {
    method: 'post',
    url: `https://${Signzy_Api_Url}/api/v2/patrons/${userId}/identities`,
    headers: {
      'Authorization': id,
      'Content-Type': 'application/json',
    },
    data: data
  };
  return axios(config)
    .then(async function (response) {
      if (response.status === 200) {
        var data = {
          "service": "Identity", 
          "itemId": response.data.id, 
          "accessToken": response.data.accessToken, 
          "task": "fetch",
          "essentials": {
            fileNumber: id_number,
            fuzzy: "true",
            dob: dob,
          }
        };
        var config = {
          method: 'post',
          url: `https://${Signzy_Api_Url}/api/v2/snoops`,
          headers: {
            'Accept-Language': 'en-US,en;q=0.8',
            'content-type': 'application/json',
            Accept: '*/*',
            'Authorization': id
          },
          data: data
        };
        // console.log(config)
        return await axios(config).then(async function (responses) {
            if (responses.status == 200) {
              return { status: 200, final_response: responses.data };
            }else{
              return { status: 400, final_response: responses.data };
            }
        }).catch(function (error) {
          try{
            var error = error.response.data.error
          } catch (err){
            var error = error
          }
          return { status: 400, final_response: error };
        });
      }
    }).catch(function (error) {
      try{
        var error = error.response.data.error
      } catch (err){
        var error = error
      }
      return { status: 400, final_response:error};
    });
}

const electricityVerification = async (id_number,electricityProvider, userId, id) => {
  let Signzy_Api_Url  = await Helper.Signzy_Api_Url()
  var data = JSON.stringify({
    essentials: {
      consumerNo:id_number,
      electricityProvider:electricityProvider,
    }
  });
  var config = {
    method: 'POST',
    url:`https://${Signzy_Api_Url}/api/v2/patrons/${userId}/electricitybills`,
    headers: {
      'Accept-Language': 'en-US,en;q=0.8',
      'content-type': 'application/json',
      Accept: '*/*',
      'Authorization': id
    },
    data: data
  };
  // console.log(options)
  return axios(config).then(function (responses) {
      if (responses.status == 200) {
        return { status: 200, final_response: responses.data };
      }else{
        return { status: 400, final_response: responses.data };
      }
  }).catch(function (error) {
    try{
      var error = error.response.data.error
    } catch (err){
      var error = error
    }
    return { status: 400, final_response: error };
  });
}

const phoneNumberGenerateOtp = async (mobileNumber,userId,id) => {
  let Signzy_Api_Url  = await Helper.Signzy_Api_Url()
  var data = JSON.stringify({
    task: "mobile",
    essentials: {
      task:"generateOtp",
      countryCode:"91",
      mobileNumber:mobileNumber
    }
  });
  var options = {
    method: 'post',
    url: `https://${Signzy_Api_Url}/api/v2/patrons/${userId}/phones`,
    headers: {
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.8',
      'Authorization': id,
      'content-type': 'application/json'
    },
    data: data
  };
  // console.log(options)
  return axios(options).then(function (responses){
    if(responses.status == 200) {
      return { status: 200, final_response:responses.data };
    }else{
      return { status: 400, final_response:responses.data };
    }
  }).catch(function (error){
    try{
      var error = error.response.data.error
    } catch (err){
      var error = error
    }
    return { status: 400, final_response:error};
  });

}

const phoneNumberVerification = async (otp,mobileNumber,referenceId,userId,id) => {
  let Signzy_Api_Url  = await Helper.Signzy_Api_Url()
  var data = JSON.stringify({
    task: "mobile",
    essentials: {
      task:"submitOtp",
      countryCode:"91",
      mobileNumber:mobileNumber,
      referenceId:referenceId,
      otp:otp
    }
  });
  var options = {
    method: 'post',
    url: `https://${Signzy_Api_Url}/api/v2/patrons/${userId}/phones`,
    headers: {
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.8',
      'Authorization': id,
      'content-type': 'application/json'
    },
    data: data
  };
  // console.log(options)
  return axios(options).then(function (responses){
    if(responses.status == 200) {
      return { status: 200, final_response:responses.data };
    }else{
      return { status: 400, final_response:responses.data };
    }
  }).catch(function (error){
    try{
      var error = error.response.data.error
    } catch (err){
      var error = error
    }
    return { status: 400, final_response:error};
  });
}

const courtVerification = async (name,respdata,userId,id) => {
  let Signzy_Api_Url  = await Helper.Signzy_Api_Url()
  let essentials = {name: ''+name+'',type: ''+respdata.caseFor+''}
  if(respdata.address){essentials['address'] = respdata.address}
  if(respdata.fatherName){essentials['fatherName'] = respdata.fatherName}
  if(respdata.caseFilter){essentials['caseFilter'] = respdata.caseFilter}
  if(respdata.caseCategory){essentials['caseCategory'] = respdata.caseCategory}
  if(respdata.caseType){essentials['caseType'] = respdata.caseType}
  if(respdata.caseYear){essentials['caseYear'] = respdata.caseYear}
  var data = JSON.stringify({task: 'caseList',essentials: essentials});
  var options = {
    method: 'POST',
    url: `http://${Signzy_Api_Url}/api/v2/patrons/${userId}/courtcases`,
    headers: {
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.8',
      'Authorization': id,
      'content-type': 'application/json'
    },
    data: data
  };
  console.log(options)
  return axios(options).then(function (responses){
    if(responses.status == 200) {
      return { status: 200, final_response:responses.data };
    }else{
      return { status: 400, final_response:responses.data };
    }
  }).catch(function (error){
    console.log(error.response.data)
    try{
      var error = error.response.data.error
    } catch (err){
      var error = error
    }
    return { status: 400, final_response:error};
  });
}

const epfoUanVerification = async (uan,pwd,userId,id) => {
  let Signzy_Api_Url  = await Helper.Signzy_Api_Url()
  var data = JSON.stringify({
    task: 'uanDetailed',
    essentials:{
      uan:''+uan+'',
      password:''+pwd+''
    }
  });
  var options = {
    method: 'POST',
    url: `http://${Signzy_Api_Url}/api/v2/patrons/${userId}/epfos`,
    headers: {
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.8',
      'Authorization': id,
      'content-type': 'application/json'
    },
    data: data
  };
  console.log(options)
  return axios(options).then(function (responses){
    if(responses.status == 200) {
      return { status: 200, final_response:responses.data };
    }else{
      return { status: 400, final_response:responses.data };
    }
  }).catch(function (error){
    console.log(error.response.data)
    try{
      var error = error.response.data.error
    } catch (err1){
      try{
        var error = err1.response.data
      } catch (err2){
        try{
          var error = err2.response.statusText
        } catch (err3){
          var error = err3
        }
      }
    }
    return { status: 400, final_response:error};
  });
}

const nameMatch = async (name1,name2,userId,id) => {
  let Signzy_Api_Url  = await Helper.Signzy_Api_Url()
  var data = JSON.stringify({
    task: 'nameMatch',
    essentials:{
      nameBlock: {
        name1: name1, 
        name2: name2
      }
    }
  });
  var options = {
    method: 'POST',
    url: `http://${Signzy_Api_Url}/api/v2/patrons/${userId}/matchers`,
    headers: {
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.8',
      'Authorization': id,
      'content-type': 'application/json'
    },
    data: data
  };
  // console.log(options)
  return axios(options).then(function (responses){
    if(responses.status == 200) {
      return { status: 200, final_response:responses.data };
    }else{
      return { status: 400, final_response:responses.data };
    }
  }).catch(function (error){
    return { status: 400, final_response:error};
  });
}

module.exports = {
  drivingLicense,
  panCardDetails,
  passportVerification,
  voterIdDetails,
  phoneNumberGenerateOtp,
  phoneNumberVerification,
  adharCardDetails,
  electricityVerification,
  courtVerification,
  epfoUanVerification,
  nameMatch,
}