
//const COMMON_DATA = require('../config/common.json');
const STATION_CODE = require('../config/stationCode.json');
const apiConfig = require('../config/apiConfig.json');
let templateService = require('../utils/responseTemplate');
let apiService = require('../utils/apiService');


let expObj = {};

expObj.getTrainBetweenStation = function(req, res){
    console.log("body is coming",JSON.stringify(req.body))
    console.log("form station",req.body.queryResult.parameters['fromStation'])
    console.log("all parameters",req.body.queryResult.parameters)
        if (req.body.queryResult.parameters['fromStation']== "") {
        let simpresponse = {"simpleMsgs":[
            {
                "displayText": apiConfig.trainBetweenStation.ResMsg.FROM_STATION_SPEECH
                ,"textToSpeech":apiConfig.trainBetweenStation.ResMsg.FROM_STATION_TEXT,
            },
            {
                "displayText": apiConfig.trainBetweenStation.ResMsg.FROM_STATION_SPEECH
                ,"textToSpeech":apiConfig.trainBetweenStation.ResMsg.FROM_STATION_TEXT,
            }],
            
        };
        console.log("response object",JSON.stringify(simpresponse))
        templateService.simpleResponse(simpresponse)
        .then(respObj=>{
            console.log("rep",JSON.stringify(respObj))
            return res.json(respObj).end();
        }).catch (e =>{
            sendCommonErrorResponse(req, res);
        });
    }
}


// expObj.getTrainBetweenStation = function(req, res){
//     personalInfoLogs.info(`request body for emergrncy details ${JSON.stringify(req.body)}`)
//     if (req.body.entityName.contactName == "") {
//         let simpresponse = {"simpleMsgs":[
//             {
//                 "displayText": apiConfig.AddEmergencyContacts.ResMsg.ASK_CONTACT_NAME_TEXT
//                 ,"textToSpeech":apiConfig.AddEmergencyContacts.ResMsg.ASK_CONTACT_NAME_SPEECH,
//             }],
//         "contextOut":""
//         ,"sugChips":""
//         };
//         templateService.simpleResponse(simpresponse)
//         .then(respObj=>{
//             return res.json(respObj).end();
//         }).catch (e =>{
//             personalInfoLogs.error(e);
//             sendCommonErrorResponse(req, res);
//         });
//     } else if (req.body.entityName.relationshipType == "") {
//         askRelationshipType(req,res);
//     } else if (req.body.entityName.phoneNumberType == "") {
//         askEmergencyContactPhoneType(req,res);
//     } else if (req.body.entityName.phoneNumber == "") {
//         let simpresponse = {"simpleMsgs":[
//             {
//                 "displayText": apiConfig.AddEmergencyContacts.ResMsg.ASK_CONTACT_NUMBER_TEXT
//                 ,"textToSpeech":apiConfig.AddEmergencyContacts.ResMsg.ASK_CONTACT_NUMBER_SPEECH,
//             }],
//         "contextOut":""
//         ,"sugChips":""
//         };
//         templateService.simpleResponse(simpresponse)
//         .then(respObj=>{
//             return res.json(respObj).end();
//         }).catch (e =>{
//             personalInfoLogs.error(e);
//             sendCommonErrorResponse(req, res);
//         });
//     } else if(req.body.entityName.preferredFlag == ""){
//         askPrimaryContact(req,res);
//     } else {
//         let reqData = {
//             //"EMPLID":req.body.userSession.employeeId,
//             "EMPLID":"PU311",
//             "CONTACT_NAME":req.body.entityName.contactName,
//             "RELATIONSHIP":req.body.entityName.relationshipType,
//             "PHONE_TYPE":req.body.entityName.phoneNumberType,
//             "PHONE":req.body.entityName.phoneNumber,
//             "PRIMARY_CNCT":req.body.entityName.preferredFlag
//         };
//         let postURL = apiConfig["AddEmergencyContacts"]["path"]
//         personalInfoLogs.info(`url for add emergency contact ${postURL}`);
//         personalInfoLogs.info(`EMERGENCY DETAILS BODY ${JSON.stringify(reqData)}`);
//         let details={
//         'url':postURL
//         ,'method':"POST"
//         ,'body': reqData
//         ,'reqHeaders':req.headers
//         };
//         apiService.callAPI(details)
//             .then(body =>{
//                 personalInfoLogs.info("success /error msg form api ",body.HX_ESS_EMERGENCY_RESP);
//                 if(body.HX_ESS_EMERGENCY_RESP) {
//                     if(body.HX_ESS_EMERGENCY_RESP.MESSAGE && body.HX_ESS_EMERGENCY_RESP.MESSAGE.indexOf("success") != -1){
//                         let relationshipType = STUDENT_DATA.emergencyContactRelationshipTypes[req.body.entityName.relationshipType] && STUDENT_DATA.emergencyContactRelationshipTypes[req.body.entityName.relationshipType].shortDesc ? STUDENT_DATA.emergencyContactRelationshipTypes[req.body.entityName.relationshipType].shortDesc : req.body.entityName.relationshipType;
//                         let phoneNumberType = STUDENT_DATA.phoneNumberTypes[req.body.entityName.phoneNumberType] && STUDENT_DATA.phoneNumberTypes[req.body.entityName.phoneNumberType].description ? STUDENT_DATA.phoneNumberTypes[req.body.entityName.phoneNumberType].description : req.body.entityName.phoneNumberType;
//                         personalInfoLogs.log('DATA EMGC ',reqData, relationshipType, phoneNumberType, req.body.entityName); 
//                         let cardDetails = {
//                         "simpleMsgs":[
//                         {
//                             "displayText": "Saved Successfully"
//                             ,"textToSpeech":""
//                         }],
//                     "cardMsg": {
//                         "title": "Contact Name : "+ req.body.entityName.contactName
//                         ,"subTitle": "Relationship : "+ relationshipType
//                         ,"formattedText": "**"+phoneNumberType + "** : " + req.body.entityName.phoneNumber
//                         ,"url": ""
//                         ,"altText": ""
//                         , "url": ""
//                         , "postback":""   
//                     } 
//                     ,"contextOut":""
//                     ,"sugChips": COMMON_DATA['commonChipData']
//                     }
//                     personalInfoLogs.log("final response for dialog",cardDetails);
//                         templateService.cardResponse(cardDetails)
//                         .then(respObj=>{
//                             for(let i=0; i < req.body.contexts.length; i++){
//                                 req.body.contexts[i].lifespanCount = 0;
//                             }
//                             respObj.contextOut=req.body.contexts;
//                             return res.json(respObj).end();
//                         }).catch (e =>{
//                             personalInfoLogs.error(e);
//                             sendCommonErrorResponse(req, res);
//                         });
//                     } else{
//                         personalInfoLogs.log(' FAIL IN ',body.HX_ESS_EMERGENCY_RESP);
//                        let simpresponse = {"simpleMsgs":[
//                         {
//                             "displayText": body.HX_ESS_EMERGENCY_RESP.MESSAGE ? body.HX_ESS_EMERGENCY_RESP.MESSAGE : body.HX_ESS_EMERGENCY_RESP
//                             ,"textToSpeech":body.HX_ESS_EMERGENCY_RESP ? body.HX_ESS_EMERGENCY_RESP.MESSAGE : body.HX_ESS_EMERGENCY_RESP
//                         }],
//                     "contextOut":""
//                     ,"sugChips":COMMON_DATA['commonChipData']
//                     };
//                         templateService.simpleResponse(simpresponse)
//                         .then(respObj=>{
//                             return res.json(respObj).end();
//                         }).catch (e =>{
//                             personalInfoLogs.error(e);
//                             sendCommonErrorResponse(req, res);
//                         });
//                     }
//                 } else {
//                     sendCommonErrorResponse(req, res);
//                 }
//             })
//             .catch(err =>{
//                 personalInfoLogs.error("ADD EMERG ERR ",reqData, err);
//                 sendCommonErrorResponse(req, res);
//             });
//     }
// };


function sendCommonErrorResponse(req,res){
    console.log("error method");
    // personalInfoLogs.info("outside the tryyy",COMMON_DATA.errorText);
    // let simpresponse = {"simpleMsgs":[
    //     {
    //         "displayText": COMMON_DATA.errorText
    //         ,"textToSpeech":COMMON_DATA.errorText
    //     }],
    // "contextOut":""
    // ,"sugChips":COMMON_DATA['confirmMsgChip']
    // };
    // templateService.simpleResponse(simpresponse)
    //             .then(respObj=>{
    //                 for(var i=0;i<req.body.contexts.length;i++){
    //                     req.body.contexts[i].lifespanCount = 0;
    //                     }
    //                     respObj.contextOut=req.body.contexts;
    //                 return res.json(respObj).end();
    //             }).catch (e =>{
    //                 sendCommonErrorResponse(req,res);
    //             });
}
module.exports = expObj;