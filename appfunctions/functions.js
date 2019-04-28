const aadharDetails = require('../models/aadhar_schema');
const UserDetail = require('../models/user_schema');
const droppedDetail = require('../models/droppedNumber_schema');
var forEach = require('async-foreach').forEach;
//check and add subscriber
//var count = 1;
let checkndadd = function(req, successCB, errorCB) {
  aadharDetails.findOne({aadharNumber: req.aadharNumber},function(error, result){
    if(error){
      console.log(error);
      errorCB({status: false, message: error});
    }
    if(result === null){
      console.log(result);
      addNewSubscriber(req, successCB, errorCB);
    }
    else{
      console.log(result);
      if (result.MobileDetails.length < 9) {
          updateExistingSubscriber(req, successCB, errorCB);
      }
      else {
          errorCB({status: false, message: "Subscriber limit reached"});
      }
    }
    //return status;
  });
};

//addNewSubscriber
function addNewSubscriber(req, successCB, errorCB) {
  var addSub = new aadharDetails(req);
  addSub.save(function(error,result){
    if(error)
    {
      console.log(error);
      return errorCB({status : false, message : error});
    } else {
      console.log(result);
      return successCB({status : true, message : "Subscriber added Successfully!!!", obj: result});
    }
  });
}

//updateExistingSubscriber
function updateExistingSubscriber(req, successCB, errorCB) {
  uniqueNumber(req, function(value) {
    if(value){
      aadharDetails.update({aadharNumber: req.aadharNumber},{$push:{MobileDetails:req.MobileDetails}},function(error,result){
        if(error)
        {
          console.log(error);
          return errorCB({status: false, message: error});
        }
        if(result.n)
        {
          console.log(result);
          return successCB({status: true, message : "Subscriber added successfully!!!"});
        }
        else {
          console.log(result);
          return errorCB({status: true, message : "Subscriber addition failed"});
        }
      });
    }
    else {
      return errorCB({status: false, message: "Mobile Number Already Exist!!!"});
    }
  });
}

//uniqueNumber
function uniqueNumber(req, callBack) {
  aadharDetails.find({'MobileDetails.number':req.MobileDetails[0].number},function(error, result){
    console.log(result);
    if(error){
      console.log(error);
      callBack(false);
    }
    if(result.length > 0)
    {
      console.log("Not uniqueNumber");
      callBack(false);
    } else {
      console.log("uniqueNumber");
      callBack(true);
    }
  });
}

//getSubscriber
let getSubscriber = function(req, successCB, errorCB) {
  aadharDetails.findOne({'aadharNumber':req},function(error, result){
    if(error){
      console.log(error);
      errorCB(error);
    }
    if(result === null){
      console.log(result);
      errorCB(result);
    }
    else
    {
      console.log(result);
      successCB(result);
    }
  });
};

//validateSubscriber
function validateSubscriber(aadhar, mobile, successCB, errorCB){
  aadharDetails.findOne({'MobileDetails.number': mobile},function(error, result){
    if (error) {
      console.log(error);
      errorCB(error);
    }
    console.log(result);
    if (result !== null && result.aadharNumber === aadhar) {
      console.log(true);
      successCB(true);
    }
    else {
      console.log(false);
      errorCB(false);
    }
  });
};


//deleteSubscriber
let checknddelete = function(req, operator, ip, successCB, errorCB){
  console.log(req.aadharNumber,req.mobileNumber,operator);
   aadharDetails.find({$and:[ {"aadharNumber":req.aadharNumber}, {"MobileDetails.number":req.mobileNumber}, {"MobileDetails.operator":operator} ]}, function(error, result){
    if (error) {
      console.log(error);
      errorCB(error);
    }//error find
     if (result.length > 0) {
       console.log("found",result);
       console.log("Valid subscriber");
       //successCB("Valid Subscriber");
       var count = 0;
       forEach(result, function(aadhar, aadharIndex, aadharArr){
         console.log("aadhar -> ",aadhar.aadharNumber);
         //successCB("Valid Subscriber");
        forEach(aadhar.MobileDetails, function(mobile, mobileIndex, mobileArr){
          if(mobile.number === req.mobileNumber && mobile.operator === operator){
            console.log("-->Matched");
            var MobileDetails= [{
              number: mobile.number,
              operator: mobile.operator,
              region: mobile.region,
              dropStatus: mobile.dropStatus,
              reason: req.reason,
              ipAddress: ip
            }];
            var dropDetail = new droppedDetail({
              aadharNumber: aadhar.aadharNumber,
              name: aadhar.name,
              MobileDetails: MobileDetails
            });
            console.log("Details-->",dropDetail);
            dropDetail.save(function(error,result){
              if(error){
                console.log("Drop save error");
                droppedDetail.update({aadharNumber: aadhar.aadharNumber},{$push:{MobileDetails: MobileDetails}},function(error2,result2){
                  if(error2){
                    console.log("Drop update error");
                  }
                  else if(result2){
                  //  count++;
                    //pull
                    aadharDetails.update({aadharNumber: aadhar.aadharNumber},{$pull:{MobileDetails: {number: MobileDetails.number}}}, function(error3,result3){
                      if(error3){
                        console.log("Errorr of pull");
                      }
                      else if(result3){
                        count++;
                        console.log(result3);
                        console.log("Pull request Success!!!");
                      }
                    });

                    //console.log("Subscriber drop updated successfully");
                  }
                });
              }
              else if(result){
                //count++;
                //pull
                aadharDetails.update({aadharNumber: aadhar.aadharNumber},{$pull:{MobileDetails: MobileDetails.number}}, function(error3,result3){
                  if(error3){
                    console.log("Errorr of pull");
                  }
                  else if(result3){
                    count++;
                    console.log("Pull request Success!!!");
                  }
                });
                console.log("Subscriber added to drop");
              }
            });

          }
        });// forEach mobileDetails


       });//forEach aadhar
       if(count != 0){
         successCB("true");
       }
       else {
         errorCB("false");
       }

    }//if subscriber validation
    else {
      console.log(result);
      errorCB("Not a valid subscriber");
    }
  });
};


//generateReport
let generateReport = function(req, successCB, errorCB){
  console.log("Generating Report...",req);
  var con = "this.MobileDetails.length > "+ req;
  aadharDetails.find({$where : con }, function(error, result){
    if (result) {
      console.log(result);
    //  var fields = ['subscriberDetails.aadharNumber', 'subscriberDetails.MobileDetails.number', 'subscriberDetails.MobileDetails.operator', 'subscriberDetails.MobileDetails.dateOfReg'];
      if (result.length > 0) {

        //export as csv
        // var csvObj = JSON.stringify(arrobj);
        // var csv = json2csv({ data: csvObj, fields: fields });
        // fs.writeFile('file.csv', csv, function(err) {
        // if (err) throw err;
        // console.log('fileed');
        // });

        //

          successCB(result);
      }
      else {
        errorCB("No Subscriber Found");
      }
    }
    if (error) {
      console.log(error);
      errorCB(error);
    }
  });
};

module.exports = {
  checkndadd,
  getSubscriber,
  validateSubscriber,
  checknddelete,
  generateReport,
};
