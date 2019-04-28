var Router = require('express').Router();
const tspSchema = require('../models/tsp_schema');
const UserDetail = require('../models/user_schema');
const appfun = require('../appfunctions/functions');
var Cryptr = require('cryptr'),cryptr = new Cryptr('MyS3CR3TKeY');
const requestIp = require('request-ip');
const bcrypt = require('bcrypt');
var json2csv = require('json2csv');
const jwt = require('jsonwebtoken');
var fs = require('fs');


var email = "";
var ipAddress = "";
// this method executes on each req
Router.use('/', function(req, res, next) {
  jwt.verify(req.query.token, 'MyS3CR3T', function(err, decoded) {
    if (err) {
        res.status(401).json({
        status: false,
        message: 'Not Authenticated',
        error: err
      });
    }
    else{
        // update lastLogin and ipAddress
        ipAddress = requestIp.getClientIp(req); 
        UserDetail.update({email:email},{$push:{loginIpAddress : ipAddress,lastLogin : new Date().format("Y-MM-dd HH:mm:SS")}}, function(error, result){
          if(result)
          {
            console.log("ip stored ", result);
            next();
          }
          if(error)
          {
            console.log(error);
          }
        });
        //next();
    }
  });
});

//ip test
Router.get('/ip', function(req, res, next){
  const clientIp = requestIp.getClientIp(req);
  console.log(clientIp);
  res.json({clientIp: clientIp});
});

//Setting up limit
Router.post('/setLimit', function(req, res, next){
  console.log(req.body);

});


//Add TSP
Router.post('/addTsp', function(req, res, next){
  console.log(req.body);
  var Tsp = new tspSchema({
    operator: req.body.operator,
    password: bcrypt.hashSync(req.body.password, 10),
    region: req.body.region,
    authKey: cryptr.encrypt(req.body.operator),
      createdIpAddress: requestIp.getClientIp(req)
  });
  Tsp.save(function(err, result) {
    if(err) {
        console.log(err);
        res.status(500).json({
        status: false,
        message: 'An error occured while creating',
        error: err
      })
    }
    else {
        console.log(result);
        res.status(201).json({
          status: true,
          message: 'TSP created successfully!!!',
          key:result.authKey,
          obj: result
      });
    }
  });
});//addTsp


//getSubscriber
Router.post('/getSubscriber',function(req, res, next){
  // var aadhar = decryptAadhar(req.aadharNumber);
   var decoded = jwt.decode(req.query.token);
  appfun.getSubscriber(req.body.aadharNumber, function(success){
    if(success){
      res.json({
        status:true,
        message:'Subscriber details found!!!',
        obj: success
      });
    }
  }, function(error){
    if(error){
      res.json({
          status:false,
          message: 'Failed to get subscriber details',
          error: error
         });
    }
  });
});

//generateReport
Router.get('/generateReport', function(req, res, next){
  appfun.generateReport(req.query.limit, function(success){
    if (success) {
      res.status(200).json({
        status: true,
        message: 'Report generated successfully!!!',
        obj: success
      });
    }
  }, function(error){
    res.status(500).json({
      status: false,
      message: 'Failed to generate report',
      error: error
    });
  });
});

module.exports = Router;
