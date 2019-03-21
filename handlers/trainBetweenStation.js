
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
    var mapObj = {
        sourcestn: stationCode[0]
        ,deststn: stationCode[1]
        ,dte: dateFormat
    };
    let getUrl = apiConfig["trainBetweenStation"]["path"]
    //"https://api.railwayapi.com/v2/between/source/sourcestn/dest/deststn/date/dte/apikey/dkl42901wu/",
    getUrl = getUrl.replace(/sourcestn|deststn|dte/gi, function (matched) {
        return mapObj[matched];
    });
    console.log("url",getUrl)
    let details = {
        'url':getUrl
        ,'method':"GET"
        ,'body': null
        }
        apiService.callAPI(details)
        .then(resBody=>{
            console.log("data from ele",JSON.stringify(resBody.trains))
            let listItems=[]
            resBody.trains.forEach(element => {
                console.log("from station api",element.from_station.code)
                console.log("from station json",stationCode[0])
                console.log("to station api",element.to_station.code)
                console.log("to station json",stationCode[1])
                    listItems.push({
                        "optionInfo": {
                          "key": `${element.number}|${element.name}`
                        },
                        "description": `${element.src_departure_time} ${element.from_station.code} ➺ ${element.travel_time} ➺ ${element.dest_arrival_time} ${element.to_station.code}`,
                     "image": {
                       "url": "",
                       "accessibilityText": ""
                     },
                        "title": `${element.number} | ${element.name}`
                      })
                }
            );
            let listDetails = {
                "simpleMsgs":[{
                    "textToSpeech": `following are the list of train from ${resBody.trains[0].from_station.name} to ${resBody.trains[0].to_station.name}`,
                    "displayText": `following are the list of train from ${resBody.trains[0].from_station.name} to ${resBody.trains[0].to_station.name}`,
                }],
                  "list": {
                    "itemValues": listItems
                }
            };
            templateService.listResponse(listDetails)
            .then(respObj=>{
              console.log("no meetings"+JSON.stringify(respObj))
              return res.json(respObj).end();
            }).catch (e =>{
                  return sendCommonErrorResponse(req,res);
            });
        })
        .catch(e =>{
            console.log("error in api calling");
             return sendCommonErrorResponse(req, res);
         });

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
