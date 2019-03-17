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
        "simpleResponse": {
          "textToSpeech": params.simpleMsgs[i].textToSpeech,
          "displayText": params.simpleMsgs[i].displayText
        }
      })
    }

    resolve({
      "payload": {
        "google": {
          "expectUserResponse": true,
          "richResponse": {
            "items": simple_msgs
          }
        }
      }
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
*/  
// {
//   "payload": {
//     "google": {
//       "expectUserResponse": true,
//       "richResponse": {
//         "items": [
//           {
//             "simpleResponse": {
//               "textToSpeech": "Choose a item"
//             }
//           }
//         ]
//       },
//       "systemIntent": {
//         "intent": "actions.intent.OPTION",
//         "data": {
//           "@type": "type.googleapis.com/google.actions.v2.OptionValueSpec",
//           "listSelect": {
//             "title": "Hello",
//             "items": [
//               {
//                 "optionInfo": {
//                   "key": "first title key"
//                 },
//                 "description": "first description",
//                 "image": {
//                   "url": "https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png",
//                   "accessibilityText": "first alt"
//                 },
//                 "title": "first title"
//               },
//               {
//                 "optionInfo": {
//                   "key": "second"
//                 },
//                 "description": "second description",
//                 "image": {
//                   "url": "https://lh3.googleusercontent.com/Nu3a6F80WfixUqf_ec_vgXy_c0-0r4VLJRXjVFF_X_CIilEu8B9fT35qyTEj_PEsKw",
//                   "accessibilityText": "second alt"
//                 },
//                 "title": "second title"
//               }
//             ]
//           }
//         }
//       }
//     }
//   }
// }



expObj.listResponse = function (params) {
    return new Promise((resolve, reject) => {
    var simple_msgs=[];
    for(var i in params.simpleMsgs){
      simple_msgs.push({
        "simpleResponse": {
          "textToSpeech": params.simpleMsgs[i].textToSpeech,
          "displayText": params.simpleMsgs[i].displayText
        }
      }
      )
    }
  let respObj = {
    "payload": {
      "google": {
        "expectUserResponse": true,
        "richResponse": {
          "items": simple_msgs
        },
        "systemIntent": {
          "intent": "actions.intent.OPTION",
          "data": {
            "@type": "type.googleapis.com/google.actions.v2.OptionValueSpec",
            "listSelect": {
              "title": "",
              "items": params.list.itemValues
            }
          }
        }
      }
    }
  }
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