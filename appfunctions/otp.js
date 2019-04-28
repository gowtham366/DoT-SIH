const SendOtp = require('sendotp');
const msg = "Dear Subscriber, OTP for your Mobile Subscription Details is {{otp}}, It is valid only for 5 minutes. Please do not share with anyone";
const AuthKey = '205661AL0mYc3IsV85ab62820';
const sendOtp = new SendOtp(AuthKey, msg);

//sendOtp

let otpToSub = function (mobile, successCB, errorCB){
  sendOtp.setOtpExpiry('5');
  sendOtp.send(mobile,"Viserion",function(error, data, res){
    console.log(data);
    if(data.type == 'success')
    {
      console.log("OTP Send Successfully!!!");
      successCB(data);
    }
    if(data.type == 'error')
    {
      console.log("OTP Send Failed");
      errorCB(data);
    }
    if (error) {
      console.log(error);
      errorCB(error);
    }
  });
};

//verifyOtp

let verifyOtp = function (mobile, otp, successCB, errorCB) {
  sendOtp.verify(mobile,otp,function(error, data, res){
    console.log(data);
    //result = data;
    if(data.type == 'success')
    {
      console.log("OTP Verified Successfully!!!");
      successCB(data);
    }
    if (data.type == 'error') {
      console.log("Verification Failed");
      errorCB(data);
    }
    if (error) {
      console.log(error);
      errorCB(error);
    }
  });
};

module.exports = {otpToSub,verifyOtp}
