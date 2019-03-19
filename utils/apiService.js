/*All calls to the backend is constructed here*/
/*Other operations pertaining to the backend is also done here*/
'use strict';

const request = require('request');

// functionality for GET and POST call
module.exports.callAPI = (params) =>{ //url, method, body, reqHeaders

    let options = {
        method : params.method,
        url: params.url,
        headers: {
            'Content-Type': 'application/json',
            'Accept':'application/json'
        },
        json : true
    };
    if (params.method == "POST" && params.body){
        options.body = params.body;
    }
    return new Promise((resolve, reject) =>{
        request(options, function (err, response, body) {
            //console.log('API RESP ', options.url, JSON.stringify(body));
            if (err){
                console.log("error in api service")
                reject(err);
            } else {
                resolve(body);
            }
        });
    });
};

module.exports.normalApiCall = (params) =>{ //url, method, body, reqHeaders

    let options = {
        method : params.method,
        url: params.url,
        headers: {
            'Content-Type': 'application/json',
            'Accept':'application/json'
        },
        json : true
    };
    if (params.method == "POST" && params.body){
        options.body = params.body;
    }
    console.log("url",options.url)
        request(options, function (err, response, body) {
          console.log("data from api",JSON.stringify(body))
            let data = JSON.stringify(body)
            return data        
        });
   
};
