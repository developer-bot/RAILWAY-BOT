"use strict";
var express 		= require('express');
var bodyParser 		= require('body-parser');
//const PS_API = require('./config/psApi.json');
var app 			= express();
var port = process.env.PORT || 2020;
let trainBetween = require('./handlers/trainBetweenStation.js');

app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json());

app.post("/webhook",function(req,res){
    console.log("data is",JSON.stringify(req.body))
    let body = req.body
     if(body.queryResult.intent.displayName == "trainBetweenStation") {
        trainBetween.getTrainBetweenStation(req,res)
    }
});


  app.listen(port,function(){
    console.log("railway bot is running successfully"+port);

});
process.on('unCaughtException', function(err){
	console.log(err);
	process.exit(1);
});
