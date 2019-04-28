var Router = require('express').Router();
const bcrypt = require('bcrypt');
var Cryptr = require('cryptr'),cryptr = new Cryptr('MyS3CR3TKeY');
const appfun = require('../appfunctions/functions');
const appOtp = require('../appfunctions/otp');


//sendOtp
Router.post('/', function (req, res, next) {
    //var aadhar = bcrypt.hashSync(req.body.aadharNumber, 12);
    console.log(req.body);
    var aadharNumber = parseInt(req.body.aadharNumber);
    var mobileNumber = parseInt(req.body.mobileNumber);
    var valid = appfun.validateSubscriber(aadharNumber, mobileNumber,function(result1){
      if(result1){
        console.log(result1);
        appOtp.otpToSub(mobileNumber,function(result2){
          console.log(result2);
          if(result2){
              var encryptedAadhar = cryptr.encrypt(aadharNumber);//encryptedAadhar
              res.status(200).json({
                "result": {
                status: true,
                aadharNumber: encryptedAadhar,
                mobileNumber: mobileNumber,
                message: "OTP Send Successfully!!!",
                obj:result2
              }
            });
          }//result 2
        },function(error2){
          console.log(error2);
          res.status(500).json({
            "result":{
              status: false, 
              message: "OTP Sending Failed", 
              error: error2
            }
          });
        });//otpToSub
      }//if result1
    },function(error1){
        console.log(error1);
        res.status(401).json({
          "result": {
            status: false, 
            message: "Invalid Aadhar/ Mobile number", 
            error: error1
          }
        });
    });//validateSubscriber
});//get

//verifyOtp
Router.post('/verifyOtp',function(req, res, next){
  console.log(req.body);
  var mobileNumber = parseInt(req.body.mobileNumber);
  var otp = parseInt(req.body.otp);
  appOtp.verifyOtp(mobileNumber, otp, function(result1){
      if(result1){
      console.log(result1);
      var decryptedAadhar = cryptr.decrypt(req.body.aadharNumber);//decryptAadhar
      appfun.getSubscriber(decryptedAadhar,function(result2){
        if (result2) {
          console.log(result2);
          res.status(200).json({
            "result": {
            status: true, 
            message: "OTP Verified Successfully", 
            obj: result2
          }
        });
      }//if result2 
    },function(error2){
        if(error2){
          console.log(error2);
          res.status(500).json({
            "result": {
              status: false, 
              message:"Subscriber Not Found", 
              error: error2
            }
          });
        }
      });//getSubscriber
    }//result1
  },function(error1){
    res.status(401).json({
      "result": {
        status: false, 
        message: "Invalid OTP", 
        error: error1
      }
    });
  });//verifyOtp
});//router


//drop request


module.exports = Router;
