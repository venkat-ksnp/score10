const axios = require("axios");

const panCardDetails = (id_number, userId, id) => {
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
    url: `https://signzy.tech/api/v2/patrons/${userId}/panv2`,
    headers: {
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.8',
      'Authorization': id,
      'content-type': 'application/json'
    },
    data: data
  };
  return axios(config).then(function (response) {
      if (response.status === 200) {
        return { status: 200, final_response: response.data };
      }else{
        return { status: 400, final_response: responses.data };
      }
  }).catch(function (error) {
    return { status: 400, final_response: error };
  });
}

const voterIdDetails = (id_number, userId, id) => {
  var data = JSON.stringify({ "task": "epicNumberSearch", "essentials": { "epicNumber": id_number } });
  var config = {
    method: 'post',
    url: `https://signzy.tech/api/v2/patrons/${userId}/voterIdV2`,
    headers: {
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.8',
      'Authorization': id,
      'content-type': 'application/json'
    },
    data: data
  };
  return axios(config).then(function (response) {
      if (response.status === 200) {
        return { status: 200, final_response: response.data };
      }else{
        return { status: 400, final_response: responses.data };
      }
  }).catch(function (error) {
    return { status: 400, final_response: error };
  });
}

const drivingLicense = (id_number, userId, id) => {
  var data = JSON.stringify({
    "type": "drivingLicence",
    "email": "ankur.rand@signzy.com",
    "callbackUrl": "https://www.w3schools.com",
    "images": []
  });
  var config = {
    method: 'post',
    url: `https://signzy.tech/api/v2/patrons/${userId}/identities`,
    headers: {
      'Authorization': id,
      'Content-Type': 'application/json',
    },
    data: data
  };
  return axios(config)
    .then(function (response) {
      if (response.status === 200) {
        var data = { "service": "Identity", "itemId": response.data.id, "accessToken": response.data.accessToken, "task": "fetch", "essentials": { "dob": "", "number": id_number } };
        var config = {
          method: 'post',
          url: 'https://signzy.tech/api/v2/snoops',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Connection': 'keep-alive',
            'Content-Type': 'application/json;charset=UTF-8',
            'Origin': 'https://sandbox.signzy.tech',
            'Referer': 'https://sandbox.signzy.tech/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
            'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"'
          },
          data: data
        };
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
      console.log(error);
    });
}

const phoneNumberGenerateOtp = async (mobileNumber,userId,id) => {
  var options = {
    method: 'post',
    url: `https://signzy.tech/api/v2/patrons/${userId}/phones`,
    headers: {
      'Authorization': id,
      'Content-Type': 'application/json',
      'Accept-Language': 'en-US,en;q=0.8', 
      'Accept': '*/*'
    },
    data: {
      task: 'mobile',
      essentials: {
        task: 'generateOtp',
        countryCode:'+91',
        mobileNumber:mobileNumber
      }
    }
  };
  return axios(options).then(function (responses){
    if(responses.status == 200) {
      return { status: 200, final_response:responses.data };
    }else{
      return { status: 400, final_response:responses.data };
    }
  }).catch(function (error){
    return { status: 400, final_response: error };
  });
}

const phoneNumberVerification = (otp,mobileNumber,referenceId,userId,id) => {
  var options = {
    method: 'POST',
    url: `https://signzy.tech/api/v2/patrons/${userId}/phones`,
    headers: {
      'Authorization': id,
      'Content-Type': 'application/json',
    },
    data: {
      task: 'mobile',
      essentials: {
        task: 'submitOtp',
        countryCode: '+91',
        mobileNumber:mobileNumber,
        referenceId:referenceId,
        otp:otp
      }
    }
  };
  return axios(options).then(function (responses){
    if(responses.status == 200) {
      return { status: 200, final_response:responses.data };
    }else{
      return { status: 400, final_response:responses.data };
    }
  }).catch(function (error){
    return { status: 400, final_response: error };
  });
}

const passportVerification = (id_number, userId, id, dob) => {
  var data = JSON.stringify({
    "type": "passport",
    "email": "ankur.rand@signzy.com",
    "callbackUrl": "https://www.w3schools.com",
    "images": []
  });
  var config = {
    method: 'post',
    url: `https://signzy.tech/api/v2/patrons/${userId}/identities`,
    headers: {
      'Authorization': id,
      'Content-Type': 'application/json',
    },
    data: data
  };
  return axios(config)
    .then(function (response) {
      if (response.status === 200) {
        var data = {
          "service": "Identity", "itemId": response.data.id, "accessToken": response.data.accessToken, "task": "fetch",
          "essentials": {
            dob: dob,
            fileNumber: id_number,
            fuzzy: "true"
          }
        };
        var config = {
          method: 'post',
          url: 'https://signzy.tech/api/v2/snoops',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Connection': 'keep-alive',
            'Content-Type': 'application/json;charset=UTF-8',
            'Origin': 'https://sandbox.signzy.tech',
            'Referer': 'https://sandbox.signzy.tech/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
            'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"'
          },
          data: data
        };
        return axios(config).then(function (responses) {
            if (responses.status == 200) {
              return { status: 200, final_response: responses.data };
            }else{
              return { status: 400, final_response: responses.data };
            }
        }).catch(function (error) {
          return { status: 400, final_response: error };
        });
      }
    }).catch(function (error) {
      return { status: 400, final_response: error };
    });
}

module.exports = {drivingLicense,panCardDetails,passportVerification,voterIdDetails,phoneNumberGenerateOtp,phoneNumberVerification}