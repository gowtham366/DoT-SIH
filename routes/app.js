var express = require('express');
var router = express.Router();
const AadharDetail = require('../models/aadhar_schema');
const UserDetail = require('../models/user_schema');
const SendOtp = require('sendotp');
const msg = "Dear Subscriber, OTP for your Mobile Subscription Details is {{otp}}, It is valid only for 5 minutes. Please do not share with anyone";
const AuthKey = '201601AUavLjD7K5aa26782';
const sendOtp = new SendOtp(AuthKey, msg);

//router
router.get('/', function (req, res, next) {
    res.render('index');
});



//insert new aadhar detail
router.post('/insertSubscriber', function(req, res, next){
  console.log(req.body);
  var aadhar_details = new AadharDetail(req.body);
  aadhar_details.save(function(error,result){
    if(error)
    {
    console.log(error);
    return res.send(successStatus());
    //res.redirect('/output/error');
    }
    else
    {
      console.log(result);
      return res.send(failedStatus());
      //res.redirect('/output/success');
    }
  });
});

//update subscriberDetails
router.post('/SubscriberAdons', function(req, res, next){
  console.log(req.body);
  AadharDetail.update({aadharNumber: req.body.aadharNumber},{$push:{MobileDetails:req.body.MobileDetails}},function(error,result){
    if(error)
    {
      console.log(error);
      return res.send(error);
    }
    if(!result.n)
    {
      console.log("insertNewSubscriber");
      var out = insertSubscriber(req.body);
      return res.send(out);
    }
     console.log(result);
     return res.send(result);
  });
});

//get subscriberDetails
router.post('/getSubscriberDetails',function(req, res, next){
  console.log(req.body);
  AadharDetail.find({aadharNumber: req.body.aadharNumber},function(error,result){
    if(error)
    {
      console.log(error);
      return res.send("Error!!!");
    }
     console.log(result);
     return res.send(result);
  });
});

//validateSubscriber
router.post('/validateSubscriber',function(req, res, next){
  console.log(req.body);
  AadharDetail.find({aadharNumber: req.body.aadharNumber});
});

//send otp
router.post('/sendOtp',function(req, res, next){
  console.log(req.body);
  var mobileNumber = req.body.mobileNumber;
  sendOtp.setOtpExpiry('5');
  var result;
  sendOtp.send(mobileNumber,"Viserion",function(error, data, res){
    console.log(data);
    result = data;
    if(data.type == 'success')
    {
      console.log("OTP Send Successfully!!!");
      return res.send(successStatus());
      //result = { "status": true};
    }
    if(data.type == 'error')
    {
      console.log("OTP Send Failed");
      return res.send(failedStatus());
      //result = { "status": false};
    }
  });
  //JSON.parse(result);
  //res.render('node',{output: result});
  //return res.send(result);
});

//verify otp
router.post('/verifyOtp',function(req, res, next){
  console.log(req.body);
  var mobileNumber = req.body.mobileNumber;
  var otp = req.body.otp;
  var result;
  sendOtp.verify(mobileNumber,otp,function(error, data, res){
    console.log(data);
    result = data;
    if(data.type == 'success')
    {
      console.log("OTP Verified Successfully!!!");
      return res.send(successStatus());
      //result = { "status": true};
      //res.render('node',{output: "OTP Verified Successfully!!!"});
    }
    if(data.type == 'error')
    {
      console.log("Verification Failed");
      return res.send(failedStatus());
      //result = { "status": false};
       //res.render('node',{output: "Verification Failed"});
    }
  });
  //JSON.parse(result);
  //res.render('node', {output : result});
  //return res.send(result);
});

//
 router.get('/messages/:msg', function(req, res, next){
   res.render('node',{messages: req.params.msg});
 });
 router.get('/output/:msg', function(req, res, next){
   res.render('node',{output: req.params.msg});
 });
// router.post('/messages', function(req, res, next){
//   var message = req.body.message;
//   res.redirect('/messages/' +message);
// });

//insert new user
router.post('/insertUser',function(req, res, next){
  var user_details = new UserDetail(req.body);
  user_details.save(function(error,result){
    if(error)
    {
    console.log(error);
    res.redirect('/messages/error');
    }
    else
    {
      console.log(result);
      res.redirect('/messages/success');
    }
  });
});

//get user detail
router.get('/getUserDetail', function(req, res, next){
  user_details.findOne({email : req.body.email},function(error,result){
    if(error){
      return res.send('Error!!!');
    }
    res.render('node', {output: result});
  });
});
//function
function subscriberNumberCount(aadharNumber) {

}

function insertSubscriber(req) {
  console.log(req);
  var aadhar_details = new AadharDetail(req);
  aadhar_details.save(function(error,result){
    if(error)
    {
    console.log(error);
    return failedStatus();
    //res.redirect('/output/error');
    }
    else
    {
      console.log(result);
      return successStatus();
      //res.redirect('/output/success');
    }
  });
}

function successStatus()
{
  var out = "{'status': true}";
  out = JSON.parse(out);
  console.log(out.status);
  return out;
}

function failedStatus()
{
  var out = "{'status': false}";
  out = JSON.parse(out);
  console.log(out.status);
  return out;
}

module.exports = router;
