
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
                "displayText": apiConfig.trainBetweenStation.ResMsg.FROM_STATION_TEXT
                ,"textToSpeech":apiConfig.trainBetweenStation.ResMsg.FROM_STATION_SPEECH,
            },
        ],
            
        };
        console.log("response object",JSON.stringify(simpresponse))
        templateService.simpleResponse(simpresponse)
        .then(respObj=>{
            console.log("rep",JSON.stringify(respObj))
            return res.json(respObj).end();
        }).catch (e =>{
            sendCommonErrorResponse(req, res);
        });
    } else if(req.body.queryResult.parameters['toStation']== ""){
        let simpresponse = {"simpleMsgs":[
            {
                "displayText": apiConfig.trainBetweenStation.ResMsg.TO_STATION_TEXT
                ,"textToSpeech":apiConfig.trainBetweenStation.ResMsg.TO_STATION_SPEECH,
            },
        ],
            
        };
        console.log("response object",JSON.stringify(simpresponse))
        templateService.simpleResponse(simpresponse)
        .then(respObj=>{
            console.log("rep",JSON.stringify(respObj))
            return res.json(respObj).end();
        }).catch (e =>{
            sendCommonErrorResponse(req, res);
        });
    } else if(req.body.queryResult.parameters['date']== ""){
        let simpresponse = {"simpleMsgs":[
            {
                "displayText": apiConfig.trainBetweenStation.ResMsg.DATE_TEXT
                ,"textToSpeech":apiConfig.trainBetweenStation.ResMsg.DATE_SPEECH,
            },
        ],
            
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
    let botData = {
        "fromStation" : req.body.queryResult.parameters['fromStation']
        ,"toStation"  : req.body.queryResult.parameters['toStation']
        ,"date"       : req.body.queryResult.parameters['date']
    }
    var stationCode = getStationCode(botData) //[]
    var dateFormat  = getDateFormat(botData)
    var trainCode   = getTrainCode(stationCode[0],stationCode[1],dateFormat,req, res)
    console.log("array",trainCode)
    let secondGetUrl = apiConfig["trainBetweenStation"]["path_second"]
    //"https://api.railwayapi.com/v2/between/source/sourcestn/dest/deststn/date/dte/apikey/dkl42901wu/",
 
    secondGetUrl = secondGetUrl.replace("source",stationCode[0])
    secondGetUrl = secondGetUrl.replace("dest",stationCode[1])
    console.log("url",getUrl)

        let secondDetails = {
            'url':secondGetUrl
            ,'method':"GET"
            ,'body': null
            }
        
         console.log("second url",secondGetUrl)
        apiService.callAPI(secondDetails)
        .then(resBody=>{
            if(resBody.Trains){
                //console.log("data from ele",JSON.stringify(resBody.Trains))
                let listItems=[]
                resBody["Trains"].forEach(element => {
                        listItems.push({
                            "optionInfo": {
                              "key": `${element.TrainNo}|${element.TrainName}`
                            },
                            "description": `${element.DepartureTime} ${element.Source} --> ${element.TravelTime} --> ${element.ArrivalTime} ${element.Destination}`,
                         "image": {
                           "url": "",
                           "accessibilityText": ""
                         },
                            "title": `${element.TrainNo} | ${element.TrainName}`
                          })
                    }
                );
                let listDetails = {
                    "simpleMsgs":[{
                        "textToSpeech": `following are the list of train from ${stationCode[0]} to ${stationCode[1]}`,
                        "displayText": `following are the list of train from ${stationCode[0]} to ${stationCode[1]}`,
                    }],
                      "list": {
                        "itemValues": listItems
                    }
                };
                templateService.listResponse(listDetails)
                .then(respObj=>{
                 // console.log("no meetings"+JSON.stringify(respObj))
                  return res.json(respObj).end();
                }).catch (e =>{
                      return sendCommonErrorResponse(req,res);
                });
            } else {
                return sendCommonErrorResponse(req, res)
            }
        })
        .catch(e =>{
            console.log("error in api calling");
             return sendCommonErrorResponse(req, res);
         });

}



function getTrainCode(source,dest,date,req,res){
    console.log("enter in to train code")
    var mapObj = {
        sourcestn: source
        ,deststn: dest
        ,dte: date
    };
    let getUrl = apiConfig["trainBetweenStation"]["path"]
    getUrl = getUrl.replace(/sourcestn|deststn|dte/gi, function (matched) {
        return mapObj[matched];
    });
    console.log("get urls",getUrl)
    let details = {
        'url':getUrl
        ,'method':"GET"
        ,'body': null
        }
    apiService.callAPI(details)
    .then(resBody=>{
        let traincode = []
        if(resBody.trains){
            resBody.trains.forEach(element => {
                traincode.push(element.number)
            })
            return traincode
        } else{
            sendCommonErrorResponse(req, res);
        }
    })
    .catch(e =>{
        console.log("error in api calling");
         return sendCommonErrorResponse(req, res);
     })
}



function getDateFormat(botData){
     //'2019-03-18T12:00:00+06:00'
     if(botData.date.indexOf('T') > 1) {
        let newdate = botData.date.split('T')[0].split('-')
        let day = newdate[2]
        let month = newdate[1]
        let year = newdate[0]
        return `${day}-${month}-${year}`
    } else {
        return botData.date
    }
}


function getStationCode(botData) {
    let stationCode = STATION_CODE.data
    let stationCodeArr = []
    let uDataFrom = stationCode.find(function(cObj){
        return cObj.name.toLowerCase() == botData.fromStation.toLowerCase();
    });
    stationCodeArr.push(uDataFrom.code)
    let uDataTo = stationCode.find(function(cObj){
        return cObj.name.toLowerCase() == botData.toStation.toLowerCase();
    });
    stationCodeArr.push(uDataTo.code)
    return stationCodeArr;
}


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
