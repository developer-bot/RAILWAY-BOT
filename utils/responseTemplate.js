"use strict";

var expObj = {};

// Simple response -> Single msg, multiple msg, Single/multiple msg with (or) without chips
/* Params structure ->  
{"simpleMsgs":[
    {
        "displayText": ""
        ,"textToSpeech":""
    }],
"contextOut":""
,"sugChips":[{
            "title": "" 
            ,"type": ""
            ,"postback": ""
            
        }]

}  
*/  
expObj.simpleResponse = function (params) {

  return new Promise((resolve, reject) =>{
    var simple_msgs=[];
    for(var i in params.simpleMsgs){
        simple_msgs.push({
            "text": params.simpleMsgs[i].displayText
            ,"speech": params.simpleMsgs[i].textToSpeech
          })
    }
    resolve({

      "simpleText": simple_msgs,
      "contextOut": params.contextOut || "",
      "chips":params.sugChips || ""
    });
  });
};

// Card response -> Single msg, multiple msg, card, with (or) without chips
/* Params structure ->  
{
    "simpleMsgs":[
    {
        "displayText": ""
        ,"textToSpeech":""
    }],
  "cardMsg": {
    "title":""
    ,"subTitle":""
    ,"formattedText":""
    ,"url": ""
    ,"altText": ""
    , "url": ""
    , "postback":""   
  } 
,"contextOut":""
,"sugChips":[{
            "title": "" 
            ,"type": ""
            ,"postback": ""
            
        }]

}  
*/  
expObj.cardResponse = function(params){
    return new Promise((resolve, reject) =>{
    var simple_msgs=[];
    for(var i in params.simpleMsgs){
        simple_msgs.push({
            "text": params.simpleMsgs[i].displayText
            ,"speech": params.simpleMsgs[i].textToSpeech
          })
    }
    console.log("total data for card",params)
    console.log("title",params.cardMsg.title)
    let respObj = {
      "simpleText": simple_msgs,
      "card": {
        "title":params.cardMsg.title || ""
         ,"subTitle": params.cardMsg.subTitle || ""
         ,"formattedText":params.cardMsg.formattedText || ""
         ,"image": {
          "url": params.cardMsg.imgUrl || ""
          ,"altText": params.cardMsg.imgTxt || ""
        },
        "buttons": [
          {
            "title":params.cardMsg.buttonTitle || ""
          , "url": params.cardMsg.buttonUrl || ""
          , "postback":params.cardMsg.postback || ""
          }
        ]
      },
      "chips": params.sugChips || "",
      "contextOut": params.contextOutVal || ""
    };
  console.log('response form template', JSON.stringify(respObj));
        resolve(respObj);
    });
};


// List response -> Single msg, multiple msg, List with (or) without chips
/* Params structure ->  
{
    "simpleMsgs":[
    {
        "displayText": ""
        ,"textToSpeech":""
    }],
  "list": {
    "itemValues":[
        {
          "title":""
          ,"subTitle":""
          ,"synonyms":""  
          ,"url":""
          ,"urlText":""
          ,"postback":""
          ,"buttonTitle":""
          ,"buttonUrl":""
        }
    ]  
  } 
,"contextOut":""
,"sugChips":[{
            "title": "" 
            ,"type": ""
            ,"postback": ""
            
        }]

}  
*/  
expObj.listResponse = function (params) {
    return new Promise((resolve, reject) => {
    var simple_msgs=[];
    for(var i in params.simpleMsgs){
        simple_msgs.push({
            "text": params.simpleMsgs[i].displayText
            ,"speech": params.simpleMsgs[i].textToSpeech
          })
    }
var itemVals=[];
  for(var i in params.list.itemValues){
itemVals.push({
  "title": params.list.itemValues[i]['title']
  ,"subTitle": params.list.itemValues[i]['description']
  ,"synonyms": params.list.itemValues[i]['optionInfo']['synonyms']
  ,"image": {
    "url": params.list.itemValues[i]['url'] || ""
    ,"altText": params.list.itemValues[i]['urlText'] || ""
  },
  "postback": params.list.itemValues[i]['postback'] || ""
  ,"buttons": [
    {
      "title": params.list.itemValues[i]['buttonTitle'] || ""
      ,"url": params.list.itemValues[i]['buttonUrl'] || ""
    }
  ]
});
  }

  let respObj = {
    "simpleText": simple_msgs,
    "list": {
      "title": params.list.title
      ,"items": itemVals,
      "buttons": [
        {
          "title": ""
          ,"type": ""
          ,"postback": ""
          
        }
      ]
    },
    "chips": params.sugChips,
    "contextOut":params.contextOut
  };
    resolve(respObj);
  });
};
// Triggering a followup intent
/*
params =>{
"followupEventInput":{
    "name":""
    ,"parameters":""
}

}
*/
expObj.triggerFollowupEvent = function(params) {
  return new Promise((resolve,reject)=> {
    resolve({
      "followupEventInput": {
        "name": params.followupEventInput.name || "",
        "parameters": params.followupEventInput.parameters || {},
      }

    });
  });
}


module.exports = expObj;