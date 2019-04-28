var Router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var Cryptr = require('cryptr'),cryptr = new Cryptr('TSPS3CR3TKeYy');
var forEach = require('async-foreach').forEach;
const tspSchema = require('../models/tsp_schema');
const appfun = require('../appfunctions/functions');
const droppedDetail = require('../models/droppedNumber_schema');
const requestIp = require('request-ip');
const format = require("node.date-time");

var Operator = "";
var ipAddress = "";

//this method executes on each req
Router.use('/', function(req, res, next) {
  console.log(req.query.token);
  //console.log(req.body);
  jwt.verify(req.query.token, 'MyS3CR3T', function(err, decoded) {
    if (err) {
      console.log("ERR");
        res.status(401).json({
        status: false,
        message: 'Not Authenticated',
        error: err
      });
    }
    else{
      next();
    }//else

});//jwt
});//router

//addMultipleSubscriber
var successCount = 0, count = 0;
var failCount = 0;
var resarr = [];
Router.post('/addMultipleSubscriber',function(req, res, next){
  console.log("Adding subscriber!!!");
  //console.log(req.body.subscriber);
  forEach(req.body.subscriber, function(item, index, arr){
    forEach(item.MobileDetails, function(item1, index1, arr1){
      var addsub = {
        aadharNumber : item.aadharNumber,
        name : item.name,
        MobileDetails : [{
          number : item1.number,
          operator : Operator,
          region : item1.region,
          dateOfReg : item1.dateOfReg,
          ipAddress: ipAddress
        }]
      };
      appfun.checkndadd(addsub, function(result){
        console.log(result)
        if(result)
        {
          console.log(item1.number,result.message);
          successCount++;
          console.log(successCount);
          var gres = {
            status: true,
            number:item1.number,
            message: result.message,
            obj: result.obj
          };
          resarr.push(gres);
          console.log(resarr);
         // res.status(201).json({status: true, number:item1.number,  message: result.message, obj: result.obj});
        }
      },function(error){
        if(error)
        {
          console.log(item1.number,error.message);
          failCount++;
          console.log(failCount);
          var gres = {
            status: false,
            number:item1.number,
            message: error.message
          };
          resarr.push(gres);
          console.log(resarr);
          //res.status(500).json({status: false, number:item1.number, message: error.message});
        }//error CB
      });
    });//inner forEach
    count++;
    console.log(count);
    if(req.body.subscriber.length === count){
      console.log(successCount,failCount);
      res.status(200).json({success: successCount, failed: failCount, result: resarr});
    }
  });//outer forEach

});


//add Subscriber
Router.post('/addSubscriber',function(req, res, next){
  console.log("Adding subscriber!!!");
  //console.log(req.body);

  console.log("Key",req.body.key);
  tspSchema.findOne({"authKey":req.body.key},function(error, result){
  console.log(result);
if (error) {
   res.status(500).json({status:false, error: error});
}
if (result === null) {
    res.status(401).json({status:false, message: 'Not Authenticated'});
}
else {
  Operator = result.operator;
  ipAddress = requestIp.getClientIp(req);
  console.log(ipAddress);
  tspSchema.update({operator:Operator},{$push:{loginIpAddress : ipAddress,lastLogin : new Date().format("Y-MM-dd HH:mm:SS")}}, function(error, result){
    if(result)
    {
      console.log("ip stored ", result);
      //next();

          var addsub = {
            aadharNumber : req.body.aadharNumber,
            name : req.body.name,
            MobileDetails : [{
              number : req.body.MobileDetails[0].number,
              operator : Operator,
              region : req.body.MobileDetails[0].region,
              dateOfReg : req.body.MobileDetails[0].dateOfReg,
              ipAddress: ipAddress
            }]
          };
          appfun.checkndadd(addsub, function(result){
            console.log("yyyy")
            console.log(result)
            if(result)
            {
              console.log(req.body.MobileDetails[0].number,result.message);
              res.status(201).json({status: true, message: result.message, obj: result.obj});
            }
          },function(error){
            if(error)
            {
              console.log(req.body.MobileDetails[0].number,error.message);
              res.status(500).json({status: false, message: error.message});
            }//error CB
          });
    }
    if(error)
    {
      console.log(error);
    }
  });
}
});


  //ggg
});


//deleteSubscriber
Router.post('/deleteSubscriber',function(req, res, next){
  console.log(req.body);
  appfun.checknddelete(req.body, Operator, ipAddress, function(success){
    console.log(success)
    if(success)
    {
      console.log("Result Done!!!");
      res.status(200).json({status: true, message: "Subscriber dropped!!!", obj: success});
    }
  } ,function(error){
    if(error)
    {
      console.log("Done2");
      res.status(500).json({status: false, message:"Failed to drop subscriber", error: error});
    }
  });
});


//export modules
module.exports = Router;
