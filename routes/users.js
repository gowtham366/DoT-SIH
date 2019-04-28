var Router = require('express').Router();
var User = require('../models/user_schema');
// const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const requestIp = require('request-ip');
Router.post('/',(req, res, next) => {
  // const cipher = crypto.createCipher('aes192', 'password');
  // let encrypted = cipher.update(req.body.password, 'utf8', 'hex');
  // encrypted = cipher.final('hex');
  //
  // let password = encrypted;

  var user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    createdIpAddress: requestIp.getClientIp(req)
  })
  user.save(function(err, result) {
    if(err) {
      console.log(err);
      res.status(500).json({
        "result": {
          status: false,
          message: 'An error occured while creating',
          error: err
        }
        
      });
    }
    else{
      console.log(result);
      res.status(201).json({
        "result": {
          status: true,
          message: 'User created successfully',
          obj: result
        }
      });
    }
  });
});

Router.post('/signin', function(req, res, next) {

  User.findOne({email: req.body.email} , function(err, result) {
    if(err) {
      console.log(err);
      res.status(500).json({
        "result": {
          status: false,
          message: 'An error occured while creating',
          error: err
        }
      });
    }
    if(result === null) {
      res.status(401).json({
        "result": {
          status: false,
          message: 'Check your mail ID/ password'
        }
      });
    }
    else {
      if(!bcrypt.compareSync(req.body.password, result.password)) {
        res.status(401).json({
          "result": {
            status: false,
            message: 'Check your mail ID/ password'
          }
        });
      }
      else {
        // token creation
        var token = jwt.sign({user: result}, 'MyS3CR3T', {expiresIn: 7200});
        res.status(200).json({
          "result": {
            status: true,
            message: 'Login Successful',
            token: token,
            userId: result._id,
            name: result.firstName
          } 
        });
      }//inner else
    }//outer else
  });
});

module.exports = Router;
