"use strict";
var express 		= require('express');
var bodyParser 		= require('body-parser');
//const PS_API = require('./config/psApi.json');
var app 			= express();
var port = process.env.PORT || 2020;

app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json());

app.post("/webhook",function(req,res){
    console.log("received a post request",JSON.stringify(req.body));
      responseObj=
      {
        "payload": {
          "google": {
            "expectUserResponse": true,
            "richResponse": {
              "items": [
                {
                  "simpleResponse": {
                    "displayText": "Your pizza delivery **has** arrived! Thank you for using __Pizza Bot!__",
                    "textToSpeech": "Your pizza delivery **has** arrived! Thank you for using __Pizza Bot!__"
                  }
                }
              ]
            }
          }
        }
      }
    return res.json(responseObj);
    
    });
    
  app.listen(port,function(){
    console.log("railway bot is running successfully"+port);

});
process.on('unCaughtException', function(err){
	console.log(err);
	process.exit(1);
});
